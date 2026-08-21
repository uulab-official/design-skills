import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

import sys

sys.path.insert(0, str(ROOT))

from scripts.validate_skill import validate_project  # noqa: E402


class SkillHandoffContractTests(unittest.TestCase):
    def test_dependency_free_validator_passes(self):
        result = validate_project(ROOT)
        self.assertTrue(result["ok"], result["errors"])
        self.assertLessEqual(result["metrics"]["skill_lines"], 500)

    def test_pressure_scenarios_preserve_product_specific_contract(self):
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8").lower()
        scenarios = (ROOT / "tests" / "fixtures" / "pressure-scenarios.md").read_text(
            encoding="utf-8"
        ).lower()

        scenario_requirements = {
            "community mobile": (
                "ios",
                "android",
                "community archetype",
                "generic five-tab shell",
                "composer",
            ),
            "saas web dashboard": (
                "responsive web",
                "dashboard/admin archetype",
                "filters",
                "dense tables",
                "narrow breakpoints",
            ),
            "camera game": (
                "camera",
                "game constraints",
                "thumb-reachable controls",
                "denied camera",
                "recognition failure",
            ),
        }
        for scenario, requirements in scenario_requirements.items():
            self.assertIn(scenario, scenarios)
            section_start = scenarios.index("## " + scenario)
            section = " ".join(
                scenarios[section_start : scenarios.find("\n## ", section_start + 4)].split()
            )
            for requirement in requirements:
                self.assertIn(requirement, section)
        for requirement in (
            "platform",
            "archetype",
            "visual direction",
            "realistic content/assets",
            "rendered target sizes",
            "representative states",
            "visual fidelity",
            "release-ready",
            "generic",
        ):
            self.assertIn(requirement, skill)

    def test_community_example_records_handoff_evidence(self):
        spec = (ROOT / "examples" / "community" / "design-spec.md").read_text(
            encoding="utf-8"
        ).lower()
        for requirement in (
            "readiness level",
            "rendered evidence",
            "review scores",
            "production readiness",
            "open findings",
        ):
            self.assertIn(requirement, spec)


if __name__ == "__main__":
    unittest.main()
