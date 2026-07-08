# My Gudauri (React Refactor)

React + SCSS refactor with reusable components, tokenized styling, and route-based pages.

## Quick start

```bash
npm install
npm run dev
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
- `/profile` Instructor Profile
- `/booking` Booking Flow
- `/summary` Booking Summary
