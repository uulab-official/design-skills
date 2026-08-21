# Gather — Community design review surface

Gather is a production-minded responsive web concept for reviewing how `design-skills` handles a community product across desktop and mobile. It is intentionally a complete surface rather than a single hero shot: navigation, feed, discovery cues, social actions, composer, empty state, notification feedback, and a mobile drawer are all represented.

## Brief

- Platform: responsive web
- Archetype: community / discussion
- Primary job: help people find a small circle worth returning to
- Viewports: 1440 × 1000, 1280 × 900, 1024 × 900, 390 × 844
- Route concept: `/home`, with future `/discover`, `/circles/:slug`, `/post/:id`, and `/saved`

## Visual thesis

“A warm editorial town square.” The experience should feel human and collected, not optimized for endless scrolling. A paper-like background creates calm, forest ink gives the interface confidence, coral is reserved for invitation and action, and lilac/moss/blue identify different circles. Fraunces supplies a literary voice for moments of meaning; DM Sans keeps controls and metadata legible.

| Layer | Decision |
| --- | --- |
| Color | `#F6F2EC` paper, `#1D2C27` forest, `#EF765E` coral, `#D8D2F2` lilac, `#CAD7B1` moss, `#CBDDE3` blue |
| Type | Fraunces for editorial headlines; DM Sans for UI, labels, and body copy |
| Shape | 10 px controls, 16 px cards, 24 px feature surfaces, pill filters |
| Rhythm | 4/8 px base rhythm, 20–32 px component padding, generous section breathing room |
| Motion | Small lift on cards, quick toast feedback, smooth mobile drawer; reduced-motion fallback included |

## Screen set

1. **Home / For you** — desktop dashboard with shell navigation, welcome moment, featured story, feed, circles rail, prompt, and activity.
2. **Home / Following** — same information architecture with a feed filter state.
3. **Home / Circle scoped** — selecting a circle makes the rail choice shape the feed and confirms the state with a toast.
4. **Search results** — live query filters feed content; no-result state gives a recovery action.
5. **Start a conversation** — modal composer with circle selection, required title, optional context, validation, and success feedback.
6. **Mobile home** — stacked content with fixed bottom navigation, floating create action, hidden desktop search, and slide-in navigation drawer.

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

## Quality review checklist

- [x] Responsive shell changes from sidebar to drawer and bottom navigation.
- [x] Core states are visible without relying on hover: default, filtered, empty, composer, validation, success, and saved/liked.
- [x] Content hierarchy is readable at a glance: welcome → featured story → feed → community context.
- [x] Focus rings, labels, live regions, button names, and reduced-motion behavior are included.
- [x] External imagery is treated as replaceable demo content; the layout does not depend on it for meaning.
- [ ] Visual review at the target viewport set (run the included screenshot check before calling this release-ready).

## Run locally

From the repository root:

```bash
python3 -m http.server 4173 --directory examples/community
```

Open `http://127.0.0.1:4173`. The demo is static HTML/CSS/JS and has no build step.
