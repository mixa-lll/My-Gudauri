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
