# Gather — Community design review surface

Gather is a production-minded responsive web concept for reviewing how `design-skills` handles a community product across desktop and mobile. It is intentionally a complete surface rather than a single hero shot: navigation, feed, discovery cues, social actions, composer, empty state, notification feedback, and a mobile drawer are all represented. The companion `board.html` is the Figma-equivalent design board: it exposes three visual directions, the screen set, state library, foundations, component variants, and handoff metadata in one reviewable surface.

## Brief

- Platform: responsive web
- Archetype: community / discussion
- Primary job: help people find a small circle worth returning to
- Viewports: 1440 × 1000, 1280 × 900, 1024 × 900, 390 × 844
- Route concept: `/home`, with future `/discover`, `/circles/:slug`, `/post/:id`, and `/saved`

## Visual thesis

“A warm editorial town square.” The experience should feel human and collected, not optimized for endless scrolling. A paper-like background creates calm, forest ink gives the interface confidence, coral is reserved for invitation and action, and lilac/moss/blue identify different circles. Fraunces supplies a literary voice for moments of meaning; DM Sans keeps controls and metadata legible.

## Directions considered

| Direction | Structural difference | Best use | Decision |
| --- | --- | --- | --- |
| Quiet editorial | Paper canvas, serif-led hierarchy, generous whitespace, orbit motif | Rituals, reading, thoughtful prompts | Selected for the live prototype |
| Night studio | Dark command surface, sharper grid, denser live-room composition, mint/violet contrast | Events, makers, creator workflows | Preserved as an alternate |
| City bulletin | Modular publication blocks, graphic orange/blue contrast, public-square rhythm | Discovery, city guides, open networks | Preserved as an alternate |

The selected direction is the warm editorial one because Gather’s primary job is helping people return to a good conversation, not maximizing live activity. The other two remain visible in the board so future screens do not collapse into a single generic aesthetic.

| Layer | Decision |
| --- | --- |
| Color | `#F6F2EC` paper, `#1D2C27` forest, `#EF765E` coral, `#D8D2F2` lilac, `#CAD7B1` moss, `#CBDDE3` blue |
| Type | Fraunces for editorial headlines; DM Sans for UI, labels, and body copy |
| Shape | 10 px controls, 16 px cards, 24 px feature surfaces, pill filters |
| Rhythm | 4/8 px base rhythm, 20–32 px component padding, generous section breathing room |
| Motion | Small lift on cards, quick toast feedback, smooth mobile drawer; reduced-motion fallback included |

## Screen set

1. **Home / For you** — desktop dashboard with shell navigation, welcome moment, featured story, feed, circles rail, prompt, and activity.
2. **Discover / Circles** — an editorial directory for finding a new orbit by theme and intent.
3. **Circle / City Makers** — circle identity, membership, tabs, and conversation list.
4. **Thread / Conversation** — reading hierarchy, replies, author context, and inline response composer.
5. **Profile / Mina Park** — identity, contribution history, trust signals, and saved context.
6. **Mobile home** — stacked content with fixed bottom navigation, floating create action, and responsive recomposition.
7. **Home / Following + circle scoped** — the production surface adds filter and circle-selection states without changing the shell.
8. **Composer / modal** — the production surface adds circle selection, required title, optional context, validation, and success feedback.

The design board also shows the empty, loading, recovery, and success states that are easy to omit from a visual-only case study.

## Interaction contract

| Interaction | Expected result |
| --- | --- |
| For you / Following / Latest | Active chip changes and feed rerenders |
| Circle row | Circle scope applies, feed scrolls into view, toast confirms context |
| Search | Feed filters as the user types; clear recovery appears when empty |
| Like / Save | Pressed state and count update immediately with feedback |
| Comment / post card | Feedback communicates the next route boundary |
| Start a conversation | Composer opens with focus placed in the title field |
| Publish | New post appears at top of feed and toast confirms success |
| Mobile menu | Drawer and scrim open; Escape and scrim close them |
| Cmd/Ctrl + K | Search receives focus |

## Prototype map

```text
board.html
  ├─ Home / For you ───────┐
  ├─ Discover / Circles     ├─ open live prototype → index.html
  ├─ Circle / City Makers  │
  ├─ Thread / Conversation  │
  ├─ Profile / Mina Park    │
  └─ Mobile / Home ─────────┘
       ├─ Empty
       ├─ Loading
       ├─ Recovery
       └─ Success
```

## Quality review checklist

- [x] Responsive shell changes from sidebar to drawer and bottom navigation.
- [x] Core states are visible without relying on hover: default, filtered, empty, composer, validation, success, and saved/liked.
- [x] Content hierarchy is readable at a glance: welcome → featured story → feed → community context.
- [x] Focus rings, labels, live regions, button names, and reduced-motion behavior are included.
- [x] External imagery is treated as replaceable demo content; the layout does not depend on it for meaning.
- [x] A design-board surface exposes multiple compositions, reusable foundations, and screen handoff metadata.
- [ ] Visual review at the target viewport set (run the included screenshot check before calling this release-ready).

## Run locally

From the repository root:

```bash
python3 -m http.server 4173 --directory examples/community
```

Open `http://127.0.0.1:4173`. The demo is static HTML/CSS/JS and has no build step.
