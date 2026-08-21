# Pressure scenario contract

These prompts are the roadmap's fast-path checks for whether the skill preserves
product-specific design decisions under time pressure. They are intentionally
different jobs, densities, and platform constraints.

## Community mobile

> Design a mobile community app for iOS and Android where people return to small
> interest circles. Show enough of the experience to judge whether it is ready to
> build.

Expected contract: declare the native or cross-platform target, choose a community
archetype, compare valid community shapes before selecting one, define a visual
direction and realistic content/assets, name phone target sizes, cover feed,
composer, empty/loading/error/success states, and avoid a generic five-tab shell
unless the primary job proves it.

## SaaS web dashboard

> Design a responsive SaaS dashboard for a team monitoring weekly operations,
> with filters, dense tables, exceptions, and an export action.

Expected contract: choose responsive Web and a dashboard/admin archetype, make
scope/filter/inspection the information priority, define desktop and narrow
breakpoints, use realistic table states and long labels, and score visual fidelity
with rendered evidence before any release-ready claim.

## Camera game

> Design an iPhone and Android camera game that recognizes a physical object and
> rewards the player for a successful result.

Expected contract: select the shared/native stack intentionally, combine camera and
game constraints, make preview/canvas and thumb-reachable controls primary, define
permission → ready → capture/play → review/result → retry/reward, and cover denied
camera, interruption, orientation, and recognition failure states.

## Shared release gate

Every scenario must expose platform/device, archetype/primary job, navigation,
visual direction, semantic tokens, representative states, realistic content/assets,
rendered target sizes, a `Visual fidelity` score, and open findings with evidence
and next actions. The skill must refuse `release-ready` without that evidence.
