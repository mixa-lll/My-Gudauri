# My Gudauri (React Refactor)

React + SCSS refactor with reusable components, tokenized styling, and route-based pages.

Instructor content is stored in Cloudflare D1 and served through Cloudflare Pages Functions.

## Quick start

```bash
npm install
npm run dev
```

Run the full Cloudflare stack with local D1 and API routes:

```bash
npm run db:migrate:local
npm run db:seed:local
npm run dev:cloudflare
```

## Admin panel

The content editor is available at `/admin`. It manages instructor cards (including status, profile data, disciplines, languages, gallery and reviews) and category visibility/order.

Configure credentials before running Pages locally or deploying:

```bash
wrangler pages secret put ADMIN_PASSWORD
wrangler pages secret put ADMIN_SESSION_SECRET
```

For local development, add `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` to `.dev.vars` (do not commit it). Apply the new migration with `npm run db:migrate:local` or `npm run db:migrate:remote`.

Build production bundle:

```bash
npm run build
npm run preview
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Component Catalog](./docs/COMPONENTS.md)
- [Styling System (SCSS + CSS variables)](./docs/STYLING.md)
- [Project Structure](./docs/PROJECT-STRUCTURE.md)

## Main principles implemented

1. **DRY**
- Shared logic/components moved into reusable blocks.
- Repeated content moved to `src/data/*`.

2. **Component boundaries**
- `src/components/UI` for primitive UI components.
- `src/components` for composite/feature components.
- `src/pages` for route composition only.

3. **Token-first styling**
- All shared values in SCSS token files under `src/styles/tokens`.
- Components/pages consume tokens through CSS variables.

4. **Safe migration path**
- Legacy static implementation (`pages/`, `styles/`, `scripts/`) is preserved as reference while React architecture is now primary.

## Routes

- `/` Home
- `/instructors` Instructor Catalog
- `/instructors/:slug` Dynamic Instructor Profile
- `/profile` Redirect to the Mikhail profile for backwards compatibility
- `/booking` Booking Flow
- `/summary` Booking Summary
