import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

import sys

sys.path.insert(0, str(ROOT))

from scripts.validate_example_evidence import validate_evidence  # noqa: E402


class ExampleEvidenceTests(unittest.TestCase):
    def test_capture_matrix_and_runtime_checks_are_complete(self):
        result = validate_evidence(ROOT)
        self.assertTrue(result["ok"], result["errors"])
        self.assertEqual(result["metrics"]["captures"], 8)
        self.assertEqual(result["metrics"]["runtime_checks"], 23)

    def test_capture_widths_match_declared_viewports(self):
        result = validate_evidence(ROOT)
        self.assertEqual(result["metrics"]["measured_images"]["board-wide"][0], 1440)
        self.assertEqual(result["metrics"]["measured_images"]["board-mobile"][0], 390)

    def test_visual_baselines_cover_representative_surfaces(self):
        baseline_dir = ROOT / "examples" / "community" / "evidence" / "visual-baseline"
        for baseline in ("prototype-wide.png", "prototype-mobile.png", "prototype-discover-wide.png", "board-wide.png"):
            path = baseline_dir / baseline
            self.assertTrue(path.is_file(), baseline)
            self.assertGreater(path.stat().st_size, 1024, baseline)


if __name__ == "__main__":
    unittest.main()
