# My-Gudauri — Design-System Consistency Fix Spec

**Repo:** `mixa-lll/My-Gudauri@main` (audited at commit `47082ff`)
**Audience:** an engineer/AI agent implementing the fixes.
**Goal:** make the whole site render as ONE design system — one catalog page pattern, one heading component, one content width, no legacy CSS fighting the React layer.

This spec is ordered by priority (P0 → P3). Each item lists: what's wrong, exact files/lines, and the concrete fix. Do the P0 items first — they cause the most visible inconsistency.

---

## Context: what is already fixed (do NOT re-do)

These were problems in a previous audit and are now resolved. Leave them alone:

- Token duplication — `styles/tokens.css` is now generated from `src/styles/tokens/index.scss` and values match. Do not hand-edit `styles/tokens.css`.
- `--lh-md-inline` is now `1.25` (was `10px`).
- Category taxonomy is canonical in `src/data/siteCategories.js` with `CATEGORY_ALIASES`.
- `scripts/` and `public/scripts/` are in sync (generated copies).
- Footer is unified in `src/components/SiteFooter/`; legacy copy isolated in `styles/legacy-footer.css`.
- Six sections now have a real page (`DestinationCatalogPage`) instead of `/summary` stubs.

---

## P0-1 — Unify the two catalog page systems (highest impact)

**Problem.** There are two completely different implementations of the same "category catalog" page type, so the same kind of page looks and behaves like two different sites:

- **Legacy "Instructors" catalog** — `src/pages/InstructorsPage/InstructorsPage.jsx` + `styles/design-2-instructors.css`.
  - Title: `font-family: var(--font-decor)` (Paytone One), `120px`, no uppercase, letter-spacing `0`. See `.catalog-title` in `styles/design-2-instructors.css`.
  - Category filter: a segmented pill group `.catalog-filters` / `.catalog-filter-btn`.
  - Item card: `.instructor-card` (radius `--radius-lg` = 28px, `padding: 6px`).
- **New "Destination" catalog** — `src/pages/DestinationCatalogPage/DestinationCatalogPage.jsx` + `.scss`, used for `activities / services / rental / transfers / stays / places`.
  - Title: `.destination-hero h1` → `font-family: var(--font-heading)` (Geist), `clamp(72px,7vw,104px)`, `text-transform: uppercase`, `font-weight: var(--fw-semibold)`, letter-spacing `-0.055em`.
  - Category filter: `CatalogCategoryTabs` component + `.destination-filters` pill toggles (radius `999px`, active state = solid dark fill).
  - Item card: `DestinationCard` (radius 20px, 3-column grid).

**Fix (pick ONE canonical system — recommended: the Destination system, because it is data-driven and already serves 6 of 7 sections):**

1. Make Instructors just another section of the Destination system:
   - Add an `instructors` entry to the `CATALOG_FILTERS` map in `DestinationCatalogPage.jsx` (categories = Ski / Snowboard / Freeride / Kids, refinements as needed).
   - Provide instructor data through the same `getDestination(section)` shape in `src/data/destinations.js` (or branch to `INSTRUCTORS` data), so `DestinationCard` can render instructor cards — OR extend `DestinationCard` to accept a `variant="instructor"`.
   - Route `/instructors` to `DestinationCatalogPage` (keep `/instructors/:slug` → `ProfilePage`).
2. Delete `src/pages/InstructorsPage/InstructorsPage.jsx` + `InstructorsPage.scss` and the `styles/design-2-instructors.css` catalog styles once nothing imports them. Keep only the calculator/booking bits that ProfilePage/BookingFlow still need (move them to their own component if shared).
3. Result: one catalog title style, one filter UI, one card. Verify `/instructors` and `/rental` now share identical chrome.

**Acceptance:** navigating Instructors → Rental → Transfers shows the same header typography, same filter control, same card grid. No Paytone One 120px title anywhere in a catalog.

---

## P0-2 — Adopt the single `SectionHeading` everywhere (enforces STYLING.md rule #6)

**Problem.** `docs/STYLING.md` rule #6 says: use `SectionHeading` for section headers and never duplicate `.section-heading__kicker` / `.section-heading__title`. `DestinationCatalogPage` ignores this and hand-rolls its own eyebrow/title. There are now **three** different "eyebrow/kicker" definitions:

| Where | Selector | Style |
|---|---|---|
| Canonical (unused in destination) | `.section-heading__kicker` (`SectionHeading.scss`) | `13px / 600 / uppercase / ls .08em` |
| Destination page | `.destination-eyebrow` (`DestinationCatalogPage.scss`) | `12px / 600 / uppercase` |
| Home service grid | `.service-grid-intro > p` (`page-polish.scss`) | `13px / 600 / uppercase` |

