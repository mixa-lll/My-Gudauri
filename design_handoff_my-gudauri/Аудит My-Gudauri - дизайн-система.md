# Аудит My-Gudauri: единство дизайн-системы, компонентов и качества

Репозиторий: `mixa-lll/My-Gudauri@main`
Что проверял: токены, `styles/system.css`, `styles/design-1/2/3-*.css`, `styles/section-heading.css`, `styles/shared-faq.css`, весь `src/` (токены, база, UI-компоненты, композитные компоненты, страницы), `docs/*`, данные (`navCategories.js`).

---

## 0. Краткий вывод (TL;DR)

Проект заявляет token-first дизайн-систему и DRY (`docs/STYLING.md`, `docs/ARCHITECTURE.md`), но по факту в нём **две параллельные, конфликтующие реализации** одной и той же системы:

1. **Legacy-статик** — `pages/`, `styles/`, `scripts/`.
2. **React** — `src/`.

Обе живут одновременно, React-страницы **подключают и то, и другое** (`import '../../../styles/system.css'` + `refinement.scss`), из-за чего один и тот же класс красится в двух местах с **разными значениями**, и итог зависит от порядка загрузки CSS. Это главная причина «неединообразия».

Ниже — по пунктам, с примерами.

---

## 1. Два конфликтующих набора токенов (критично)

Один и тот же токен определён дважды с **разными значениями**:

`styles/tokens.css` (legacy) vs `src/styles/tokens/_colors.scss` (React):

| Токен | legacy `tokens.css` | React `_colors.scss` |
|---|---|---|
| `--grey-50` | `#f7f7f7` | `#f6f6f3` |
| `--grey-100` | `#f0f0f0` | `#eeeeea` |
| `--grey-300` | `#aaaaaa` | `#a3a39b` |
| `--grey-600` | `#2b2b2b` | `#20211e` |
| `--grey-700` | `#222222` | `#151612` |
| `--rad-600` (акцент) | `#eb3232` | `#df4b3f` |

То же по радиусам — `styles/tokens.css` vs `src/styles/tokens/_radius.scss`:

- `--radius-xsm`: **8px** vs **10px**
- `--radius-md`: **18px** vs **20px**
- `--radius-lg`: **24px** vs **28px**

**Последствие:** бренд-красный, весь серый градиент и скругления зависят от того, какой файл выиграл каскад. В `InstructorsPage.jsx` подключён `styles/system.css` (тянет legacy `tokens.css` → `#eb3232`), а глобально грузится `refinement.scss` поверх → часть правил уже на React-палитре. Кнопка и пилюля на одной странице могут оказаться разного красного.

**Фикс:** оставить **один** источник токенов. React-набор (`src/styles/tokens/*`) полнее и новее — сделать его единственным, а `styles/tokens.css` удалить и переписать legacy-CSS на те же переменные (или удалить legacy целиком, см. п.7).

---

## 2. `refinement.scss` переопределяет токены прямо в компоненте-слое

`src/styles/refinement.scss` в `:root` заново задаёт:

```scss
:root {
  --content-width: 1440px;   /* а в tokens: 1468px */
  --layout-margin: clamp(18px, 3vw, 48px);  /* в токенах: 40px */
  --layout-gutter: clamp(12px, 1.4vw, 20px);
}
```

То есть третье значение `--content-width` (1468 в `tokens.css`, 1468 в `_layout.scss`, **1440** тут) плюс четвёртое — `.home-page { max-width: 1600px }` в том же файле. Ширина макета сейчас определяется случайно, порядком импорта.

`refinement.scss` фактически стал «файлом, который чинит всё поверх всего» — 18 КБ переопределений. Это анти-паттерн: правки токенов должны жить в токенах, а не в отдельном override-слое.

---

## 3. Битый / подозрительный токен `--lh-md-inline: 10px`

В обоих наборах типографики (`styles/tokens.css` и `src/styles/tokens/_typography.scss`):

```css
--lh-md-inline: 10px;
```

Это line-height 10px для текста 16px — артефакт экспорта из Figma (inline-строка). Он используется **повсеместно**: навигация, пилюли, кнопки, чипы, `.body-md-inline`:

```css
.site-nav__link { font: 400 var(--text-md)/ var(--lh-md-inline) var(--font-body); }
.ui-pill-md    { font: 400 var(--text-md)/ var(--lh-md-inline) ...; }
.ui-btn-md     { font: 400 var(--text-md)/ var(--lh-md-inline) ...; }
```

