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
6. Для заголовков маркетинговых и контентных секций использовать только `SectionHeading`; не дублировать `.section-heading__kicker` и `.section-heading__title` в стилях страниц.
7. Канонические стили заголовка находятся рядом с компонентом в `src/components/UI/SectionHeading/SectionHeading.scss`. Файл `styles/section-heading.css` генерируется из него только для статических прототипов.
8. Заголовки карточек, шагов формы и модальных окон остаются локальными компонентными вариантами и не подменяются секционным заголовком.
9. Kicker — короткая sentence-case подпись, описывающая содержание секции. Не использовать призывы к действию или служебные команды вроде “Trust us” и “Refine selection”.

## Generated legacy compatibility

Каталог `styles/` не является вторым источником токенов. Команда `npm run design:sync` генерирует:

- `styles/tokens.css` из `src/styles/tokens/index.scss`;
- `styles/section-heading.css` из React-компонента `SectionHeading`;
- `styles/system.css` из `src/styles/SystemCompat.scss`;
- `styles/design-3-profile.css` из `src/pages/ProfilePage/ProfileLegacy.scss`;
- копии `scripts/shared-navbar.js` и `scripts/shared-faq.js` в `public/scripts/`.

Эти файлы нужны только для HTML-прототипов из `pages/`. Их нельзя редактировать вручную.