**Fix.**
1. In `DestinationCatalogPage.jsx`, replace the hand-rolled `<p className="destination-eyebrow">…</p>` + `<h1>`/`<h2>` blocks (hero, benefits, list) with the `SectionHeading` component:
   ```jsx
   import { SectionHeading } from '../../components/UI/SectionHeading/SectionHeading';
   // hero:
   <SectionHeading as="h1" size="lg" align="center" kicker={config.eyebrow} title={config.title} description={config.description} />
   // benefits:
   <SectionHeading as="h2" size="md" kicker="Trust us" title={config.benefitsTitle} />
   ```
2. Remove the now-unused `.destination-eyebrow`, `.destination-section-heading h2`, and the bespoke `.destination-hero h1` type rules from `DestinationCatalogPage.scss`. Keep only layout (grid, spacing) there.
3. In `page-polish.scss`, the `.service-grid-intro > p` eyebrow should either use the `SectionHeading` kicker markup in `HomePage.jsx`, or at minimum match the canonical `13px/600/uppercase/ls .08em` exactly. Prefer converting the intro block to `SectionHeading`.

**Acceptance:** grep the repo for `eyebrow` and for `font-weight: 600` next to `text-transform: uppercase` — the only kicker definition left should be `SectionHeading.scss` (+ its generated `styles/section-heading.css`).

---

## P1-3 — Stop importing legacy CSS into React; remove the override war

