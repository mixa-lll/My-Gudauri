# Architecture

## Goal
Maintain a React frontend and a Cloudflare-native content backend with clear boundaries:
- **UI components** (`src/components/UI`) for reusable primitives.
- **Composite components** (`src/components`) for business/domain blocks.
- **Pages** (`src/pages`) for route-level composition.
- **Services** (`src/services`) for typed API access and development fallbacks.
- **Backend** (`functions`) for Pages Functions API handlers and repositories.
- **Database** (`db`) for versioned D1 migrations and seed content.
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

6. `data access` layer
- `src/services/instructorsApi.js` is the only frontend entry point for instructor content.
- Production reads from same-origin `/api/instructors` endpoints.
- `src/data/instructors.js` is only a local Vite fallback and is not the production source of truth.

7. `backend` layer
- Cloudflare Pages Functions expose read-only public catalog endpoints.
- `functions/_lib/instructors.js` owns D1 queries and response mapping.
- Route handlers only validate HTTP input, call the repository and format responses.

8. `persistence` layer
- Cloudflare D1 stores CMS entities and relations.
- `db/migrations` is the versioned schema source of truth.
- `db/seed.sql` contains repeatable starter content for local and production environments.

## DRY decisions
- FAQ logic is centralized in `FaqAccordion` and reused across pages.
- Instructor card markup is centralized in `InstructorCard`.
- All instructor cards and profiles use the same D1 records and API contracts.
- Navbar menu data is centralized in `src/data/navCategories.js`.
- Common spacing/color/typography values live in token files only.

## Instructor request flow

1. `/instructors` requests `GET /api/instructors`.
2. D1 returns published instructor summaries plus related disciplines and languages.
3. `InstructorCard` renders every result and links to `/instructors/:slug`.
4. The profile route requests `GET /api/instructors/:slug`.
5. The profile renderer binds the returned CMS record to the existing visual template.
6. Gallery and booking receive the same instructor media and pricing data.

## CMS collections

- `instructors`: identity, publication state, card copy, profile copy, media references, availability and pricing.
- `disciplines`, `instructor_disciplines`: reusable ski/snowboard taxonomy.
- `languages`, `instructor_languages`: reusable language taxonomy.
- `instructor_about`: ordered profile paragraphs.
- `instructor_tags`: ordered audience and teaching-style tags.
- `instructor_media`: ordered image/video gallery with featured media.
- `instructor_reviews`: moderated reviews with publication status.

## Public API

- `GET /api/instructors` — published catalog summaries.
- `GET /api/instructors/:slug` — full published instructor profile.
- Unknown or unpublished slugs return `404`.
- Public responses are edge-cacheable; errors use `no-store`.

## Content operations

```bash
npm run db:migrate:local
npm run db:seed:local
npm run dev:cloudflare
```

Production migrations and seed data are explicit operations:

```bash
npm run db:migrate:remote
npm run db:seed:remote
```

For a future editor UI, add authenticated write endpoints under `/api/admin/*`; public pages should continue reading through the same repository and response contracts.
