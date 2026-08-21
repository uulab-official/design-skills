# Cross-platform production parity

Use this note when a board declares Web, iOS, and Android as target environments. Shared tokens and product intent are useful only when the interaction shell, system behavior, and input model are translated deliberately for each platform.

## Gather translation contract

| Concern | Responsive Web | iOS / SwiftUI | Android / Jetpack Compose |
| --- | --- | --- | --- |
| Primary shell | Persistent sidebar at wide widths; drawer and bottom navigation after content failure | Tab root for peer destinations; `NavigationStack` for circle and thread detail; sheet for composer | Navigation bar for frequent roots; app bar plus `NavHost` for detail; adaptive rail on larger widths |
| Safe areas / insets | Respect browser viewport, zoom, sticky headers, and mobile browser chrome; keep fixed actions above the bottom navigation | Apply `safeAreaPadding` to bottom navigation and composer actions; keep the floating create action above the home indicator | Handle edge-to-edge system bar insets and IME insets; keep FAB/snackbar clear of navigation and gesture areas |
| Back / dismissal | Browser back restores route and meaningful URL filters; Escape closes drawer, scrim, and modal in that order | Swipe-back and navigation back pop detail; sheet dismissal returns focus to the create trigger; unsaved composer changes require confirmation | System back pops detail, closes sheet/drawer before leaving the route, and confirms unsaved composer changes |
| Keyboard / focus | `Cmd/Ctrl + K` focuses search; visible focus rings; modal focus returns to trigger; filter state remains keyboard reachable | Focus title on sheet presentation; keyboard-safe scrolling; restore VoiceOver focus after publish or dismissal; support Dynamic Type growth | Use `imePadding`; keep title and publish action reachable while typing; expose TalkBack state descriptions and restore focus after snackbar/publish |
| Feedback | Toast/live region for publish, like, save, circle scope, and recovery; URL/filter changes remain addressable | Use confirmation in the sheet or a transient banner; use haptics only as enhancement; announce VoiceOver result | Use Snackbar with an action for retry/undo; use haptics only where Material guidance supports it; announce TalkBack result |
| Surface / elevation | Paper canvas, border-led cards, hover only as enhancement; no elevation-dependent meaning | Prefer grouped surfaces and system materials sparingly; preserve editorial hierarchy in light/dark appearance | Use Material surface roles and restrained elevation; preserve contrast and avoid turning every block into a card |
| Accessibility | Landmark order, labels, `aria-pressed`, `aria-invalid`, `aria-describedby`, reduced motion, 44 px touch targets | VoiceOver labels/order, Dynamic Type, Reduce Motion, contrast in both appearances, 44 pt targets | TalkBack traversal/state descriptions, font scaling, contrast, 48 dp targets, touch exploration |

## State translation matrix

| Product state | Shared intent | Web evidence | Native implementation note |
| --- | --- | --- | --- |
| Empty search | Explain why nothing matched and give a direct recovery action | Inline empty state with clear search recovery | Keep focus in search; expose an actionable clear button and announce the result |
| Composer validation | Prevent a low-context post and explain the correction | Required title error is visible, linked, and announced | Keep the sheet open, focus the invalid field, and announce the field error through platform semantics |
| Publish success | Confirm the post exists and make it findable | New post appears at the top, modal closes, live toast confirms | Dismiss sheet, restore focus to the create trigger or new post, and provide a native transient confirmation |
| Network recovery | Preserve authored intent and offer retry | Recovery panel includes retry and keeps the draft | Keep draft in view across interruption; retry is an explicit action and back does not silently discard it |
| Mobile navigation | Make secondary destinations reachable without stealing task focus | Drawer/scrim plus bottom navigation; Escape and scrim close them | iOS sheet/tab semantics; Android drawer/system-back semantics; both preserve current tab and focus |

## Handoff acceptance

Before declaring cross-platform work implementation-ready, record the following for each declared target:

1. Shell and route map, including back/dismissal behavior.
2. Safe-area and keyboard strategy for every fixed or modal action.
3. Focus/announcement behavior for validation, success, empty, recovery, and permission states.
4. Target-size renders or simulator evidence for the declared environment.
5. Any native-only state, such as permission denial, offline persistence, haptics, or system bar treatment.

The current Gather example has implemented web evidence and platform-aware native intent. It intentionally does not claim native runtime evidence; its readiness remains `review-ready` until iOS and Android are rendered or removed from the declared target set.
