import json
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests" / "fixtures" / "sample-expo"
sys.path.insert(0, str(ROOT))

from scripts.inspect_project import inspect_project  # noqa: E402


class InspectProjectTests(unittest.TestCase):
    def test_inspects_an_expo_project_without_scanning_ignored_directories(self):
        result = inspect_project(FIXTURE)

        self.assertEqual(result["project_type"], "react-native-or-expo")
        self.assertIn("expo", result["platform_hints"])
        self.assertIn("package.json", result["package_managers"])
        self.assertIn("src/components", result["directories"])
        self.assertIn("app/(tabs)/index.tsx", result["screens_or_routes"])
        self.assertIn("src/components/Button.tsx", result["components"])
        self.assertEqual(result["assets"], [])
        self.assertNotIn("node_modules", json.dumps(result))

    def test_cli_emits_json_for_a_project_path(self):
        completed = subprocess.run(
            [
                sys.executable,
                str(ROOT / "scripts" / "inspect_project.py"),
                "--path",
                str(FIXTURE),
                "--json",
            ],
            check=False,
            capture_output=True,
            text=True,
        )

        self.assertEqual(completed.returncode, 0, completed.stderr)
        payload = json.loads(completed.stdout)
        self.assertEqual(payload["project_type"], "react-native-or-expo")


if __name__ == "__main__":
    unittest.main()
