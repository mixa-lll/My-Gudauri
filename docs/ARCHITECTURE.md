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
- Standard content pages compose `SiteNavbar`, route content and `SiteFooter` in the same order.
- `BookingFlowPage` intentionally owns a focused transaction header, but still uses the shared footer.

3. `component` layer
- UI primitives: `Button`, `Pill`, `Container`, `SectionHeading`.
- Composite blocks: `SiteNavbar`, `FaqAccordion`, `CalculatorBanner`, `InstructorCard`, `SiteFooter`.

4. `page` layer
- Routes: Home, unified destination catalogs, destination details, instructor profiles, Booking Flow, Articles and About Gudauri.
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
- Catalog card markup is centralized in `DestinationCard` and `ListingCard`; `InstructorCard` is a thin compatibility wrapper.
- All instructor cards and profiles use the same D1 records and API contracts.
- The seven site categories are centralized in `src/data/siteCategories.js`; navbar and home cards derive from this list.
- Common spacing/color/typography values live in token files only.

## Instructor request flow

1. `/instructors` requests `GET /api/instructors`.
2. D1 returns published instructor summaries plus related disciplines and languages.
3. `InstructorCard` renders every result and links to `/instructors/:slug`.
4. The profile route requests `GET /api/instructors/:slug`.
5. The profile renderer binds the returned CMS record to the existing visual template.
6. Gallery and booking receive the same instructor media and pricing data.

## Transaction and inquiry boundaries

- `instructors` is transactional: catalog → profile → `/booking` → an in-flow success summary with the real request ID and submitted details.
- `activities`, `rental`, `transfers`, `services`, `stays` and `places` are browse-and-inquiry sections: catalog → detail → email inquiry.
- Destination details must not link into the instructor booking flow until their own payload, validation and backend persistence exist.
- There is no standalone `/summary` route. The former page was a hardcoded prototype; the live booking flow owns its request review and success state.

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

The authenticated editor lives under `/api/admin/*`; public pages continue reading through the same repository and response contracts.

## Legacy boundary

- `pages/`, `styles/` and classic `scripts/` are static reference prototypes, not production component sources.
- React imports only sources under `src/`; no production component imports a stylesheet from the root `styles/` directory.
- `styles/system.css`, `styles/design-3-profile.css`, tokens and `SectionHeading` compatibility CSS are generated from React sources by `npm run design:sync` for static prototypes.
- Production navigation and footer are exclusively `SiteNavbar` and `SiteFooter`.
