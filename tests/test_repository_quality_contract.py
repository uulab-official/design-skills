import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class RepositoryQualityContractTests(unittest.TestCase):
    def test_package_exposes_one_quality_command(self):
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        scripts = package["scripts"]
        self.assertEqual(
            scripts["ci:quality"],
            "npm run test && npm run validate:evidence && npm run validate:skill",
        )
        self.assertEqual(scripts["test:visual"], "node scripts/compare_community_visuals.mjs")
        self.assertEqual(scripts["update:visual"], "node scripts/compare_community_visuals.mjs --update")
        self.assertIn("validate:skill", scripts)

    def test_workflow_runs_contracts_and_uploads_rendered_evidence(self):
        workflow = (ROOT / ".github" / "workflows" / "quality.yml").read_text(encoding="utf-8")
        for required in (
            "pull_request:",
            "npm run ci:quality",
            "npx playwright install --with-deps chromium",
            "npm run capture:community",
            "npm run test:browser",
            "npm run test:visual",
            "npm run validate:evidence",
            "actions/upload-artifact@v4",
        ):
            self.assertIn(required, workflow)

    def test_public_docs_explain_the_same_quality_loop(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        contributing = (ROOT / "CONTRIBUTING.md").read_text(encoding="utf-8")
        roadmap = (ROOT / "docs" / "superpowers" / "plans" / "2026-08-21-design-skills-v0.3-contributor-automation.md").read_text(encoding="utf-8")
        for document in (readme, contributing):
            self.assertIn("npm run ci:quality", document)
            self.assertIn("npm run capture:community", document)
            self.assertIn("release-ready", document)
        self.assertIn("CI-rendered visual review", roadmap)


if __name__ == "__main__":
    unittest.main()
