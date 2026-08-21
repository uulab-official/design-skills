import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class CaptureAndPlatformContractTests(unittest.TestCase):
    def test_capture_tool_is_documented_and_manifest_driven(self):
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        script = (ROOT / "scripts" / "capture_community_evidence.mjs").read_text(encoding="utf-8")
        browser_qa = (ROOT / "scripts" / "qa_community_runtime.mjs").read_text(encoding="utf-8")
        spec = (ROOT / "examples" / "community" / "design-spec.md").read_text(encoding="utf-8")

        self.assertEqual(package["scripts"]["capture:community"], "node scripts/capture_community_evidence.mjs")
        self.assertEqual(package["scripts"]["test:browser"], "node scripts/qa_community_runtime.mjs")
        self.assertIn('"playwright"', json.dumps(package["devDependencies"]))
        self.assertIn("evidence/manifest.json", script)
        self.assertIn('resolve(COMMUNITY_ROOT, "evidence")', script)
        self.assertIn("page.screenshot", script)
        visual = (ROOT / "scripts" / "compare_community_visuals.mjs").read_text(encoding="utf-8")
        self.assertIn("pixelmatch", visual)
        self.assertIn("visual-baseline", visual)
        self.assertIn("MAX_MISMATCH_RATIO", visual)
        self.assertIn("url-restoration", browser_qa)
        self.assertIn("composer-focus-return", browser_qa)
        self.assertIn("drawer-focus-return", browser_qa)
        self.assertIn("npm run test:browser", spec)
        self.assertIn("npm run capture:community", spec)

    def test_platform_parity_note_covers_declared_targets_and_required_behaviors(self):
        parity = (ROOT / "references" / "platform-parity.md").read_text(encoding="utf-8")
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        parity_lower = parity.lower()
        for term in ("responsive web", "ios / swiftui", "android / jetpack compose", "safe areas", "back / dismissal", "keyboard / focus", "feedback"):
            self.assertIn(term, parity_lower)
        self.assertIn("platform-parity.md", skill)
        self.assertRegex(parity, re.compile(r"review-ready", re.IGNORECASE))

    def test_community_demo_imagery_is_local_and_tracked(self):
        community = ROOT / "examples" / "community"
        source_files = (community / "app.js", community / "index.html", community / "board.css")
        combined = "\n".join(path.read_text(encoding="utf-8") for path in source_files)
        self.assertNotIn("images.unsplash.com", combined)

        for relative_path in (
            "assets/editorial/group-overlook.jpg",
            "assets/editorial/desk-ritual.jpg",
            "assets/editorial/collaborative-table.jpg",
            "assets/editorial/cinema-afterglow.jpg",
        ):
            asset = community / relative_path
            self.assertTrue(asset.is_file(), relative_path)
            self.assertGreater(asset.stat().st_size, 1024, relative_path)
            self.assertIn(relative_path, combined)

    def test_community_metadata_and_fonts_are_local(self):
        community = ROOT / "examples" / "community"
        for page_name in ("index.html", "board.html"):
            page = (community / page_name).read_text(encoding="utf-8")
            self.assertIn('rel="icon"', page)
            self.assertIn('property="og:image"', page)
            self.assertIn('name="twitter:image"', page)
            self.assertIn('./assets/fonts.css', page)
            self.assertNotIn("fonts.googleapis.com", page)

        fonts_css = (community / "assets" / "fonts.css").read_text(encoding="utf-8")
        self.assertNotIn("fonts.gstatic.com", fonts_css)
        self.assertIn("dm-sans-latin.woff2", fonts_css)
        self.assertIn("fraunces-latin.woff2", fonts_css)
        for font_name in (
            "assets/fonts/dm-sans-latin.woff2",
            "assets/fonts/dm-sans-latin-ext.woff2",
            "assets/fonts/fraunces-latin.woff2",
            "assets/fonts/fraunces-latin-ext.woff2",
        ):
            font = community / font_name
            self.assertTrue(font.is_file(), font_name)
            self.assertGreater(font.stat().st_size, 1024, font_name)


if __name__ == "__main__":
    unittest.main()
