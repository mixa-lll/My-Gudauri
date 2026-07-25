# My Gudauri — Design System

A design system for **My Gudauri**, an independent local booking platform for the
**Gudauri ski resort in Georgia** (~2,196 m, Greater Caucasus). The product is a
marketplace that connects visitors with everything around a mountain trip:
ski & snowboard **instructors**, **activities** (freeride, ski-touring, heli-ski,
paragliding, excursions to Kazbegi/Kazbek), equipment **rental**, **transfers**,
**tours**, **stays** and local **services**.

This system keeps the production site's proven foundations (the token set, Geist +
Paytone One type, the coral accent, the pill/card UI kit) and pushes the visual
language toward a more **editorial, photography-first** direction drawn from the
attached references — big display type over full-bleed cool mountain imagery,
generous rounded cards floating on white, frosted-glass overlays.

## Sources

- **Codebase:** GitHub — `mixa-lll/My-Gudauri` (`main`), a React + SCSS refactor
  of the platform. Tokens live in `src/styles/tokens/*`, primitives in
  `src/components/UI/*`, feature components in `src/components/*`, static
  prototypes in `pages/`. Explore it to build more faithfully:
  https://github.com/mixa-lll/My-Gudauri
- **Reference imagery** (`uploads/`): a set of adventure / mountain-travel web
  designs (editorial serif and bold-sans heroes over snow photography, frosted
  cards, HUD coordinate labels) that steer the elevated visual direction, plus a
  real Gudauri resort photo (`assets/hero-gudauri.png`) and a piste map.
- **Wireframes:** `uploads/My Gudauri Wireframes.dc.html` — the product sitemap
  (Instructors, Activities, Rental, Services, Real estate, Transfer, Tours, Places),
  confirming the catalog → object → booking flow.

> Note: the reference webps are third-party design inspiration, not My Gudauri
> assets. Only `hero-gudauri.png` and `map-gudauri.jpg` depict the real resort.

## Components

Grouped under `components/`. Public API name = the export. Mount from the bundle:
`const { Button } = window.MyGudauriDesignSystem_9a73c7`.

**core/** — `Button`, `Pill`, `SectionHeading`, `Container`
**controls/** — `Stepper`, `IconButton`
**cards/** — `ListingCard` (+ `ListingCardPill`, `ListingCardRating`, `ListingCardPrice`), `InstructorCard`, `DestinationCard`
**forms/** — `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio` (+ `RadioGroup`)
**feedback/** — `FaqAccordion`, `Badge`

These mirror the real inventory (`docs/COMPONENTS.md`): `Button`, `Pill`,
`Container`, `SectionHeading`, `FaqAccordion`, `InstructorCard`,
`ListingCard`/`DestinationCard`.

### Intentional additions
- **`Stepper`** and **`IconButton`** — the production `system.css` ships `.ui-stepper`
  and `.ui-icon-btn` (used in the booking calculator and close/next affordances) but
  no React wrapper; promoted here to first-class components.
- **`Badge`** — a status label formalizing the "Available this week / Limited
  availability / Verified instructor" strings already used in the instructor data.
- **`Field`**, **`Input`**, **`Textarea`**, **`Select`**, **`Checkbox`**, **`Radio`**/**`RadioGroup`** —
  form controls promoted from the production booking-flow and admin (CMS) markup
  (`.admin-field`, `.participant-card label`, contact fields): same 1px `grey-200`
  border, `--radius-xsm`, white fill and neutral focus ring, with coral checked states.

Not ported (composite page-machinery, out of scope for a component kit):
`SiteNavbar`, `SiteFooter`, `CalculatorBanner`, `HomeHeroSearch`,
`CatalogCategoryTabs`, `ProfileGallery`, `MediaPlaceholder` — the website UI kit
recreates the navbar/footer/hero at the page level instead.

## UI kits

- **`ui_kits/website/`** — the marketing **Homepage** recreation (hero, category
  strip, instructor catalog, featured + grid activities, FAQ, footer). Also a
  registered starting point.

---

## Content fundamentals

**Language:** English UI copy (the codebase and product are bilingual EN/RU; the
public site is written in plain, fluent English). Georgian currency is the lari, `₾`.

**Voice:** plain, trustworthy, second-person ("**you** choose by teaching style").
It informs rather than sells. No hype, no exclamation storms, no emoji.