Текст с line-height меньше кегля обрезается/наезжает при переносе и ломает вертикальное центрирование. Держится только потому, что элементы фиксированной высоты с `align-items:center`. Любой перенос строки — визуальный баг.

**Фикс:** заменить на нормальный inline line-height (`1` или `1.2`); высоту контролировать высотой контейнера, а не line-height.

---

## 4. Нестандартные веса шрифта в обход `--fw-*`

Токены задают только три веса: `--fw-regular:400`, `--fw-medium:500`, `--fw-bold:700`. Но `refinement.scss` вводит произвольные:

```scss
.site-nav__brand { font-weight: 720; }
.hero-title-main { font-weight: 680; }
.site-nav__link  { font-weight: 520; }
.catalog-title   { font-weight: 560; }
.service-grid-intro > h2 { font-weight: 540; }
.date-pill { font-weight: 650; }
```

Geist — variable font, поэтому 520/540/680/720 отрисуются, но это уже не система: одинаковые по смыслу заголовки набраны 540, 560, 580, 680. Нужно свести к шкале (400/500/600/700) и завести `--fw-semibold:600`, если он реально нужен.

---

## 5. Дублирование компонентов, которые заявлены как «единые»

`docs/COMPONENTS.md` обещает единые `SiteFooter`, `SiteNavbar`, `SectionHeading`, `FaqAccordion`. По факту:

**5.1. Футер скопирован дословно в 3 файла.** Блоки `.home-footer / .footer-top / .footer-brand-wrap / .footer-main / .contacts / .footer-nav / .legal / .socials` идентичны в `design-1-home.css`, `design-2-instructors.css`, `design-3-profile.css` (по ~80 строк один-в-один). Плюс отдельный React `SiteFooter.scss`. Правку футера сейчас надо вносить в 4 местах.

**5.2. Две навигации.** Система построена на `.site-nav*` (`system.css` + React `SiteNavbar`), но `design-1-home.css` содержит **вторую**, независимую навигацию: `.home-navbar / .home-nav-links / .nav-link / .dropdown / .dropdown-menu / .caret / .offer-btn`. Другая разметка, другие классы, другой дропдаун (CSS-каретка вместо иконки-шеврона). Домашняя legacy-страница выглядит иначе, чем каталог.

**5.3. Три системы заголовков одновременно:**
- `.section-heading__*` — `styles/section-heading.css` (React `SectionHeading`);
- `.kicker` + `.section-title` — `src/styles/base/_typography.scss`, и **повторно** в `refinement.scss` с другими значениями (kicker: 13px/600/uppercase против 14px/500 в base);
- `shared-faq.css` переопределяет `.section-heading__title` на `font-decor` 48px — то есть FAQ-заголовок ведёт себя не как остальные секционные.

Итог: kicker в разных секциях — то 13px uppercase, то 14px обычный.

---

## 6. Хардкод вместо токенов (нарушение правила STYLING.md #2)

Правило: «в компонентах/страницах использовать `var(--token)`, а не хардкод». Нарушается массово:

- Прямые hex: `#e9e9e9`, `#1f1f1f` (`design-1-home.css` — hover навбара), `#51ee6b` и `rgba(38,76,44,.42)` (`design-2` — калькулятор), хотя в React-токенах для этого уже есть `--green-600/--green-700`.
- «Магические» Figma-координаты пикселями: `grid-template-columns: 332.738px 17.262px 205px ...` (сервис-грид), `.profile-hero { grid-template-columns: 753px 514px }`, `.profile-facts { 160px 166px 160px 160px }`, `width: 514.531px`, `1027px`, `1301px`, `1268px`.
- Спрайт-аватары на процентах: `.avatar img { width: 2538.87%; top: -918.87% }` — нечитаемо и хрупко.

Такие значения нельзя переиспользовать и невозможно поддерживать. `refinement.scss` частично их лечит (переводит сервис-грид на `repeat(3, 1fr)`), но исходные значения остаются в legacy-CSS и конфликтуют.

---

## 7. Дубли и рассинхрон файлов

**7.1. `scripts/` vs `public/scripts/` — копии, которые уже разъехались:**
- `scripts/design-1-home.js`, `design-2`, `design-3` — совпадают с `public/scripts/` (одинаковые хеши). ОК как копии, но копии.
- А вот `scripts/shared-navbar.js` (`@0683707…`) ≠ `public/scripts/shared-navbar.js` (`@8a27640…`), и `scripts/shared-faq.js` (`@799f375…`) ≠ `public/scripts/shared-faq.js` (`@9c33303…`). **Один и тот же скрипт с разным содержимым в двух местах** — классический источник «на одной странице работает, на другой нет».

