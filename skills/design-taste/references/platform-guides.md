# Platform review guides

Pick by product task, not by file extension. Every design must respect its actual deployment, input method, content and existing architecture.

## Web — marketing, storefront, portal, editorial

- Inspect first viewport as a stranger: unique product concept, truthful proof, one clear primary action.
- Check 390×844 phone, 768×1024 tablet and 1440×900 desktop as baseline examples, then actual supported breakpoints.
- Recompose major sections for narrow viewports. Recheck real image crop, text wrapping, content order, sticky elements, keyboard navigation, form errors and reduced-motion treatment.
- Test meaningful page content and conversion end to end; no fake testimonials, product screenshots, placeholder claims or hidden shipping/cost details.
- Marketing-page style rules are **not** automatically valid for working dashboards.

## App — Expo/native, mobile utilities, SaaS, admin, dashboards

- Keep primary user job, data and input visible; choose native navigation behavior and density before color.
- Inspect device safe area, software keyboard, system back, notifications, stale/offline, errors, permissions, accessibility focus and text scaling.
- For dashboards verify dataset source, labels/units, filters, table alignment, drill-down and loading/empty; colored cards must communicate actual meaning.
- For native Expo/SwiftUI/Android/Flutter: real simulator or device screenshots plus interaction and accessibility evidence are required. Browser screenshots prove only their browser surface.
- For responsive web app: run capture script at 390×844, 834×1112 and 1280×800 plus actual breakpoints.

## Game — Unity, Godot, Unreal or browser game

- Review gameplay footage at **speed**, not only paused screenshots: input → visual/audio feedback → HUD readability → result/retry.
- HUD priority: play canvas, player/enemy state, critical warning, action mapping, currency/score, optional secondary information.
- Cover boot/loading, tutorial, combat/play, pause, settings, rewards, game over and retry. Validate menu controller focus, keyboard, mouse, touch and localization where applicable.
- Test phone portrait (390×844), phone landscape (844×390) and desktop (1280×720) only if the game actually targets those orientations; use actual resolution/device for release evidence.
- Capture damage, multiple enemies/projectiles, rare drops, inventory full, low health, ad/IAP entry and interruption where relevant. Check color plus shape cues and effects obscuring threats.
- Real engine/gameplay/device evidence and a human craft review remain mandatory. A DOM auditor for WebGL cannot inspect pixel-level combat clarity or prove frame rate.

## Proof levels

- **concept**: justified design contract, no actual runtime claimed.
- **implementation-ready**: code and state contracts exist, visual runtime still incomplete.
- **review-ready**: real rendered target-size captures plus review findings, some broader validation remains.
- **release-ready**: target runtime/device validation, state coverage, accessible primary interaction, recorded tests, no open critical/high issue. Release readiness always belongs to the host product's gates.
