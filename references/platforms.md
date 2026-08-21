# Platform Profiles

Use the user's declared platform first. If it is missing, infer a candidate from the repository inspector and state the assumption before making platform-specific decisions. Keep shared product intent consistent, but express navigation, input, system behavior, and accessibility in the target platform's language.

## Selection table

| Target | Choose when | Default implementation lens | Verify |
|---|---|---|---|
| iOS / SwiftUI | The user names iPhone, iPad, or native Apple UI | SwiftUI, safe areas, navigation stack, sheets, Dynamic Type | Back behavior, VoiceOver, Dynamic Type, permission prompts, light/dark appearance |
| Android / Jetpack Compose | The user names Android or native Material UI | Compose, Material 3, system back, adaptive layouts | TalkBack, font scaling, back stack, edge-to-edge, touch targets |
| React Native / Expo | The user wants one iOS + Android app or the repo is Expo/React Native | Shared tokens and navigation with platform-specific branches where behavior differs | Safe areas, keyboard, gestures, permission states, both platform conventions |
| Responsive Web | The user names a website, SaaS, dashboard, landing page, or browser experience | Content-driven breakpoints, URL state, keyboard-first interaction | Keyboard/focus, resize, zoom, reduced motion, contrast, narrow viewport |
| Tablet / large screen | The target includes iPad, Android tablet, foldable, or large responsive widths | Multi-column and split-view composition, pointer and touch parity | Orientation, pane collapse, hover/pointer affordances, reachable actions |
| Cross-platform | The user wants shared product behavior across web and native | Shared domain model and tokens, platform-native interaction shells | No lowest-common-denominator navigation; validate each target separately |

## iOS / SwiftUI

- Prefer a clear tab root for genuinely peer destinations; use a navigation stack for drill-in tasks and sheets for focused, reversible creation or selection.
- Respect safe areas and the keyboard. Do not hide critical controls behind the home indicator or software keyboard.
- Use Dynamic Type-compatible roles and allow content to grow rather than truncating primary meaning.
- Use system back gestures and predictable navigation titles. Do not imitate Android back affordances in a native iOS flow.
- Ask for camera, location, notifications, or photo permissions at the moment of intent. Explain the value before the system prompt and provide a useful denied state.
- Check VoiceOver labels, rotor order, focus after sheet dismissal, reduced motion, and both appearances.

## Android / Jetpack Compose

- Treat system back as a first-class transition. Define what happens from nested screens, dialogs, bottom sheets, and unsaved forms.
- Use Material 3 semantics where they help users, not as a reason to cover every surface with elevated cards.
- Design for font scaling and variable device sizes. A layout that works only at the reference phone width is incomplete.
- Use navigation rails or adaptive navigation for larger screens when peer destinations remain useful; use a bottom bar for a small set of high-frequency top-level destinations.
- Keep TalkBack traversal and state descriptions meaningful. Validate edge-to-edge insets, IME/keyboard movement, and contrast.

## React Native / Expo

- Start with shared information architecture and tokens, then branch where iOS and Android interaction conventions materially differ.
- Include safe-area, keyboard, loading, offline, permission, deep-link, and interrupted-request behavior in the component contract.
- Prefer Expo Router or the repository's established router; do not introduce a second navigation model for visual reasons.
- Use platform APIs intentionally: camera, image picker, notifications, location, secure storage, and haptics each need denied, unavailable, and degraded states.
- Test both platforms. A shared component is not validated by rendering once in one simulator.

## Responsive Web

- Derive breakpoints from content failure, not device-name folklore. Identify the width where navigation, tables, forms, and primary actions stop being usable.
- Preserve URL addressability for meaningful states: route, filters, pagination, search, tabs, and shareable detail views when the product needs them.
- Make keyboard focus, visible focus, skip links, semantics, and logical reading order part of the layout rather than a final patch.
- Use hover as enhancement only. Every important action must work with keyboard and touch.
- Recompose dense desktop layouts on narrow screens. Do not merely shrink a 12-column dashboard until labels and controls become unreadable.

## Tablet and large screens

- Use extra space to show relationships or reduce navigation depth, not to enlarge every card.
- Define pane collapse rules, minimum readable widths, orientation behavior, and what remains sticky.
- Support both touch and pointer input where the device can provide both; do not make hover the only way to discover an action.

## Cross-platform checks

Before implementation, record:

1. Which behavior is shared across targets.
2. Which navigation shell changes by platform.
3. Which components have platform-specific interaction or semantics.
4. Which states require native permissions, network, offline, or URL handling.
5. Which device sizes and assistive settings are in the acceptance check.