**7.2. Legacy vs React** держатся параллельно (`docs/PROJECT-STRUCTURE.md`: «legacy kept for reference»), но React-страницы **импортируют legacy-CSS** (`system.css`, `design-2-instructors.css` в `InstructorsPage.jsx`) — значит legacy не «reference», а активная зависимость. Либо честно мигрировать и удалить legacy, либо не тащить его в React.

---

## 8. Единообразие структуры сайта (важно для наших вайрфреймов)

Таксономия категорий не совпадает между тремя источниками:

- `src/data/navCategories.js` (6 пунктов): **Instructors, Rent, Transfer, Activity, Services, Places**.
- Сервис-грид главной (`design-1-home.css`, 7 карточек): **instructors, tours, rental, places, services, transfer, real-estate**.
- Наши вайрфреймы (7): Instructors, Rental, Transfer, Tours, Services, Housing, Places.

Расхождения: `Rent` vs `rental` vs «Аренда»; `Activity` (навбар) vs `tours` (грид) vs `Tours` (вайрфрейм); `real-estate` есть в гриде и вайрфрейме (Housing), но **отсутствует в навбаре**. Нужен один канонический список категорий и slug'ов.

**Все категории, кроме инструкторов — заглушки.** В `navCategories.js` только `Instructors → /instructors`, остальные ведут на `/summary`. Реально реализован лишь флоу инструкторов (каталог → профиль → бронь). 6 из 7 разделов из вайрфреймов в коде не существуют.

---

## 9. Разный уровень проработки страниц

- `BookingFlowPage.jsx` — 37.5 КБ, полноценный. `SummaryPage.jsx` — **813 байт** (почти пустой). Legacy `design-4-booking-flow.html` (2.9 КБ) и `design-5-summary.html` (2.4 КБ) — плейсхолдеры против `design-2-instructors.html` (25.6 КБ).
- Инструкторы имеют бэкенд (D1 + Pages Functions + сиды), остальное — нет. Хорошо для инструкторов, но подчёркивает неравномерность.

---

## 10. Прочие мелочи качества

- Именование смешанное: legacy по Figma-фреймам (`design-1-home`, `design-2-instructors`), React семантически (`HomePage`, `InstructorsPage`). Класс `.real-estate` в CSS, но `Housing` в вайрфрейме, `Places`/`Activity` в навбаре — единого словаря нет.
- `--text-h4-bold`, `--text-h4-bold-url` = те же 32px, что и `--text-h4` — токены-дубли без смысла.
- `styles/system.css` содержит и `.site-nav*` (актуальное), и старые `.navbar / .brand / .nav-links` (не используются React) — мёртвый код.
- Комментарии со ссылками на Figma-узлы в проде: `/* UI kit components (Figma source: 197:1879 ...) */` — уместно в дизайн-файле, не в system.css.

---

## Приоритетный план исправлений

**P0 — убрать двойные источники правды**
1. Один набор токенов (React `src/styles/tokens/*`), удалить `styles/tokens.css`; выровнять `--rad-600`, `--grey-*`, `--radius-*`.
2. Убрать переопределения `--content-width` / `--layout-*` из `refinement.scss` — вернуть в токены одно значение.
3. Устранить рассинхрон `scripts/` ↔ `public/scripts/` (оставить один каталог).

**P1 — единые компоненты**
4. Один футер (React `SiteFooter`), удалить копии из трёх `design-*.css`.
5. Одна навигация (`.site-nav`), удалить `.home-navbar/.dropdown` из `design-1-home.css`.
6. Один заголовок: свести `.section-heading` / `.kicker` / `.section-title` к одному, убрать дубль из `refinement.scss`.

**P2 — гигиена значений**
7. Починить `--lh-md-inline` (10px → 1/1.2).
8. Свести веса шрифта к шкале 400/500/600/700.
9. Заменить Figma-хардкод (px-координаты, %-аватары, hex `#51ee6b`/`#1f1f1f`) на токены/grid-fr.

**P3 — структура сайта**
10. Канонический список 7 категорий + slug'и, синхронный в `navCategories.js`, сервис-гриде и вайрфреймах.
11. Дорожная карта для 6 нереализованных разделов по образцу флоу инструкторов.
12. Решить судьбу legacy: либо мигрировать и удалить `pages/ styles/ scripts/`, либо перестать импортировать их в React.