**Problem.** `src/pages/HomePage/HomePage.jsx` imports the legacy stylesheet:
```js
import '../../../styles/design-1-home.css';
```
`docs/PROJECT-STRUCTURE.md` says `styles/` is "legacy static (kept for reference)", but HomePage actually depends on it. Worse, `src/styles/page-polish.scss` then re-declares the entire service grid on top of it, so two full layouts fight and the winner is decided by import order. The legacy file still ships Figma pixel coordinates (violates STYLING.md rule #2 — "use tokens, not hardcoded values"):
```css
/* styles/design-1-home.css */
.service-card.instructors h2 { left: 24.43px; top: 24.78px; }
.service-art.instructors-art { left: 126.43px; top: 57.78px; width: 225.727px; height: 401.292px; }
```
overridden by:
```scss
/* src/styles/page-polish.scss */
.service-card h2 { left: 24px; top: 22px; }
```

**Fix.**
1. Create `src/pages/HomePage/HomePage.scss` (it exists but is nearly empty) and move the home hero + service-grid + instructors-block layout there, expressed with tokens and grid `fr` units — NOT Figma px coordinates. Use `page-polish.scss` as the source of truth for the intended values (it already uses `clamp()` and `repeat(3, minmax(0,1fr))`), then delete those blocks from `page-polish.scss` so each rule lives once.
2. Remove `import '../../../styles/design-1-home.css';` from `HomePage.jsx`.
3. Leave `styles/design-1-home.css` only if `pages/design-1-home.html` (the static prototype) still needs it. It must not be imported by any `src/**` file.

**Acceptance:** no file under `src/` imports anything from the root `styles/` directory except the generated `styles/section-heading.css` (if still referenced). The service-grid card positions are defined exactly once.

---

## P1-4 — One content width for the whole site

**Problem.** The token `--content-width: 1468px` exists, but pages each use a different actual width:

| Value | Where |
|---|---|
| `1468px` | `.home-page` (`design-1-home.css`) — the token |
| `1600px` | `.destination-page` (`DestinationCatalogPage.scss`) |
| `1388px` | `.site-nav-host`, `.catalog-nav-host`, `.destination-shell` |
| `1386px` | `.service-grid` (`design-1-home.css`) |

So section edges and the navbar don't line up across pages.

**Fix.**
1. Decide the real canonical outer width. The navbar and shells already agree on `1388px`, so either set `--content-width: 1388px` or introduce two explicit tokens: `--content-width` (outer page) and `--content-inner` (nav + shells). Add them in `src/styles/tokens/_layout.scss` only.
2. Replace every literal `1468px` / `1600px` / `1388px` / `1386px` width with the token:
   - `.destination-page { width: min(100%, var(--content-width)); }` (drop the 1600).
   - `.service-grid { width: min(100%, var(--content-inner)); }`.
   - nav hosts + shells → `var(--content-inner)`.
3. Run `npm run design:sync` if it regenerates `styles/tokens.css`.

**Acceptance:** grep for `1468`, `1600`, `1388`, `1386` — no hardcoded width literals remain; all reference a token.

---

## P2-5 — Font-weight and value hygiene

**Problem.** Weights are tokenized (`--fw-regular/medium/semibold/bold` = 400/500/600/700), but off-scale and raw values leak in:
```scss
.destination-promise strong { font-weight: 460; }   /* off-scale */
.destination-eyebrow        { font-weight: 600; }    /* raw, should be var(--fw-semibold) */
```
```css
/* styles/system.css — dead code, but still ships the old broken value */
.nav-links { line-height: 10px; }
```

**Fix.**
1. Replace `font-weight: 460` with `var(--fw-medium)` (500) or `var(--fw-regular)` (400) — pick the closest intended weight.
2. Replace raw `font-weight: 600` with `var(--fw-semibold)` wherever it appears in component/page SCSS.
3. Fix or delete `.nav-links { line-height: 10px }` in `system.css` (see P2-6 — it's dead code and should be removed entirely).

**Acceptance:** grep for `font-weight:` in `src/**/*.scss` — every value is a `var(--fw-*)`. No `line-height: 10px` anywhere.

---

## P2-6 — Remove the dead second vocabulary from `system.css`

**Problem.** `styles/system.css` still defines a whole set of classes the React app never uses (a leftover prototype vocabulary), alongside the live `.site-nav*` / `.ui-*` classes:
```
.navbar  .brand  .nav-links  .hero-title  .hero-sub
.card  .card-media  .footer  .footer-grid  .step  .shell  .grid-4  .grid-3
```

**Fix.**
1. Confirm none of these are referenced from `src/**` (grep each class name). `.container`, `.grid-12`, `.site-nav*`, `.ui-*` ARE used — keep those.
2. Delete the unused blocks. If `system.css` is generated, remove them from the source instead and regenerate.
3. If `system.css` is only needed by the static `pages/*.html` prototypes, make sure nothing in `src/**` imports it.

**Acceptance:** `system.css` contains only classes that are actually referenced by `src/**` or by the `pages/*.html` prototypes.

---

## P3-7 — Funnel parity + finish the SummaryPage stub

**Problem.** Instructors have a full funnel with a backend (catalog → profile → booking → summary, D1 migrations + Pages Functions). The other six sections only have catalog → detail (no booking). `SummaryPage` is an 822-byte stub with hardcoded data and is the only route wrapped in `MainLayout`:
```jsx
<p>Instructor: Mikhail Andreev</p>
<p>Total: 1380 GEL</p>
```

**Fix (product decision required — confirm with the owner first).**
1. Decide whether destination sections need a booking/inquiry funnel or stay browse-only. If browse-only, that's a deliberate product choice — document it in `docs/ARCHITECTURE.md` so it doesn't read as an inconsistency.
2. Either finish `SummaryPage` (read real booking state from route/store instead of hardcoded strings) or remove it and the `/summary` route if it's dead.
3. Align the `MainLayout` usage — either all pages use it or the layout responsibility is consistent (right now only `/summary` sits inside it while every other page renders its own `SiteNavbar` + `SiteFooter`).

**Acceptance:** no hardcoded booking values in shipped pages; `docs/ARCHITECTURE.md` states which sections are transactional vs browse-only.

---

## P3-8 — Consistent kicker copy/tone

**Problem.** Section kickers mix marketing and utility voice with no rule:
`"Explore Gudauri"`, `"Verified professionals"` (home) vs `"Refine selection"`, `"Trust us"` (destination).

**Fix.** Define one convention (e.g. all kickers are short, sentence-case, descriptive of the section — not imperative). Apply it through the `kicker` prop of `SectionHeading` once P0-2 is done. This is copy polish, do it last.

---

## Suggested execution order (single PR per group)

1. **PR 1 (P0):** unify catalog system + adopt `SectionHeading` in destination pages.
2. **PR 2 (P1):** move home layout into `HomePage.scss`, drop legacy CSS import, unify content width tokens.
3. **PR 3 (P2):** weight/value hygiene + delete dead `system.css` vocabulary.
4. **PR 4 (P3):** funnel parity decision + SummaryPage + kicker copy.

After each PR: run the app, click Home → Instructors → Rental → Transfers → Stays → Places, and confirm the header, filter control, card grid, section edges, and navbar width are visually identical across all of them.

---

## Quick verification grep checklist

```bash
# no hardcoded widths
grep -rn "1468\|1600\|1388\|1386" src styles

# no raw uppercase eyebrow outside SectionHeading
grep -rn "eyebrow" src

# no legacy CSS imported into React
grep -rn "styles/design-" src

# weights are tokens only
grep -rn "font-weight:" src | grep -v "var(--fw"

# the old broken line-height is gone
grep -rn "line-height: 10px" .
```
