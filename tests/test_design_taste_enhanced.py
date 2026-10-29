"""Design Taste: source and direction contracts, grounded selection and anti-template heuristics."""
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "design-taste"
DRAW = SKILL / "scripts" / "draw.py"
AUDIT = SKILL / "scripts" / "audit.py"


def run_draw(platform, *extra):
    proc = subprocess.run(
        [sys.executable, str(DRAW), "--platform", platform,
         "--brief", "Korean inventory barcode scan and historical stock movement", "--seed", "19", *extra],
        capture_output=True, text=True, check=True,
    )
    return json.loads(proc.stdout)


class DesignTasteEnhancedTests(unittest.TestCase):
    def test_source_registry_is_research_only_and_unique(self):
        data = json.loads((SKILL / "library" / "reference-sources.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(data["sources"]), 15)
        self.assertEqual(len({item["id"] for item in data["sources"]}), len(data["sources"]))
        for item in data["sources"]:
            self.assertEqual(item["reuse"], "study-only")
            self.assertTrue(item["url"].startswith("https://"))
            self.assertTrue(item["study_question"])
            self.assertTrue(item["platforms"])
        for mode in ("web", "app", "game"):
            self.assertTrue(any(mode in item["platforms"] for item in data["sources"]))

    def test_24_craft_moves_have_genuinely_distinct_axes(self):
        data = json.loads((SKILL / "library" / "craft-moves.json").read_text(encoding="utf-8"))
        self.assertEqual(len(data["moves"]), 24)
        for platform in ("web", "app", "game"):
            rows = [x for x in data["moves"] if x["platform"] == platform]
            self.assertEqual(len(rows), 8)
            self.assertEqual(len({x["axis"] for x in rows}), 8)
            for row in rows:
                self.assertTrue(row["acceptance_question"])
                self.assertTrue(row["stress_states"])

    def test_selector_reproducibly_deals_three_different_compositions(self):
        for platform in ("web", "app", "game"):
            a, b = run_draw(platform), run_draw(platform)
            self.assertEqual(a, b)
            self.assertEqual(a["schema_version"], 2)
            self.assertEqual(len(a["options"]), 3)
            self.assertEqual(len({x["composition_move"]["axis"] for x in a["options"]}), 3)
            self.assertEqual(len({x["visual_direction"]["id"] for x in a["options"]}), 3)
            self.assertEqual(len(a["references_to_review"]), 2)
            self.assertTrue(a["warnings"])
            self.assertEqual(a["status"], "unvalidated_design_options")

    def test_grounded_facts_are_retained_without_inventing_values(self):
        with tempfile.TemporaryDirectory() as tmp:
            context = Path(tmp) / "context.json"
            context.write_text(json.dumps({
                "facts": ["65×50mm original photo magnet", "stock scan works offline", "inventory movement is timestamped"],
                "brand": "UULAB", "audience": "shop operator",
                "primary_job": "scan and correct stock",
                "constraints": ["Keep existing design tokens"], "avoid": ["unverified growth metrics"]
            }), encoding="utf-8")
            payload = run_draw("app", "--context", str(context))
            self.assertEqual(payload["brand"], "UULAB")
            self.assertEqual(len(payload["facts"]), 3)
            self.assertEqual(payload["primary_job"], "scan and correct stock")
            self.assertFalse(any("Supply >=3" in x for x in payload["warnings"]))
            self.assertTrue(all(x["approved_brand_to_preserve"] == "UULAB" for x in payload["options"]))
            self.assertTrue(all("unverified growth metrics" in x["deliberate_exclusions"] for x in payload["options"]))

    def test_draw_refuses_invalid_context_and_unsafe_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            context = Path(tmp) / "context.json"
            context.write_text('{"facts": "fake"}', encoding="utf-8")
            p = subprocess.run([sys.executable, str(DRAW), "--platform", "web",
                "--brief", "web product", "--context", str(context)], capture_output=True, text=True)
            self.assertEqual(p.returncode, 2)
            out = Path(tmp) / "options.json"
            cmd = [sys.executable, str(DRAW), "--platform", "app", "--brief", "a real task", "--out", str(out)]
            subprocess.run(cmd, check=True, capture_output=True)
            self.assertEqual(subprocess.run(cmd, capture_output=True).returncode, 2)
            subprocess.run(cmd + ["--force"], check=True, capture_output=True)

    def test_auditor_finds_unfinished_actions_without_claiming_ai_origin(self):
        with tempfile.TemporaryDirectory() as tmp:
            file = Path(tmp) / "home.tsx"
            file.write_text(
                '<div><h1>Revolutionize your workflow</h1><a href="#">Go</a>'
                '<button onClick={() => {}}>Click</button><p>Lorem ipsum</p></div>', encoding="utf-8"
            )
            proc = subprocess.run([sys.executable, str(AUDIT), "--path", tmp, "--platform", "web",
                                   "--json", "--strict"], capture_output=True, text=True)
            self.assertEqual(proc.returncode, 1, proc.stderr)
            report = json.loads(proc.stdout)
            codes = {x["code"] for x in report["findings"]}
            self.assertTrue({"dead-anchor", "empty-click-handler", "placeholder-content",
                             "category-default-copy"}.issubset(codes))
            self.assertIn("not AI authorship", report["disclaimer"])

    def test_auditor_does_not_ban_legitimate_dashboard_grid(self):
        with tempfile.TemporaryDirectory() as tmp:
            file = Path(tmp) / "view.tsx"
            file.write_text(
                '<main><h1>Stock movements</h1><div className="grid-cols-3">'
                '<Card>Received: 7</Card><Card>Reserved: 2</Card>'
                '<Card>Available: 5</Card></div></main>', encoding="utf-8"
            )
            proc = subprocess.run([sys.executable, str(AUDIT), "--path", tmp,
                                   "--platform", "app", "--json", "--strict"],
                                  capture_output=True, text=True)
            self.assertEqual(proc.returncode, 0, proc.stderr)
            self.assertEqual(json.loads(proc.stdout)["findings"], [])

    def test_auditor_flags_three_card_website_as_review_not_failure(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "landing.tsx").write_text(
                '<div className="grid-cols-3"><FeatureCard/><FeatureCard/><FeatureCard/></div>',
                encoding="utf-8"
            )
            p = subprocess.run([sys.executable, str(AUDIT), "--path", tmp, "--platform", "web",
                                "--strict", "--json"], capture_output=True, text=True)
            self.assertEqual(p.returncode, 0)
            report = json.loads(p.stdout)
            self.assertEqual(report["counts"]["review"], 1)
            self.assertEqual(report["findings"][0]["code"], "three-card-template")

    def test_auditor_skips_dependency_noise(self):
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "node_modules" / "someone.html"
            f.parent.mkdir(parents=True)
            f.write_text("Lorem ipsum", encoding="utf-8")
            p = subprocess.run([sys.executable, str(AUDIT), "--path", tmp, "--platform", "web", "--json"],
                               capture_output=True, text=True, check=True)
            self.assertEqual(json.loads(p.stdout)["files_checked"], 0)

    def test_node_syntax(self):
        if not shutil.which("node"):
            self.skipTest("Node not installed")
        subprocess.run(["node", "--check", str(SKILL / "scripts" / "capture.mjs")],
                       capture_output=True, text=True, check=True)


if __name__ == "__main__":
    unittest.main()
