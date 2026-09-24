# Space sub-themes

Every future app belongs to one Space. Assign the Space by its owning function, not by a feature's color or its audience. A cross-functional app needs an agreed owner; do not infer ownership from its name. Existing apps remain unchanged until they opt in.

## Recommended combinations

All Spaces share White `#FFFFFF` cards, warm `#FFFAF4` page surfaces and Deep Charcoal `#241718` body text in light mode. Keep these neutral surfaces dominant. Typography, spacing, radii and component behavior remain shared.

| Space | Function | Identity color | Supporting accent | Reason |
| --- | --- | --- | --- | --- |
| Learnspace | Academic | MWS Burgundy `#7E1518` | Happiness Gold `#D6A13A` | Keeps academic products closest to the school identity; Gold marks learning milestones. |
| SHIELDSpace | Operations and facilities | Millennia Sky `#B8DDF8` | Truth Navy `#1F2A44` | Sky identifies operational tools; Navy gives structure and readable contrast on Sky. |
| SAFESpace | Finance | Goodness Sage `#6F8B6A` | Happiness Gold `#D6A13A` | Sage gives finance a distinct identity; restrained Gold highlights important financial summaries, not payment status. |
| CARESpace | HR | Truth Navy `#1F2A44` | Compassion Rose `#B94A4E` | Navy supports formal HR workflows; Rose provides a warmer accent for people-focused content. |

Use one supporting accent sparingly. Additional palette colors should carry an actual status or data meaning, not decoration. The MWS logo stays in its official Burgundy/White artwork in every Space; never recolor it to match the app.

## Identity versus interaction

Sky and Sage identity swatches do not support white normal-sized text at AA contrast. Keep the exact brand swatches for identification; use the existing deeper palette shades for actionable controls and links. Never use an identity swatch as a text color without checking its background.

| Space | Light primary action and link | Action hover | Selected/soft surface | Dark primary action and link | Dark soft surface |
| --- | --- | --- | --- | --- | --- |
| Learnspace | `#7E1518` | `#681114` | `#F5E7E8` | `#FFB2B6` | `#351719` |
| SHIELDSpace | `#25638E` | `#1E4F72` | `#EFF8FE` | `#9FD1F4` | `#142536` |
| SAFESpace | `#486142` | `#3A4E35` | `#EDF3EB` | `#A8C4A0` | `#1F2B20` |
| CARESpace | `#1F2A44` | `#192236` | `#E9EDF6` | `#B9C7EE` | `#182136` |

Light solid primary actions use White labels; dark solid primary actions use Charcoal labels. Dark mode keeps the kit's shared dark neutral surfaces and uses lighter interaction colors rather than dark Navy or Burgundy on dark backgrounds. New hover/selection shades are UI derivatives, not additions to the official identity palette.

## Translation into the UI kit

| UI element | Rule / token |
| --- | --- |
| App identity / Space label | Show the written Space name; use `--mws-color-space-identity` as a swatch, not the sole identifier. |
| Primary button | Existing `Button` primary variant uses `--mws-color-action-primary-*`. |
| Secondary, soft and ghost buttons | Existing variants inherit the Space's foreground, soft background and hover tokens. |
| Links and brand headings | `--mws-color-text-link`, `--mws-color-text-link-hover`, `--mws-color-text-brand`. Keep most body text neutral. |
| Active navigation and selected tabs | `--mws-color-brand-primary-soft` with `--mws-color-text-brand`; retain selected-state semantics and a non-color cue. |
| Focus indicator | `--mws-color-border-focus`, using the Space action color with the existing offset outline. |
| Forms | Neutral fields and labels; Space focus ring. Validation stays on status tokens. |
| Cards and tables | Shared neutral surfaces. Use Space soft surfaces only for meaningful selection or grouping. |
| Supporting accent | `--mws-color-space-accent` is a fixed palette swatch, not a general-purpose text token. Use the named brand's accessible text/soft tokens for labeled content. |
| Alerts, errors and payment/approval status | Existing `--mws-color-status-*` remain unchanged in every Space. Always include a status label. |
| Charts | Space color can identify one series; multiple series need labels and distinguishable marks. Do not recolor profit/loss or risk statuses based on Space. |

A Sage button in SAFESpace means an action, not success. A Sky selection in SHIELDSpace is not an informational alert. Identity and status remain separate even when their hues overlap.

Named palette utilities such as `bg-brand-navy`, `bg-brand-sage` and legacy `--mws-burgundy` remain fixed palette choices, not Space-aware aliases. The legacy `burgundy` Badge/Progress tone uses primary semantic tokens and therefore follows the Space; use a named fixed-palette token when literal Burgundy is required. Custom components with hardcoded colors must migrate to semantic tokens to follow the theme.

## Enable a Space

Load the packaged stylesheet once, then set both attributes on the same root `html` element, preferably in the initial HTML to avoid a color flash:

```html
<html data-space="shield" data-theme="light">
```

```tsx
import { Button, spaceThemes, type Space } from "mws-ui-kit";
import "mws-ui-kit/style.css";

const space: Space = "shield";
const spaceName = spaceThemes[space].name;

// In client-side app initialization, if the root HTML is not configured by the server:
document.documentElement.dataset.space = space;
document.documentElement.dataset.theme = "light";
```

Supported IDs: `learn`, `shield`, `safe`, `care`. Omit `data-theme` for light mode. Set it to `dark` for the dark palette. Removing `data-space` restores the original kit theme; unknown IDs do not apply a Space override.

`spaceThemes` is readonly metadata with `name`, `domain`, `identity`, `accent`, `light` and `dark`. Each mode provides `primary`, `hover`, `soft`, `softer` and `text` (the solid-action foreground). CSS is included by the existing package stylesheet; no provider or new dependency is needed.

### Scope and migration

- One Space per document. Nested Space wrappers and splitting `data-space` / `data-theme` across elements are unsupported.
- Root scope also reaches modal portals mounted under `document.body`.
- The application determines ownership. Do not add a user-facing Space switcher unless it actually switches application context.
- Existing product examples are legacy combinations, not ownership assignments. Classify each app before migrating it.
- Space guidance supersedes older instructions that require Burgundy primary actions in every product.
- Keep fixed status colors and official logo assets when migrating. Check hardcoded styles and named color utilities separately.

## Validation

`src/spaces.test.ts` checks all four light/dark palettes against their CSS declarations, primary and hover label contrast, link and soft-state contrast, focus contrast on tested surfaces, and unchanged status tokens. These are token-level tests, not a claim that every existing screen is accessibility-audited. Product teams must still test component states, keyboard navigation and responsive layouts in their consuming apps.

Design intent: ENERGY 2 / RHYTHM 1 / MOTION 1. Space colors supply identity; consistent layout and typography support moving between school apps. This feature adds no animation, asset, navigation or new component behavior.
