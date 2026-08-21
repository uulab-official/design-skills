import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / "examples" / "community"


class CommunityExampleContractTests(unittest.TestCase):
    def setUp(self):
        self.html = (EXAMPLE / "index.html").read_text(encoding="utf-8")
        self.js = (EXAMPLE / "app.js").read_text(encoding="utf-8")
        self.css = (EXAMPLE / "styles.css").read_text(encoding="utf-8")

    def test_composer_exposes_an_accessible_validation_state(self):
        self.assertIn('aria-describedby="composerTitleError"', self.html)
        self.assertIn('id="composerTitleError" role="alert"', self.html)
        self.assertIn('required maxlength="80"', self.html)
        self.assertIn('id="composerForm" method="dialog" novalidate', self.html)
        self.assertIn('aria-invalid', self.js)
        self.assertIn('setAttribute("aria-invalid", "true")', self.js)
        self.assertIn('removeAttribute("hidden")', self.js)
        self.assertIn('addEventListener("invalid"', self.js)
        self.assertIn('.form-control[aria-invalid="true"]', self.css)

    def test_filter_and_navigation_selection_have_programmatic_state(self):
        self.assertIn('setAttribute("aria-pressed"', self.js)
        self.assertIn('aria-live="polite"', self.html)
        self.assertIn('id="openSidebar"', self.html)
        self.assertIn('id="sidebarScrim"', self.html)

    def test_responsive_and_motion_contracts_are_present(self):
        self.assertIn('env(safe-area-inset-bottom)', self.css)
        self.assertIn('@media (prefers-reduced-motion: reduce)', self.css)
        self.assertIn('@media (max-width: 760px)', self.css)


if __name__ == "__main__":
    unittest.main()
