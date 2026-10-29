#!/usr/bin/env node
/** Integration proof: actual local Chromium capture, viewport matrix and DOM warnings. */
import {createServer} from 'node:http';
import {tmpdir} from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const exec = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const capture = path.join(root, 'skills', 'design-taste', 'scripts', 'capture.mjs');

const healthy = '<!doctype html><html lang="en"><head><title>UULAB Inventory</title></head>' +
  '<body style="max-width:800px;margin:auto;font:16px Arial">' +
  '<main><h1>Inventory</h1><p>Available: 17 items</p>' +
  '<button style="min-width:90px;min-height:50px">Scan item</button></main></body></html>';
const flawed = '<!doctype html><html lang="en"><head></head><body>' +
  '<div style="width:1200px"><h1>Problem state</h1>' +
  '<img src="/notfound.png" alt="broken preview">' +
  '<button style="width:20px;height:20px">x</button></div></body></html>';
const server = createServer((req, res) => {
  if (req.url === '/healthy') {
    res.writeHead(200, {'content-type': 'text/html; charset=utf-8'}); res.end(healthy);
  } else if (req.url === '/flawed') {
    res.writeHead(200, {'content-type': 'text/html; charset=utf-8'}); res.end(flawed);
  } else {
    res.writeHead(404); res.end('not found');
  }
});
const must = (condition, msg) => { if (!condition) throw new Error(msg); };

const temp = await fs.mkdtemp(path.join(tmpdir(), 'design-taste-capture-'));
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const manifest = path.join(temp, 'screens.json');
  const out = path.join(temp, 'evidence');
  await fs.writeFile(manifest, JSON.stringify({
    schema_version: 1,
    screens: [
      {name: 'healthy', state: 'ready', path: '/healthy',
        viewports: [{width: 390, height: 844}, {width: 1280, height: 800}],
        expectText: ['Inventory', 'Available: 17 items']},
      {name: 'flawed', state: 'error', path: '/flawed',
        viewports: [{width: 390, height: 844}],
        expectText: ['Expected recovery instruction']},
    ],
  }));
  await exec(process.execPath, [capture, '--url', base, '--platform', 'app',
    '--manifest', manifest, '--out', out], {timeout: 120000});
  const report = JSON.parse(await fs.readFile(path.join(out, 'report.json'), 'utf8'));
  must(report.schema_version === 2, 'report schema');
  must(report.views.length === 3, 'expected three actual browser captures');
  const clean = report.views.filter(x => x.screen === 'healthy');
  must(clean.length === 2, 'two healthy widths');
  must(clean.every(x => x.missingText.length === 0), 'healthy content verification');
  must(clean.every(x => x.observations.brokenImages.length === 0), 'healthy images');
  for (const view of report.views) {
    must((await fs.stat(path.join(out, view.screenshot))).size > 0, 'missing screenshot ' + view.screenshot);
  }
  const codes = new Set(report.findings.filter(x => x.screen === 'flawed').map(x => x.code));
  for (const c of ['horizontal-overflow', 'broken-images', 'small-touch-targets',
                   'missing-document-title', 'missing-expected-text']) {
    must(codes.has(c), 'missing actual DOM finding: ' + c);
  }

  const unsafe = path.join(temp, 'unsafe.json');
  await fs.writeFile(unsafe, JSON.stringify({schema_version: 1, screens: [
    {name: 'external', path: '//example.org/', viewports: [{width: 390, height: 844}]},
  ]}));
  const rejection = await exec(process.execPath, [capture, '--url', base, '--platform', 'web',
    '--manifest', unsafe, '--out', path.join(temp, 'blocked')], {timeout: 15000})
    .then(() => false, error => error.code === 2);
  must(rejection, 'external-origin capture path must be rejected');

  console.log('Design Taste Chromium integration PASS: 3 captures, warnings and origin guard');
} finally {
  await new Promise(resolve => server.close(resolve));
  await fs.rm(temp, {recursive: true, force: true});
}
