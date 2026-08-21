import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ArchetypeBenchmarkTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload = json.loads(
            (ROOT / "references" / "archetype-benchmarks.json").read_text(encoding="utf-8")
        )

    def test_benchmarks_cover_distinct_product_jobs(self):
        benchmarks = self.payload["benchmarks"]
        self.assertEqual({item["id"] for item in benchmarks}, {"camera-capture", "camera-game", "saas-operations", "messaging-thread"})
        self.assertEqual(len({item["primary_surface"] for item in benchmarks}), 4)

    def test_each_benchmark_is_task_led_and_not_release_ready(self):
        for benchmark in self.payload["benchmarks"]:
            with self.subTest(benchmark=benchmark["id"]):
                self.assertTrue(benchmark["navigation"])
                self.assertTrue(benchmark["primary_surface"])
                self.assertGreaterEqual(len(benchmark["screens"]), 3)
                self.assertGreaterEqual(len(benchmark["states"]), 4)
                self.assertNotEqual(benchmark["readiness"], "release-ready")
                self.assertEqual(benchmark["visual_fidelity"]["status"], "not rendered")
                self.assertTrue(benchmark["review_findings"])

    def test_benchmarks_reject_community_chrome_reuse(self):
        for benchmark in self.payload["benchmarks"]:
            with self.subTest(benchmark=benchmark["id"]):
                avoid = " ".join(benchmark["avoid"]).lower()
                self.assertTrue(
                    any(term in avoid for term in ("generic", "bottom navigation", "feed-style", "decorative", "marketing hero")),
                    avoid,
                )


if __name__ == "__main__":
    unittest.main()
