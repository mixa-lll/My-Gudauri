# Components

## UI components (`src/components/UI`)
- `Button`: unified button variants (`outline`, `dark`, `light`) and sizes.
- `Pill`: reusable chips/tags with independent size and tone options. Use `sm` (28 px) inside cards, search suggestions and compact metadata; use `md` (30 px) for standalone labels; reserve `lg` for roomy controls. Available tones: `light`, `soft`, `outline`, `glass`, `dark`, and `accent`. It supports `as="button"` for interactive chips.
- `Container`: global horizontal layout wrapper.
- `SectionHeading`: единый блок kicker + title + optional description. Размеры: `lg` для крупных маркетинговых секций, `md` для контентных секций и FAQ, `sm` для компактных панелей. Выравнивание задаётся через `align`.

## Composite components (`src/components`)
- `SiteNavbar`: global navbar with overlay categories dropdown.
- `SiteFooter`: global footer block.
- `FaqAccordion`: single-open FAQ with smooth transitions; всегда использует `SectionHeading` и общий список `FAQ_ITEMS`.
- `CalculatorBanner`: pricing banner + modal calculator logic.
- `InstructorCard`: shared instructor card used in multiple pages.

## Data-driven config
- `src/data/navCategories.js`
- `src/data/faqItems.js`
- `src/data/instructors.js`

Use these files to update content without rewriting component markup.
