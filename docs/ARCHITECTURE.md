# Architecture

## Goal
Refactor the project into a React component architecture with clear boundaries:
- **UI components** (`src/components/UI`) for reusable primitives.
- **Composite components** (`src/components`) for business/domain blocks.
- **Pages** (`src/pages`) for route-level composition.
- **Data** (`src/data`) for declarative content and configuration.
- **Styles** (`src/styles`) for global SCSS tokens + base rules.

## High-level layers
1. `app` layer
- `src/app/App.jsx` contains route table and top-level composition.

2. `layout` layer
- `MainLayout` composes global shell: navbar, page content, footer.

3. `component` layer
- UI primitives: `Button`, `Pill`, `Container`, `SectionHeading`.
- Composite blocks: `SiteNavbar`, `FaqAccordion`, `CalculatorBanner`, `InstructorCard`, `SiteFooter`.

4. `page` layer
- Routes: Home, Instructors, Profile, Booking Flow, Summary.
- Pages consume composite + UI components, no duplicated low-level markup.

5. `style token` layer
- SCSS token partials define CSS variables in `:root`.
- Components and pages consume only variables, no hardcoded random values.

## DRY decisions
- FAQ logic is centralized in `FaqAccordion` and reused across pages.
- Instructor card markup is centralized in `InstructorCard`.
- Navbar menu data is centralized in `src/data/navCategories.js`.
- Common spacing/color/typography values live in token files only.
