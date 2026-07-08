# Styling System

## Stack
- **SCSS** (via `sass` + Vite).
- **CSS variables** as the single source of truth for tokens.

## Token files
- `src/styles/tokens/_colors.scss`
- `src/styles/tokens/_spacing.scss`
- `src/styles/tokens/_radius.scss`
- `src/styles/tokens/_typography.scss`
- `src/styles/tokens/_layout.scss`

All files populate `:root` variables, e.g.:
- colors: `--grey-600`, `--rad-600`
- spacing: `--space-500`
- radius: `--radius-md`
- typography: `--text-h4`, `--font-heading`
- layout: `--content-width`, `--layout-margin`, `--layout-gutter`

## Rules
1. Add new visual constants only in token files.
2. In components/pages, use `var(--token-name)` instead of hardcoded values.
3. Keep global reset/base in `src/styles/base/*`.
4. Keep component-level styles near component files (`Component.scss`).
5. Keep page-level styles near page files (`Page.scss`).
