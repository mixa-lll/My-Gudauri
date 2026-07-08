# Components

## UI components (`src/components/UI`)
- `Button`: unified button variants (`outline`, `dark`, `light`) and sizes.
- `Pill`: reusable chips/tags with tone/size options.
- `Container`: global horizontal layout wrapper.
- `SectionHeading`: consistent kicker + title block.

## Composite components (`src/components`)
- `SiteNavbar`: global navbar with overlay categories dropdown.
- `SiteFooter`: global footer block.
- `FaqAccordion`: single-open FAQ with smooth transitions.
- `CalculatorBanner`: pricing banner + modal calculator logic.
- `InstructorCard`: shared instructor card used in multiple pages.

## Data-driven config
- `src/data/navCategories.js`
- `src/data/faqItems.js`
- `src/data/instructors.js`

Use these files to update content without rewriting component markup.
