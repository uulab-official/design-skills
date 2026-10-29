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


class DesignTasteTests(unittest.TestCase):
    def test_independent_skill_contract(self):
        content = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        self.assertTrue(content.startswith("---\nname: design-taste\n"))
        self.assertIn("web", content)
        self.assertIn("Expo", content)
        self.assertIn("Unity", content)
        for name in ("references/platform-guides.md", "references/critique.md",
                     "library/directions.json", "scripts/capture.mjs", "scripts/draw.py"):
            self.assertTrue((SKILL / name).is_file(), name)

    def test_direction_library_has_multiple_nonidentical_options(self):
        data = json.loads((SKILL / "library" / "directions.json").read_text(encoding="utf-8"))
        ids = [item["id"] for item in data["directions"]]
        self.assertEqual(len(ids), len(set(ids)))
        for platform in ("web", "app", "game"):
            subset = [item for item in data["directions"] if item["platform"] == platform]
            self.assertGreaterEqual(len(subset), 5)
            self.assertEqual(len({item["composition"] for item in subset}), len(subset))

    def test_selector_deterministic_and_distinct(self):
        for platform in ("web", "app", "game"):
            argv = [sys.executable, str(DRAW), "--platform", platform,
                    "--brief", "Real product with multilingual UI", "--seed", "19"]
            first = subprocess.run(argv, capture_output=True, text=True, check=True).stdout
            second = subprocess.run(argv, capture_output=True, text=True, check=True).stdout
            self.assertEqual(first, second)
            payload = json.loads(first)
            self.assertEqual(len(payload["options"]), 3)
            self.assertEqual(len({row["id"] for row in payload["options"]}), 3)
            self.assertTrue(all(row["platform"] == platform for row in payload["options"]))

    def test_selector_refuses_accidental_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "directions.json"
            cmd = [sys.executable, str(DRAW), "--platform", "app",
                   "--brief", "Expo diary", "--out", str(out)]
            subprocess.run(cmd, capture_output=True, text=True, check=True)
            rejected = subprocess.run(cmd, capture_output=True, text=True)
            self.assertEqual(rejected.returncode, 2)
            subprocess.run(cmd + ["--force"], capture_output=True, text=True, check=True)

    def test_capture_has_valid_node_syntax_when_node_available(self):
        if not shutil.which("node"):
            self.skipTest("Node runtime unavailable")
        subprocess.run(["node", "--check", str(SKILL / "scripts" / "capture.mjs")],
                       capture_output=True, text=True, check=True)


if __name__ == "__main__":
    unittest.main()
