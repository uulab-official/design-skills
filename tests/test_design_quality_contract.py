import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DesignQualityContractTests(unittest.TestCase):
    def test_skill_requires_visual_fidelity_evidence_before_release_ready_claim(self):
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        visual_fidelity = ROOT / "references" / "visual-fidelity.md"
        rubric = (ROOT / "references" / "review-rubric.md").read_text(encoding="utf-8")

        self.assertTrue(visual_fidelity.is_file())
        self.assertIn("visual-fidelity.md", skill)
        self.assertIn("release-ready", skill)
        self.assertIn("rendered", skill.lower())
        self.assertIn("visual fidelity", rubric.lower())
        self.assertIn("evidence", rubric.lower())


if __name__ == "__main__":
    unittest.main()
