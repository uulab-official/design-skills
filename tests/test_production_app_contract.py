import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ProductionAppContractTests(unittest.TestCase):
    def test_app_work_requires_figma_quality_board_and_production_surface(self):
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        production = ROOT / "references" / "production-app-design.md"
        rubric = (ROOT / "references" / "review-rubric.md").read_text(encoding="utf-8")

        self.assertTrue(production.is_file())
        self.assertIn("production-app-design.md", skill)
        self.assertIn("Figma-equivalent", skill)
        self.assertIn("production-grade", skill)
        self.assertIn("prototype", production.read_text(encoding="utf-8").lower())
        self.assertIn("production readiness", rubric.lower())


if __name__ == "__main__":
    unittest.main()