- **Casing:** sentence case for headings and buttons ("Book a lesson", "All
  instructors"). Small uppercase only for kickers/eyebrows and HUD/coordinate labels.
- **Tone examples (real copy):**
  - "One trusted local guide for instructors, mountain experiences, stays and everything around Gudauri."
  - "All instructors follow the same official rate. You choose by teaching style, experience, language and guest reviews."
  - "Contact details are shared after booking confirmation so you can coordinate your meeting point and start time."
- **Status language:** short and literal — "Available this week", "Limited
  availability", "Verified instructor", "2 hour lesson".
- **Avoid:** "ultimate adventure of a lifetime", "act now", urgency countdowns,
  emoji. See the *Brand → Voice & tone* card.

## Visual foundations

**Colour.** A warm neutral **stone-grey** scale (`--grey-50` `#f6f6f3` → `--grey-800`
`#0e0f0d`) carries almost everything: white/`grey-50` surfaces, `grey-600` for text
and dark blocks. A single brand hue — **coral `--rad-600` `#df4b3f`** — is the only
saturated colour in the UI: outline CTAs that fill on hover, links, active filters,
stepper/icon-button hovers. Three barely-there **surface tints** (`olive-50`,
`blue-50`, `sand-50`) differentiate alternating sections. Status colours
(`success-600`, `warning`, `danger-700`) are reserved for badges. Imagery is
cool-toned, snow-bright, occasionally warm at golden hour.

**Type.** **Geist** (variable, 100–900) for all UI, headings and body; **Paytone
One** for the big display "decor" voice (uppercase hero words, watermark numerals).
Headings are set **medium-weight with tight tracking** (`-0.055em`) and balanced
wrapping — never heavy/black. Kickers are 13px semibold uppercase, `0.08em` tracked.
HUD/coordinate labels are 12px uppercase, wide `0.18em` tracking.

**Spacing & layout.** 6→80px spacing scale. Content caps at `--content-width` 1468px
with a responsive `--layout-margin` (18–48px). Sections breathe (48–88px vertical).

**Radii.** Soft and generous: `xsm` 10 → `xl` 36px. **Cards use 22–30px** (outer 28,
inner media 22). Pills are fully rounded (999px) when small, else 10px. Nothing is
sharp-cornered.

**Backgrounds.** Full-bleed photography is the hero device — a cool mountain image
under a subtle top/bottom protection gradient, with an overlaid faint grid and HUD
coordinate labels. Content sections are white or a single quiet tint; no gradients
in content, no noise textures, no decorative blobs.

**Elevation & glass.** Shadows are **quiet and low-contrast** (`--shadow-card`
`0 18px 48px rgba(24,25,22,.06)`; `--shadow-float` for search/menus). Over imagery,
use **frosted glass**: `rgba(255,255,255,.86)` + `blur(9px)` for pills, nav and the
hero search bar. Cards rest borderless-ish (1px `grey-150`) and lift on hover.

**Motion.** Short and eased — 150/200/250ms on `cubic-bezier(0.2,0,0,1)`. Cards
translateY(-4px) + shadow on hover; card images scale to 1.035 over 500ms; FAQ rows
expand via `grid-template-rows`. No bounces, no infinite loops, reduced-motion honored.

**Hover / press.** Hover = coral fill (outline buttons), coral tint (icon/stepper),
subtle -1px lift; links go coral. Focus = 2px `grey-600` outline, 3px offset.
Disabled = 0.4–0.45 opacity, no pointer events.

## Iconography

The product uses **small raster PNG icons** (category and discipline glyphs — ski,
snowboard, instructor, transfer, activity, places, services — in `assets/navbar/`
and `assets/design-2/`) and a few **inline SVGs** (steppers, close, arrows,
star ratings). There is **no icon font** and **no unicode-emoji usage** anywhere.
Ratings use a `★` glyph in coral; the `↗` arrow marks "view / external".

`IconButton` ships a small set of **thin-stroke** inline SVG glyphs (close, arrow,
arrow-left, arrow-down, plus, search) matching the site's line weight — use these
for chrome affordances; use the copied PNG icons for category/discipline meaning.
Copy additional real icons from the repo's `assets/` when you need them rather than
drawing new ones.

## Logo

**No logo mark was provided** in the sources — the site uses a **text wordmark**:
"**My Gudauri**" set in Paytone One, with "My" in `grey-400`/`grey-300` and
"Gudauri" in `grey-600` (inverted to white on dark). Use the wordmark wherever a
mark would go (see *Brand → Wordmark* card). Do not invent a symbol.

## Fonts note

Both families load from **Google Fonts** (`tokens/fonts.css`), exactly as the
production site loads them — so no font binaries are shipped in this project and the
compiler reports 0 `@font-face` files. If you need self-hosted binaries, drop the
`.woff2` files in `assets/fonts/` and add `@font-face` rules to `tokens/fonts.css`.

## Index / manifest

- `styles.css` — global entry point (`@import`s only).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `components/{core,controls,cards,forms,feedback}/` — components (`.jsx` + `.d.ts` + `.prompt.md`) and one `@dsCard` per group.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `ui_kits/website/` — Homepage recreation + README.
- `thumbnail.html` — project tile. `SKILL.md` — Agent-Skill entry point.
- `assets/` — imagery (hero, instructors, media), category & discipline icons, UI-kit SVGs.
