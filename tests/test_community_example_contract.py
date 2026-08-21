import unittest
import re
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
        self.assertIn("readUrlState", self.js)
        self.assertIn("syncUrlState", self.js)
        self.assertIn("history.replaceState", self.js)

    def test_responsive_and_motion_contracts_are_present(self):
        self.assertIn('env(safe-area-inset-bottom)', self.css)
        self.assertIn('padding-bottom: calc(74px + env(safe-area-inset-bottom))', self.css)
        self.assertIn('height: calc(72px + env(safe-area-inset-bottom))', self.css)
        self.assertIn('@media (prefers-reduced-motion: reduce)', self.css)
        self.assertIn('@media (max-width: 760px)', self.css)
        self.assertIn('.filter-chip { min-height: 44px;', self.css)
        self.assertIn('.post-action { min-width: 44px; min-height: 44px;', self.css)
        self.assertIn('.round-arrow { width: 44px; height: 44px;', self.css)

    def test_keyboard_and_focus_handoff_contracts_are_present(self):
        self.assertIn('href="#mainContent"', self.html)
        self.assertIn('class="skip-link"', self.html)
        self.assertIn('id="composerDescription"', self.html)
        self.assertIn('composerDialog.addEventListener("close"', self.js)
        self.assertIn("state.composerTrigger", self.js)
        self.assertIn("state.sidebarTrigger", self.js)
        self.assertIn("restoreFocus", self.js)
        self.assertIn(".skip-link:focus", self.css)

    def test_workspace_switcher_exposes_an_accessible_picker(self):
        self.assertIn('id="workspaceSwitcher"', self.html)
        self.assertIn('aria-haspopup="dialog"', self.html)
        self.assertIn('id="workspaceDialog"', self.html)
        self.assertIn('data-workspace-id="quiet"', self.html)
        self.assertIn('workspaceDialog.addEventListener("close"', self.js)
        self.assertIn("state.workspaceTrigger", self.js)
        self.assertIn("renderWorkspacePicker", self.js)
        self.assertIn(".workspace-dialog", self.css)

    def test_feed_recovery_exposes_offline_and_retry_states(self):
        self.assertIn('id="feedRecoveryBanner"', self.html)
        self.assertIn('id="retryFeed"', self.html)
        self.assertIn('data-feed-state="error"', self.js)
        self.assertIn('feedState', self.js)
        self.assertIn('data-retry-feed', self.js)
        self.assertIn('.feed-recovery-banner', self.css)
        self.assertIn('.feed-recovery-banner[hidden]', self.css)
        self.assertIn('.feed-error-state', self.css)

    def test_your_circles_route_exposes_a_collection_handoff(self):
        self.assertIn('id="circlesView"', self.html)
        self.assertIn('id="circlesTitle"', self.html)
        self.assertIn('data-your-circle-route', self.html)
        self.assertIn('circles', self.js)
        self.assertIn('renderCircles', self.js)
        self.assertIn('navigateToCircles', self.js)
        self.assertIn('.circles-view', self.css)

    def test_design_board_exposes_shareable_state_and_dialog_focus(self):
        board_html = (EXAMPLE / "board.html").read_text(encoding="utf-8")
        board_js = (EXAMPLE / "board.js").read_text(encoding="utf-8")
        self.assertIn('class="version-chip">v0.28 · review</span>', board_html)
        self.assertIn('aria-label="Preview size"', board_html)
        self.assertIn('data-view-toggle="desktop" aria-pressed="true"', board_html)
        self.assertIn('data-board-filter="all" aria-pressed="true"', board_html)
        self.assertIn("readUrlState", board_js)
        self.assertIn("syncUrlState", board_js)
        self.assertIn("history.replaceState", board_js)
        self.assertIn("state.dialogTrigger", board_js)
        self.assertIn('boardDialog.addEventListener("cancel"', board_js)
        self.assertIn('aria-describedby="dialogDescription"', board_html)
        self.assertIn('window.addEventListener("popstate", readUrlState)', board_js)
        self.assertEqual(len(re.findall(r'data-artboard-title="[^"]+"', board_html)), 13)
        self.assertIn('data-artboard-title="Home / Following"', board_html)
        self.assertIn('data-artboard-title="Composer / Modal"', board_html)
        self.assertIn('data-artboard-title="Settings / Preferences"', board_html)
        self.assertIn('data-artboard-title="Notifications / Stay close"', board_html)
        self.assertIn('data-artboard-title="Workspace / Picker"', board_html)
        self.assertIn('data-artboard-title="Feed / Recovery"', board_html)
        self.assertIn('data-artboard-title="Your circles / Collection"', board_html)

    def test_prototype_rehydrates_url_state_after_history_changes(self):
        self.assertIn('window.addEventListener("popstate"', self.js)
        self.assertIn('readUrlState();', self.js)
        self.assertIn('renderFeed();', self.js)


if __name__ == "__main__":
    unittest.main()
