/* @ds-bundle: {"format":4,"namespace":"MyGudauriDesignSystem_9a73c7","components":[{"name":"DestinationCard","sourcePath":"components/cards/DestinationCard.jsx"},{"name":"InstructorCard","sourcePath":"components/cards/InstructorCard.jsx"},{"name":"ListingCard","sourcePath":"components/cards/ListingCard.jsx"},{"name":"ListingCardPill","sourcePath":"components/cards/ListingCard.jsx"},{"name":"ListingCardRating","sourcePath":"components/cards/ListingCard.jsx"},{"name":"ListingCardPrice","sourcePath":"components/cards/ListingCard.jsx"},{"name":"IconButton","sourcePath":"components/controls/IconButton.jsx"},{"name":"Stepper","sourcePath":"components/controls/Stepper.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Container","sourcePath":"components/core/Container.jsx"},{"name":"Pill","sourcePath":"components/core/Pill.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"FaqAccordion","sourcePath":"components/feedback/FaqAccordion.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"}],"sourceHashes":{"components/cards/DestinationCard.jsx":"1dcd571b67a5","components/cards/InstructorCard.jsx":"9c9f65b0c08e","components/cards/ListingCard.jsx":"0cf1c8010771","components/controls/IconButton.jsx":"4966ee000c65","components/controls/Stepper.jsx":"2bf77e0809f4","components/core/Button.jsx":"c116797518ca","components/core/Container.jsx":"af81484f06a5","components/core/Pill.jsx":"53d86dd3d998","components/core/SectionHeading.jsx":"d4d5dd7ef07b","components/feedback/Badge.jsx":"c4f7b6665391","components/feedback/FaqAccordion.jsx":"ea94d6dea0e8","components/forms/Checkbox.jsx":"eccaa8dcd1ca","components/forms/Field.jsx":"55b0190be90a","components/forms/Input.jsx":"17df512a4f38","components/forms/Radio.jsx":"b3bccd7f918c","components/forms/Select.jsx":"b304c73ebcdd","components/forms/Textarea.jsx":"27be30bdbaee","ui_kits/website/HomeScreen.jsx":"8bba31feb7f2"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MyGudauriDesignSystem_9a73c7 = window.MyGudauriDesignSystem_9a73c7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/ListingCard.jsx
try { (() => {
const STYLE_ID = 'mg-listingcard-css';
const CSS = `
.mg-lc {
  min-width: 0; overflow: hidden; padding: 7px;
  display: flex; flex-direction: column;
  border: 1px solid var(--grey-150); border-radius: 28px;
  background: var(--grey-white); color: var(--grey-600); text-decoration: none;
  transition: transform var(--motion-duration-slow) var(--motion-ease-standard),
    box-shadow var(--motion-duration-slow) var(--motion-ease-standard),
    border-color var(--motion-duration-base) var(--motion-ease-standard);
}
.mg-lc:hover { border-color: var(--grey-200); box-shadow: var(--shadow-card); transform: translateY(-4px); }
.mg-lc:focus-visible { outline: 2px solid var(--grey-600); outline-offset: 3px; }

.mg-lc__media {
  position: relative; aspect-ratio: 4/3; min-height: 240px; overflow: hidden;
  border-radius: 22px; background: var(--grey-100); isolation: isolate;
}
.mg-lc__media::after {
  content: ''; position: absolute; inset: auto 0 0; height: 44%;
  background: linear-gradient(transparent, rgba(0,0,0,.2)); pointer-events: none;
}
.mg-lc__media > img {
  width: 100%; height: 100%; display: block; object-fit: cover;
  transition: transform 500ms var(--motion-ease-standard);
}
.mg-lc:hover .mg-lc__media > img { transform: scale(1.035); }
.mg-lc--instructor .mg-lc__media { min-height: 0; aspect-ratio: 6/5; }
.mg-lc--instructor .mg-lc__media > img { object-position: 50% 0; }

.mg-lc__media-top, .mg-lc__media-bottom {
  position: absolute; z-index: 2; right: 10px; left: 10px;
  display: flex; align-items: flex-start; flex-wrap: wrap; gap: 6px; pointer-events: none;
}
.mg-lc__media-top { top: 10px; }
.mg-lc__media-bottom { bottom: 10px; }

.mg-lc__cpill {
  min-height: 28px; max-width: 100%; padding: 5px 10px;
  display: inline-flex; align-items: center; gap: 6px; overflow: hidden;
  border: 1px solid rgba(32,33,30,.1); border-radius: 999px;
  background: rgba(255,255,255,.86); color: var(--grey-600); backdrop-filter: blur(9px);
  font: var(--fw-semibold) 12px/1 var(--font-body);
  text-overflow: ellipsis; white-space: nowrap;
}
.mg-lc__cpill img { width: 15px; height: 15px; object-fit: contain; }

.mg-lc__body { flex: 1; min-width: 0; padding: 17px 12px 12px; display: flex; flex-direction: column; }
.mg-lc__eyebrow { margin-bottom: 10px; color: var(--grey-400); font: 600 11px/1.2 var(--font-body); letter-spacing: .06em; text-transform: uppercase; }
.mg-lc__title { margin: 0; color: var(--grey-600); font: 600 22px/1.1 var(--font-heading); letter-spacing: -0.035em; }
.mg-lc__desc {
  min-height: 2.8em; margin: 9px 0 0; overflow: hidden; color: var(--grey-400);
  font: 400 14px/1.4 var(--font-body);
  -webkit-box-orient: vertical; -webkit-line-clamp: 2; display: -webkit-box;
}
.mg-lc__footer {
  min-height: 41px; margin-top: auto; padding-top: 14px;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 14px;
  border-top: 1px solid var(--grey-100);
}
.mg-lc__rating, .mg-lc__price { display: inline-flex; align-items: baseline; }
.mg-lc__rating { gap: 5px; white-space: nowrap; }
.mg-lc__rating b { color: var(--grey-600); font-size: 14px; font-style: normal; }
.mg-lc__rating strong { font: 600 14px/1 var(--font-body); }
.mg-lc__rating small, .mg-lc__price small { color: var(--grey-400); font: 400 11px/1.2 var(--font-body); }
.mg-lc__price { justify-content: flex-end; flex-wrap: wrap; gap: 4px; text-align: right; }
.mg-lc__price strong { font: var(--fw-bold) 17px/1 var(--font-body); white-space: nowrap; }

/* Featured horizontal variant */
.mg-lc--featured { min-height: clamp(500px, 50vw, 680px); display: grid; grid-template-columns: minmax(0,1.25fr) minmax(280px,.75fr); gap: 9px; }
.mg-lc--featured .mg-lc__media { height: 100%; min-height: 460px; aspect-ratio: auto; }
.mg-lc--featured .mg-lc__body { padding: clamp(28px,4vw,54px); }
.mg-lc--featured .mg-lc__eyebrow { margin-bottom: auto; }
.mg-lc--featured .mg-lc__title { margin-top: 54px; font-size: clamp(38px,4vw,62px); font-weight: var(--fw-medium); line-height: .98; letter-spacing: -0.06em; }
.mg-lc--featured .mg-lc__desc { min-height: 0; margin-top: 20px; display: block; -webkit-line-clamp: unset; font-size: 15px; line-height: 1.5; }
.mg-lc--featured .mg-lc__footer { margin-top: 30px; }
@media (max-width: 980px) { .mg-lc--featured { grid-template-columns: 1fr; } }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * ListingCard — the core content card behind instructors, activities, rentals,
 * stays and tours. Rounded white frame, edge-to-edge rounded photo with glass
 * pill overlays, title/description and a footer for rating + price.
 */
function ListingCard({
  href = '#',
  variant = 'default',
  image,
  imageAlt = '',
  mediaTop,
  mediaBottom,
  eyebrow,
  title,
  description,
  headingLevel = 3,
  footer,
  className = ''
}) {
  const Heading = `h${headingLevel}`;
  return /*#__PURE__*/React.createElement("a", {
    className: `mg-lc mg-lc--${variant} ${className}`.trim(),
    href: href
  }, /*#__PURE__*/React.createElement("div", {
    className: "mg-lc__media"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    loading: "lazy"
  }) : null, mediaTop ? /*#__PURE__*/React.createElement("div", {
    className: "mg-lc__media-top"
  }, mediaTop) : null, mediaBottom ? /*#__PURE__*/React.createElement("div", {
    className: "mg-lc__media-bottom"
  }, mediaBottom) : null), /*#__PURE__*/React.createElement("div", {
    className: "mg-lc__body"
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    className: "mg-lc__eyebrow"
  }, eyebrow) : null, /*#__PURE__*/React.createElement(Heading, {
    className: "mg-lc__title"
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    className: "mg-lc__desc"
  }, description) : null, footer ? /*#__PURE__*/React.createElement("div", {
    className: "mg-lc__footer"
  }, footer) : null));
}

/** Frosted overlay pill for use on top of the card image. */
function ListingCardPill({
  children,
  icon,
  title
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mg-lc__cpill",
    title: title
  }, icon ? /*#__PURE__*/React.createElement("img", {
    src: icon,
    alt: "",
    "aria-hidden": "true"
  }) : null, children);
}

/** Star rating + review count for the card footer. */
function ListingCardRating({
  rating,
  reviews
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mg-lc__rating"
  }, /*#__PURE__*/React.createElement("b", {
    "aria-hidden": "true"
  }, "\u2605"), /*#__PURE__*/React.createElement("strong", null, rating), reviews ? /*#__PURE__*/React.createElement("small", null, reviews) : null);
}

/** Price + suffix (e.g. "/ hour") for the card footer. */
function ListingCardPrice({
  price,
  suffix
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mg-lc__price"
  }, /*#__PURE__*/React.createElement("strong", null, price), suffix ? /*#__PURE__*/React.createElement("small", null, suffix) : null);
}
Object.assign(__ds_scope, { ListingCard, ListingCardPill, ListingCardRating, ListingCardPrice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ListingCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/DestinationCard.jsx
try { (() => {
/**
 * DestinationCard — a ListingCard preset for activities, rentals, stays and
 * tours. Category overlays top, tags bottom, rating + price in the footer.
 */
function DestinationCard({
  item,
  section = 'activities',
  featured = false,
  className = ''
}) {
  const {
    slug,
    name,
    description,
    image,
    category,
    tags = [],
    rating,
    reviews,
    price,
    priceSuffix
  } = item;
  return /*#__PURE__*/React.createElement(__ds_scope.ListingCard, {
    className: className,
    variant: featured ? 'featured' : 'default',
    href: `/${section}/${slug}`,
    image: image,
    imageAlt: name,
    title: name,
    description: description,
    eyebrow: featured ? category : undefined,
    mediaTop: !featured && category ? /*#__PURE__*/React.createElement(__ds_scope.ListingCardPill, null, category) : undefined,
    mediaBottom: !featured ? tags.slice(0, 3).map(t => /*#__PURE__*/React.createElement(__ds_scope.ListingCardPill, {
      key: t
    }, t)) : undefined,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, rating ? /*#__PURE__*/React.createElement(__ds_scope.ListingCardRating, {
      rating: rating,
      reviews: reviews
    }) : /*#__PURE__*/React.createElement("span", null), price ? /*#__PURE__*/React.createElement(__ds_scope.ListingCardPrice, {
      price: price,
      suffix: priceSuffix
    }) : null)
  });
}
Object.assign(__ds_scope, { DestinationCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/DestinationCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/InstructorCard.jsx
try { (() => {
/**
 * InstructorCard — a ListingCard preset for a ski/snowboard instructor.
 * Languages overlay top-left, disciplines bottom-left, rating in the footer.
 */
function InstructorCard({
  instructor,
  className = ''
}) {
  const {
    slug,
    name,
    description,
    image,
    rating,
    reviews,
    languages = [],
    sports = []
  } = instructor;
  return /*#__PURE__*/React.createElement(__ds_scope.ListingCard, {
    className: className,
    variant: "instructor",
    href: `/instructors/${slug}`,
    image: image,
    imageAlt: `${name}, instructor in Gudauri`,
    title: name,
    description: description,
    mediaTop: languages.map(l => /*#__PURE__*/React.createElement(__ds_scope.ListingCardPill, {
      key: l.code,
      title: l.name
    }, l.code)),
    mediaBottom: sports.map(s => /*#__PURE__*/React.createElement(__ds_scope.ListingCardPill, {
      key: s.slug,
      icon: s.icon
    }, s.name)),
    footer: /*#__PURE__*/React.createElement(__ds_scope.ListingCardRating, {
      rating: Number(rating).toFixed(1),
      reviews: `${reviews} reviews`
    })
  });
}
Object.assign(__ds_scope, { InstructorCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/InstructorCard.jsx", error: String((e && e.message) || e) }); }

// components/controls/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'mg-iconbtn-css';
const CSS = `
.mg-iconbtn {
  border: 0; border-radius: var(--radius-pill); cursor: pointer; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--grey-50); color: var(--grey-600); position: relative;
  transition: transform .2s var(--motion-ease-standard), background-color .2s var(--motion-ease-standard), color .2s var(--motion-ease-standard);
}
.mg-iconbtn:hover { transform: translateY(-1px); background: var(--rad-600); color: var(--grey-white); }
.mg-iconbtn:focus-visible { outline: 2px solid var(--grey-600); outline-offset: 2px; }
.mg-iconbtn--sm { width: 30px; height: 30px; }
.mg-iconbtn--md { width: 40px; height: 40px; }
.mg-iconbtn--lg { width: 52px; height: 52px; }
.mg-iconbtn--outline { background: transparent; border: 1px solid var(--grey-200); }
.mg-iconbtn--accent { background: var(--rad-600); color: var(--grey-white); }
.mg-iconbtn--light { background: var(--glass-light); backdrop-filter: var(--blur-glass); }
.mg-iconbtn__glyph { width: 42%; height: 42%; display: block; }
.mg-iconbtn__glyph svg { width: 100%; height: 100%; display: block; fill: none; stroke: currentColor; stroke-width: 2; }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}
const GLYPHS = {
  close: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 5l14 14M19 5L5 19"
  })),
  arrow: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h13M12 5l7 7-7 7"
  })),
  'arrow-left': /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 12H6M12 5l-7 7 7 7"
  })),
  'arrow-down': /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v13M5 12l7 7 7-7"
  })),
  plus: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  })),
  search: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3.5-3.5"
  }))
};

/**
 * IconButton — round icon-only control (close, arrow, search). Coral on hover.
 * Icons are stroke glyphs matching the brand's thin-line iconography.
 */
function IconButton({
  glyph = 'close',
  size = 'md',
  tone = 'default',
  label,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label || glyph,
    className: `mg-iconbtn mg-iconbtn--${size} mg-iconbtn--${tone} ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "mg-iconbtn__glyph"
  }, children || GLYPHS[glyph] || GLYPHS.close));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/controls/Stepper.jsx
try { (() => {
const STYLE_ID = 'mg-stepper-css';
const CSS = `
.mg-stepper { display: inline-flex; align-items: center; gap: 6px; }
.mg-stepper__btn {
  width: 30px; height: 30px; border: 0; border-radius: var(--radius-xsm);
  background: var(--grey-50); position: relative; cursor: pointer; padding: 0;
  transition: transform .2s var(--motion-ease-standard), background-color .2s var(--motion-ease-standard);
}
.mg-stepper__btn:hover { transform: translateY(-1px); background: var(--rad-600); }
.mg-stepper__btn:disabled { opacity: .4; pointer-events: none; }
.mg-stepper__btn::before, .mg-stepper__btn::after {
  content: ''; position: absolute; left: 50%; top: 50%;
  width: 11px; height: 2px; background: var(--grey-600);
  transform: translate(-50%, -50%); transition: background-color .2s ease;
}
.mg-stepper__btn:hover::before, .mg-stepper__btn:hover::after { background: var(--grey-white); }
.mg-stepper__btn--minus::after { display: none; }
.mg-stepper__btn--plus::after { transform: translate(-50%, -50%) rotate(90deg); }
.mg-stepper__value {
  min-width: 34px; text-align: center;
  font: var(--fw-medium) var(--text-md)/1 var(--font-body); color: var(--grey-600);
}
.mg-stepper--accent .mg-stepper__btn { background: var(--rad-600); }
.mg-stepper--accent .mg-stepper__btn::before, .mg-stepper--accent .mg-stepper__btn::after { background: var(--grey-white); }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Stepper — increment/decrement control used in the booking calculator
 * (hours, number of guests). Coral hover; optional persistent accent tone.
 */
function Stepper({
  value = 1,
  min = 0,
  max = 99,
  step = 1,
  onChange,
  tone = 'default',
  className = ''
}) {
  const clamp = n => Math.max(min, Math.min(max, n));
  const set = n => {
    if (onChange) onChange(clamp(n));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `mg-stepper mg-stepper--${tone} ${className}`.trim()
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Decrease",
    className: "mg-stepper__btn mg-stepper__btn--minus",
    disabled: value <= min,
    onClick: () => set(value - step)
  }), /*#__PURE__*/React.createElement("span", {
    className: "mg-stepper__value"
  }, value), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Increase",
    className: "mg-stepper__btn mg-stepper__btn--plus",
    disabled: value >= max,
    onClick: () => set(value + step)
  }));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Injects the component stylesheet once. Styling references the global
   design tokens from styles.css; no CSS-in-JS library involved. */
const STYLE_ID = 'mg-button-css';
const CSS = `
.mg-btn {
  border: 1px solid transparent;
  background: transparent;
  color: var(--grey-600);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-150);
  white-space: nowrap;
  font-family: var(--font-body);
  transition: transform .2s var(--motion-ease-standard), background-color .2s var(--motion-ease-standard), color .2s var(--motion-ease-standard), border-color .2s var(--motion-ease-standard);
}
.mg-btn:hover { transform: translateY(-1px); }
.mg-btn:focus-visible { outline: 2px solid var(--grey-600); outline-offset: 3px; }
.mg-btn[disabled] { opacity: .45; pointer-events: none; }

.mg-btn--sm { height: var(--pill-md-h); padding: 0 14px; font: var(--fw-regular) var(--text-sm)/1 var(--font-body); border-radius: var(--radius-xsm); }
.mg-btn--md { height: var(--pill-lg-h); padding: 0 15px; font: var(--fw-regular) var(--text-md)/var(--lh-md-inline) var(--font-body); }
.mg-btn--lg { height: var(--pill-xl-h); padding: 0 20px; font: var(--fw-regular) var(--text-h5)/var(--lh-h5) var(--font-heading); border-radius: var(--radius-md); border-width: 2px; }

.mg-btn--outline { border-color: var(--rad-600); }
.mg-btn--outline:hover { background: var(--rad-600); color: var(--grey-white); }
.mg-btn--dark { background: var(--grey-700); color: var(--grey-white); }
.mg-btn--dark:hover { background: var(--grey-600); }
.mg-btn--light { background: var(--grey-white); color: var(--grey-600); border-color: var(--grey-150); }
.mg-btn--light:hover { background: var(--grey-50); }
.mg-btn--filled { background: var(--rad-600); color: var(--grey-white); border-color: var(--rad-600); }
.mg-btn--filled:hover { background: var(--rad-700); border-color: var(--rad-700); }

.mg-btn__icon { width: 1.15em; height: 1.15em; object-fit: contain; flex: 0 0 auto; }
.mg-btn__arrow { display: inline-flex; }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Button — the primary action control. One brand accent (coral),
 * expressed as outline / filled; plus dark and light neutral variants.
 */
function Button({
  children,
  variant = 'outline',
  size = 'md',
  iconLeft,
  iconRight,
  type = 'button',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: `mg-btn mg-btn--${variant} mg-btn--${size} ${className}`.trim()
  }, rest), iconLeft ? /*#__PURE__*/React.createElement("img", {
    className: "mg-btn__icon",
    src: iconLeft,
    alt: "",
    "aria-hidden": "true"
  }) : null, /*#__PURE__*/React.createElement("span", null, children), iconRight ? /*#__PURE__*/React.createElement("img", {
    className: "mg-btn__icon",
    src: iconRight,
    alt: "",
    "aria-hidden": "true"
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Container.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'mg-container-css';
const CSS = `
.mg-container {
  width: min(100%, var(--content-width));
  margin-inline: auto;
  padding-inline: var(--layout-margin);
}
.mg-container--narrow { --content-width: 980px; }
.mg-container--flush { padding-inline: 0; }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Container — the global horizontal layout wrapper. Caps content at the
 * editorial content width and applies the responsive side margin.
 */
function Container({
  children,
  narrow = false,
  flush = false,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `mg-container ${narrow ? 'mg-container--narrow' : ''} ${flush ? 'mg-container--flush' : ''} ${className}`.trim()
  }, rest), children);
}
Object.assign(__ds_scope, { Container });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Container.jsx", error: String((e && e.message) || e) }); }

// components/core/Pill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'mg-pill-css';
const CSS = `
.mg-pill {
  border: 1px solid transparent;
  border-radius: var(--radius-xsm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  font-family: var(--font-body);
}
.mg-pill--sm { height: 23px; padding: 0 10px; border-radius: var(--radius-pill); font: var(--fw-regular) var(--text-md)/var(--lh-md-inline) var(--font-body); }
.mg-pill--md { height: var(--pill-md-h); padding: 0 12px; font: var(--fw-regular) var(--text-md)/var(--lh-md-inline) var(--font-body); }
.mg-pill--lg { height: var(--pill-lg-h); padding: 0 15px; font: var(--fw-regular) var(--text-md)/var(--lh-md-inline) var(--font-body); }

.mg-pill--light   { border-color: var(--grey-100); background: var(--grey-100); color: var(--grey-600); }
.mg-pill--outline { border-color: var(--grey-600); background: var(--grey-100); color: var(--grey-700); }
.mg-pill--soft    { border-color: var(--grey-50);  background: var(--grey-50);  color: var(--grey-600); }
.mg-pill--dark    { background: var(--grey-600); color: var(--grey-white); }
.mg-pill--accent  { background: var(--rad-100); color: var(--rad-700); }
/* Glass pill — sits over photography (card overlays, hero) */
.mg-pill--glass   { border-color: rgba(32,33,30,.1); background: var(--glass-light); color: var(--grey-600); backdrop-filter: var(--blur-glass); font-weight: var(--fw-semibold); font-size: 12px; }

.mg-pill__icon { width: 16px; height: 16px; object-fit: contain; }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Pill — a small chip/tag for disciplines, languages, categories and filters.
 * The `glass` tone is the frosted overlay used on top of card imagery.
 */
function Pill({
  children,
  size = 'md',
  tone = 'light',
  icon,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `mg-pill mg-pill--${size} mg-pill--${tone} ${className}`.trim()
  }, rest), icon ? /*#__PURE__*/React.createElement("img", {
    className: "mg-pill__icon",
    src: icon,
    alt: "",
    "aria-hidden": "true"
  }) : null, children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Pill.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
const STYLE_ID = 'mg-section-heading-css';
const CSS = `
.mg-sh { display: grid; justify-items: start; gap: 10px; min-width: 0; }
.mg-sh__kicker {
  margin: 0; color: var(--grey-400);
  font: var(--fw-semibold) 13px/1.2 var(--font-body);
  letter-spacing: var(--tracking-wide); text-transform: uppercase;
}
.mg-sh__title {
  max-width: 880px; margin: 0; color: var(--grey-600);
  font-family: var(--font-heading);
  font-size: clamp(44px, 5vw, 68px);
  font-weight: var(--fw-medium);
  letter-spacing: var(--tracking-heading);
  line-height: .98; text-wrap: balance;
}
.mg-sh__desc {
  max-width: 62ch; margin: 8px 0 0; color: var(--grey-400);
  font: var(--fw-regular) var(--text-md)/1.4 var(--font-body);
}
.mg-sh--md .mg-sh__title { font-size: clamp(36px, 4vw, 52px); }
.mg-sh--sm .mg-sh__title { font-size: clamp(28px, 3vw, 36px); letter-spacing: -0.045em; line-height: 1; }
.mg-sh--center { justify-items: center; text-align: center; }
.mg-sh--end { justify-items: end; text-align: right; }
@media (max-width: 640px) {
  .mg-sh__title { font-size: 36px; }
  .mg-sh--md .mg-sh__title { font-size: 34px; }
  .mg-sh--sm .mg-sh__title { font-size: 28px; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * SectionHeading — the single canonical kicker + title + description block
 * for every marketing and content section. Tight, medium-weight Geist display.
 */
function SectionHeading({
  kicker,
  title,
  description,
  size = 'lg',
  align = 'start',
  as: Heading = 'h2',
  className = ''
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: `mg-sh mg-sh--${size} mg-sh--${align} ${className}`.trim()
  }, kicker ? /*#__PURE__*/React.createElement("p", {
    className: "mg-sh__kicker"
  }, kicker) : null, /*#__PURE__*/React.createElement(Heading, {
    className: "mg-sh__title"
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    className: "mg-sh__desc"
  }, description) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const STYLE_ID = 'mg-badge-css';
const CSS = `
.mg-badge {
  display: inline-flex; align-items: center; gap: 6px;
  height: 24px; padding: 0 10px; border-radius: var(--radius-pill);
  font: var(--fw-semibold) 12px/1 var(--font-body); white-space: nowrap;
  border: 1px solid transparent;
}
.mg-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.mg-badge--available { background: rgba(76,154,89,.12); color: var(--success-600); }
.mg-badge--limited   { background: var(--warning-100); color: var(--warning-700); }
.mg-badge--closed    { background: rgba(157,46,46,.1); color: var(--danger-700); }
.mg-badge--verified  { background: var(--rad-100); color: var(--rad-700); }
.mg-badge--neutral   { background: var(--grey-100); color: var(--grey-500); }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Badge — a small status label for availability, verification and stock.
 * Semantic tones map to the status color tokens.
 */
function Badge({
  children,
  tone = 'neutral',
  dot = true,
  className = ''
}) {
  const showDot = dot && tone !== 'verified' && tone !== 'neutral';
  return /*#__PURE__*/React.createElement("span", {
    className: `mg-badge mg-badge--${tone} ${className}`.trim()
  }, showDot ? /*#__PURE__*/React.createElement("span", {
    className: "mg-badge__dot",
    "aria-hidden": "true"
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/FaqAccordion.jsx
try { (() => {
const STYLE_ID = 'mg-faq-css';
const CSS = `
.mg-faq { display: grid; grid-template-columns: minmax(220px, .36fr) minmax(0, 1fr); gap: clamp(28px, 4vw, 56px); }
.mg-faq__head { align-self: start; }
.mg-faq__list { display: grid; gap: 12px; align-content: start; }
.mg-faq__item {
  min-width: 0; background: var(--grey-50); border: 1px solid var(--grey-100);
  border-radius: 18px; padding: 0 clamp(18px, 2vw, 28px);
  transition: border-color var(--motion-duration-base) var(--motion-ease-standard), background-color var(--motion-duration-base) var(--motion-ease-standard);
}
.mg-faq__item:hover { border-color: var(--grey-200); }
.mg-faq__item.is-open { background: var(--grey-white); border-color: var(--grey-200); }
.mg-faq__trigger {
  min-height: 68px; width: 100%; border: 0; background: transparent; padding: 0;
  display: grid; grid-template-columns: 24px 1fr; align-items: center; column-gap: var(--space-400);
  text-align: left; cursor: pointer;
}
.mg-faq__icon { width: 24px; height: 24px; position: relative; }
.mg-faq__icon::before, .mg-faq__icon::after {
  content: ''; position: absolute; left: 50%; top: 50%; width: 14px; height: 2px;
  background: var(--grey-600); transform: translate(-50%, -50%); transition: transform .22s ease;
}
.mg-faq__icon::after { transform: translate(-50%, -50%) rotate(90deg); }
.mg-faq__question { color: var(--grey-600); font: 400 var(--text-md)/var(--lh-md) var(--font-body); }
.mg-faq__wrap { display: grid; grid-template-rows: 0fr; overflow: hidden; transition: grid-template-rows var(--motion-duration-base) var(--motion-ease-standard); }
.mg-faq__answer {
  min-height: 0; margin: 6px 0 22px 40px; overflow: hidden; color: var(--grey-500);
  font: 400 var(--text-md)/var(--lh-md) var(--font-body); max-width: 66ch;
  opacity: 0; transform: translateY(-2px); transition: opacity .22s ease, transform .22s ease;
}
.mg-faq__item.is-open .mg-faq__icon::after { transform: translate(-50%, -50%) rotate(0deg); }
.mg-faq__item.is-open .mg-faq__wrap { grid-template-rows: 1fr; }
.mg-faq__item.is-open .mg-faq__answer { opacity: 1; transform: translateY(0); }
@media (max-width: 860px) { .mg-faq { grid-template-columns: 1fr; } }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * FaqAccordion — single-open accordion with a side SectionHeading, used on
 * every catalog and profile page. Smooth grid-rows expand animation.
 */
function FaqAccordion({
  items = [],
  initialOpen = 0,
  title = 'FAQ',
  kicker = 'Frequently asked questions',
  className = ''
}) {
  const [openIndex, setOpenIndex] = React.useState(initialOpen);
  return /*#__PURE__*/React.createElement("section", {
    className: `mg-faq ${className}`.trim()
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    className: "mg-faq__head",
    kicker: kicker,
    size: "md",
    title: title
  }), /*#__PURE__*/React.createElement("div", {
    className: "mg-faq__list"
  }, items.map((item, index) => {
    const isOpen = openIndex === index;
    return /*#__PURE__*/React.createElement("article", {
      key: item.question,
      className: `mg-faq__item ${isOpen ? 'is-open' : ''}`.trim()
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mg-faq__trigger",
      "aria-expanded": isOpen,
      onClick: () => setOpenIndex(cur => cur === index ? null : index)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mg-faq__icon",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mg-faq__question"
    }, item.question)), /*#__PURE__*/React.createElement("div", {
      className: "mg-faq__wrap",
      "aria-hidden": !isOpen
    }, /*#__PURE__*/React.createElement("p", {
      className: "mg-faq__answer"
    }, item.answer)));
  })));
}
Object.assign(__ds_scope, { FaqAccordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/FaqAccordion.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Custom checkbox — coral fill + white tick when checked. */
const STYLE_ID = 'mg-checkbox-css';
const CSS = `
.mg-checkbox { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; color: var(--grey-600); font: var(--fw-regular) var(--text-md)/1.3 var(--font-body); }
.mg-checkbox input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.mg-checkbox__box { width: 20px; height: 20px; flex: 0 0 auto; position: relative; border: 1px solid var(--grey-300); border-radius: 6px; background: var(--grey-white); transition: background-color .15s ease, border-color .15s ease; }
.mg-checkbox:hover .mg-checkbox__box { border-color: var(--grey-500); }
.mg-checkbox input:focus-visible + .mg-checkbox__box { outline: 2px solid var(--rad-600); outline-offset: 2px; }
.mg-checkbox input:checked + .mg-checkbox__box { background: var(--rad-600); border-color: var(--rad-600); }
.mg-checkbox input:checked + .mg-checkbox__box::after { content: ''; position: absolute; left: 6px; top: 2.5px; width: 5px; height: 10px; border: 2px solid #fff; border-top: 0; border-left: 0; transform: rotate(45deg); }
.mg-checkbox input:disabled + .mg-checkbox__box { opacity: .5; }
.mg-checkbox input:disabled ~ .mg-checkbox__label { opacity: .5; }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Checkbox — labelled boolean control. Forwards native props
 * (checked, onChange, disabled…).
 */
function Checkbox({
  label,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: `mg-checkbox ${className}`.trim()
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "mg-checkbox__box",
    "aria-hidden": "true"
  }), label ? /*#__PURE__*/React.createElement("span", {
    className: "mg-checkbox__label"
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
/* Shared form-field frame: label above the control, optional hint/error below.
   Matches the repo's booking + admin form pattern (label 14px semibold grey-500,
   7px gap, coral required marker, danger-700 error). */
const STYLE_ID = 'mg-field-css';
const CSS = `
.mg-field { display: grid; gap: 7px; min-width: 0; }
.mg-field__label { color: var(--grey-500); font: var(--fw-semibold) var(--text-sm)/1.2 var(--font-body); }
.mg-field__label .req { color: var(--rad-600); margin-left: 2px; }
.mg-field__hint { color: var(--grey-400); font: var(--fw-regular) var(--text-xsm)/1.35 var(--font-body); }
.mg-field__error { color: var(--danger-700); font: var(--fw-medium) var(--text-xsm)/1.35 var(--font-body); }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Field — label + control wrapper with optional hint or error. Wrap any form
 * control (Input, Select, Textarea, a Stepper…) so labelling stays consistent.
 */
function Field({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `mg-field ${className}`.trim()
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "mg-field__label",
    htmlFor: htmlFor
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    className: "req",
    "aria-hidden": "true"
  }, "*") : null) : null, children, error ? /*#__PURE__*/React.createElement("span", {
    className: "mg-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "mg-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Text input. Repo geometry: 1px grey-200 border, radius-xsm, white fill,
   grey-600 text; neutral grey-600 focus ring; danger-700 invalid state. */
const STYLE_ID = 'mg-input-css';
const CSS = `
.mg-input {
  width: 100%; height: 44px; padding: 0 14px;
  border: 1px solid var(--grey-200); border-radius: var(--radius-xsm);
  background: var(--grey-white); color: var(--grey-600);
  font: var(--fw-regular) var(--text-md)/1.2 var(--font-body);
  transition: border-color .2s var(--motion-ease-standard), box-shadow .2s var(--motion-ease-standard);
}
.mg-input::placeholder { color: var(--grey-400); }
.mg-input:hover { border-color: var(--grey-300); }
.mg-input:focus { outline: 0; border-color: var(--grey-600); box-shadow: 0 0 0 3px rgba(32,33,30,.08); }
.mg-input:disabled { background: var(--grey-50); color: var(--grey-300); cursor: not-allowed; }
.mg-input.is-invalid { border-color: var(--danger-700); }
.mg-input.is-invalid:focus { box-shadow: 0 0 0 3px rgba(157,46,46,.14); }
.mg-input--sm { height: 36px; padding: 0 12px; font-size: var(--text-sm); }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Input — single-line text field. Forwards every native input prop
 * (type, value, placeholder, onChange…). Pair with Field for a label.
 */
function Input({
  size = 'md',
  invalid = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: `mg-input mg-input--${size} ${invalid ? 'is-invalid' : ''} ${className}`.trim(),
    "aria-invalid": invalid || undefined
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Custom radio + a convenience RadioGroup. Coral dot when checked. */
const STYLE_ID = 'mg-radio-css';
const CSS = `
.mg-radio-group { display: grid; gap: 10px; }
.mg-radio { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; color: var(--grey-600); font: var(--fw-regular) var(--text-md)/1.3 var(--font-body); }
.mg-radio input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.mg-radio__dot { width: 20px; height: 20px; flex: 0 0 auto; position: relative; border: 1px solid var(--grey-300); border-radius: 50%; background: var(--grey-white); transition: border-color .15s ease; }
.mg-radio:hover .mg-radio__dot { border-color: var(--grey-500); }
.mg-radio input:focus-visible + .mg-radio__dot { outline: 2px solid var(--rad-600); outline-offset: 2px; }
.mg-radio input:checked + .mg-radio__dot { border-color: var(--rad-600); }
.mg-radio input:checked + .mg-radio__dot::after { content: ''; position: absolute; left: 50%; top: 50%; width: 10px; height: 10px; border-radius: 50%; background: var(--rad-600); transform: translate(-50%, -50%); }
.mg-radio input:disabled + .mg-radio__dot { opacity: .5; }
.mg-radio input:disabled ~ .mg-radio__label { opacity: .5; }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Radio — a single labelled radio option. Usually rendered via RadioGroup.
 */
function Radio({
  label,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: `mg-radio ${className}`.trim()
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "mg-radio__dot",
    "aria-hidden": "true"
  }), label ? /*#__PURE__*/React.createElement("span", {
    className: "mg-radio__label"
  }, label) : null);
}

/**
 * RadioGroup — controlled group of radios. `options` is a list of strings or
 * `{ value, label }`. Calls `onChange(value)` on selection.
 */
function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `mg-radio-group ${className}`.trim(),
    role: "radiogroup"
  }, options.map(opt => {
    const o = typeof opt === 'string' ? {
      value: opt,
      label: opt
    } : opt;
    return /*#__PURE__*/React.createElement(Radio, {
      key: o.value,
      name: name,
      value: o.value,
      label: o.label,
      checked: value === o.value,
      onChange: e => onChange && onChange(e.target.value)
    });
  }));
}
Object.assign(__ds_scope, { Radio, RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Native select styled to match Input, with a CSS chevron. */
const STYLE_ID = 'mg-select-css';
const CSS = `
.mg-select { position: relative; display: block; width: 100%; }
.mg-select__el {
  width: 100%; height: 44px; padding: 0 38px 0 14px;
  border: 1px solid var(--grey-200); border-radius: var(--radius-xsm);
  background: var(--grey-white); color: var(--grey-600); cursor: pointer;
  font: var(--fw-regular) var(--text-md)/1.2 var(--font-body);
  appearance: none; -webkit-appearance: none;
  transition: border-color .2s var(--motion-ease-standard), box-shadow .2s var(--motion-ease-standard);
}
.mg-select__el:hover { border-color: var(--grey-300); }
.mg-select__el:focus { outline: 0; border-color: var(--grey-600); box-shadow: 0 0 0 3px rgba(32,33,30,.08); }
.mg-select__el:disabled { background: var(--grey-50); color: var(--grey-300); cursor: not-allowed; }
.mg-select.is-invalid .mg-select__el { border-color: var(--danger-700); }
.mg-select__caret {
  position: absolute; right: 15px; top: 50%; width: 9px; height: 9px;
  border-right: 2px solid var(--grey-400); border-bottom: 2px solid var(--grey-400);
  transform: translateY(-65%) rotate(45deg); pointer-events: none;
}
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Select — native dropdown styled to match Input. Pass <option> children.
 * Forwards native select props (value, onChange, disabled…).
 */
function Select({
  invalid = false,
  className = '',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `mg-select ${invalid ? 'is-invalid' : ''} ${className}`.trim()
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: "mg-select__el",
    "aria-invalid": invalid || undefined
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    className: "mg-select__caret",
    "aria-hidden": "true"
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Multi-line text area. Matches the repo admin textarea: min-height 92px,
   vertical resize, same border/focus language as Input. */
const STYLE_ID = 'mg-textarea-css';
const CSS = `
.mg-textarea {
  width: 100%; min-height: 92px; padding: 11px 14px;
  border: 1px solid var(--grey-200); border-radius: var(--radius-xsm);
  background: var(--grey-white); color: var(--grey-600); resize: vertical;
  font: var(--fw-regular) var(--text-md)/1.45 var(--font-body);
  transition: border-color .2s var(--motion-ease-standard), box-shadow .2s var(--motion-ease-standard);
}
.mg-textarea::placeholder { color: var(--grey-400); }
.mg-textarea:hover { border-color: var(--grey-300); }
.mg-textarea:focus { outline: 0; border-color: var(--grey-600); box-shadow: 0 0 0 3px rgba(32,33,30,.08); }
.mg-textarea:disabled { background: var(--grey-50); color: var(--grey-300); cursor: not-allowed; }
.mg-textarea.is-invalid { border-color: var(--danger-700); }
.mg-textarea.is-invalid:focus { box-shadow: 0 0 0 3px rgba(157,46,46,.14); }
`;
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/**
 * Textarea — multi-line text field for comments, requests and notes.
 * Forwards native props (rows, value, placeholder, onChange…).
 */
function Textarea({
  invalid = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: `mg-textarea ${invalid ? 'is-invalid' : ''} ${className}`.trim(),
    "aria-invalid": invalid || undefined
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
/* global React */
// My Gudauri — marketing homepage, rebuilt to mirror the LIVE site
// (my-gudauri.pages.dev). Chrome (nav/hero/grid/footer) is page-level markup
// ported from the repo; cards come from the design-system bundle.
const {
  InstructorCard,
  SectionHeading,
  FaqAccordion
} = window.MyGudauriDesignSystem_9a73c7;
const A = '../../assets';
const CATEGORIES = [{
  slug: 'instructors',
  title: 'Instructors',
  description: 'Verified ski and snowboard coaches',
  homeClass: 'instructors',
  image: `${A}/design-1/mosaic/instructors-1-98.png`,
  imageAlt: 'Instructor',
  tags: ['Ski', 'Snowboard']
}, {
  slug: 'activities',
  title: 'Activities',
  description: 'Routes, freeride and mountain adventures',
  homeClass: 'tours',
  image: `${A}/design-1/mosaic/tours-1-117-upd.png`,
  imageAlt: 'Mountain activity',
  tagsClass: 'tours-tags',
  tags: ['Freeride', 'Ski tour'],
  hotTags: true
}, {
  slug: 'services',
  title: 'Services',
  description: 'Photo, video, childcare and local professionals',
  homeClass: 'services',
  image: `${A}/design-1/mosaic/services-1-107.png`,
  imageAlt: 'Local professional',
  tagsClass: 'services-tags',
  tags: ['Nannies', 'Photo', 'Video']
}, {
  slug: 'rental',
  title: 'Rental',
  description: 'Equipment for every level and riding style',
  homeClass: 'rental',
  image: `${A}/design-1/mosaic/rental-1-135.png`,
  imageAlt: 'Ski equipment',
  tagsClass: 'rental-tags',
  tags: ['Ski', 'Snowboard']
}, {
  slug: 'transfers',
  title: 'Transfers',
  description: 'Tbilisi, Kutaisi, Batumi and regional routes',
  homeClass: 'transfer',
  image: `${A}/design-1/mosaic/transfer-1-144-upd.png`,
  imageAlt: 'Transfer van',
  tagsClass: 'transfer-tags',
  tags: ['Batumi — Gudauri', 'Tbilisi — Gudauri']
}, {
  slug: 'stays',
  title: 'Stays',
  description: 'Apartments, hotels and chalets close to the slopes',
  homeClass: 'real-estate',
  tagsClass: 'real-estate-tags',
  tags: ['Apartments']
}, {
  slug: 'places',
  title: 'Places',
  description: 'Restaurants, wellness and local essentials',
  homeClass: 'places',
  image: `${A}/design-1/mosaic/places-1-154.png`,
  imageAlt: 'Mountain cafe',
  tags: ['Bars', 'Restaurants']
}];
const SKI = {
  slug: 'ski',
  name: 'Ski',
  icon: `${A}/design-2/icon-ski.png`
};
const SNB = {
  slug: 'snowboard',
  name: 'Snowboard',
  icon: `${A}/design-2/icon-snow.png`
};
const Ge = {
    code: 'Ge',
    name: 'Georgian'
  },
  En = {
    code: 'En',
    name: 'English'
  },
  Ru = {
    code: 'Ru',
    name: 'Russian'
  };
const INSTRUCTORS = [{
  slug: 'mikhail',
  name: 'Mikhail Andreev',
  description: 'Ski & snowboard · 8 years experience',
  rating: 4.8,
  reviews: 6,
  image: `${A}/design-2/card-mikhail.png`,
  sports: [SNB, SKI],
  languages: [Ge, En, Ru]
}, {
  slug: 'oleg',
  name: 'Oleg Yung',
  description: 'Snowboard · Freeride specialist',
  rating: 4.8,
  reviews: 6,
  image: `${A}/design-2/card-oleg.png`,
  sports: [SNB],
  languages: [Ge, En]
}, {
  slug: 'alex-red',
  name: 'Alex Red',
  description: 'Ski · Beginner-friendly lessons',
  rating: 4.8,
  reviews: 6,
  image: `${A}/design-2/card-red-ski.png`,
  sports: [SKI],
  languages: [Ge, En]
}];
const FAQ = [{
  question: 'Is the price different for each instructor?',
  answer: 'All instructors follow the same official rate. You choose by teaching style, experience, language and guest reviews.'
}, {
  question: 'How are lesson hours distributed across days?',
  answer: 'Hours can be split across multiple days based on weather conditions, your pace and instructor availability.'
}, {
  question: 'How does the booking process work?',
  answer: 'Select an instructor, submit lesson details, receive confirmation, and coordinate final timing after approval.'
}, {
  question: 'When do I receive instructor contact details?',
  answer: 'Contact details are shared after booking confirmation so you can coordinate your meeting point and start time.'
}];
const QUICK = ['Ski instructor', 'Freeride', 'Transfer from Tbilisi', 'Apartments'];
function SiteNavbar() {
  return /*#__PURE__*/React.createElement("header", {
    className: "site-nav-host site-nav-host--hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-nav__bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-nav__left"
  }, /*#__PURE__*/React.createElement("a", {
    className: "site-nav__brand",
    href: "#"
  }, /*#__PURE__*/React.createElement("span", {
    className: "site-nav__brand-muted"
  }, "My "), "Gudauri"), /*#__PURE__*/React.createElement("nav", {
    className: "site-nav__links",
    "aria-label": "Main navigation"
  }, /*#__PURE__*/React.createElement("button", {
    className: "site-nav__trigger",
    type: "button"
  }, "Categories", /*#__PURE__*/React.createElement("img", {
    className: "site-nav__chevron",
    src: `${A}/navbar/caret-down.png`,
    alt: "",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("a", {
    className: "site-nav__link",
    href: "#"
  }, "Articles"), /*#__PURE__*/React.createElement("a", {
    className: "site-nav__link",
    href: "#"
  }, "About Gudauri"), /*#__PURE__*/React.createElement("a", {
    className: "site-nav__link",
    href: "mailto:mygudauri@gmail.com"
  }, "Support"))), /*#__PURE__*/React.createElement("a", {
    className: "site-nav__offer",
    href: "#"
  }, "Offer a service"))));
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-12 hero-grid"
  }, /*#__PURE__*/React.createElement(SiteNavbar, null), /*#__PURE__*/React.createElement("div", {
    className: "hero-inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "date-pill"
  }, "LOCAL GUIDE \xB7 2026"), /*#__PURE__*/React.createElement("h1", {
    className: "hero-title-main"
  }, "MY GUDAURI"), /*#__PURE__*/React.createElement("p", {
    className: "hero-subtitle"
  }, "Trusted local services for an effortless mountain stay."), /*#__PURE__*/React.createElement("div", {
    className: "home-hero-search"
  }, /*#__PURE__*/React.createElement("label", {
    className: "home-hero-search__label",
    htmlFor: "home-search"
  }, "Find your Gudauri"), /*#__PURE__*/React.createElement("div", {
    className: "home-hero-search__field"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
  })), /*#__PURE__*/React.createElement("input", {
    id: "home-search",
    type: "search",
    autoComplete: "off",
    placeholder: "Search instructors, stays, transfers\u2026"
  }), /*#__PURE__*/React.createElement("kbd", null, "\u2318 K")), /*#__PURE__*/React.createElement("div", {
    className: "home-hero-search__quick",
    "aria-label": "Popular searches"
  }, QUICK.map(q => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: q
  }, q)))), /*#__PURE__*/React.createElement("div", {
    className: "hero-lift-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    className: "hero-lift",
    src: `${A}/design-1/lift-on-corner-1-25.png`,
    alt: "Cable car"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-mountains-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    className: "hero-mountains",
    src: `${A}/design-1/cloud-head-2118-1400.png`,
    alt: "Gudauri mountain panorama"
  }))))));
}
function ServiceGrid() {
  return /*#__PURE__*/React.createElement("section", {
    className: "service-grid-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "service-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "service-grid-intro"
  }, /*#__PURE__*/React.createElement("p", null, "Explore Gudauri"), /*#__PURE__*/React.createElement("h2", null, "Everything you need,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, "in one place.")), /*#__PURE__*/React.createElement("div", null, "Plan less. Ski more. Choose verified people and services with clear details and local support.")), CATEGORIES.map(c => /*#__PURE__*/React.createElement("a", {
    className: `service-card ${c.homeClass}`,
    href: "#",
    key: c.slug
  }, /*#__PURE__*/React.createElement("h2", null, c.title), /*#__PURE__*/React.createElement("p", null, c.description), c.image ? /*#__PURE__*/React.createElement("img", {
    className: `service-art ${c.homeClass}-art`,
    src: c.image,
    alt: c.imageAlt
  }) : null, /*#__PURE__*/React.createElement("div", {
    className: `tags-row ${c.tagsClass ?? ''}`.trim()
  }, c.tags.map(t => /*#__PURE__*/React.createElement("span", {
    className: `tag ${c.hotTags ? 'hot' : ''}`.trim(),
    key: t
  }, t)))))))));
}
function Instructors() {
  return /*#__PURE__*/React.createElement("section", {
    className: "instructors-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-12 instructors-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "instructors-heading"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Verified professionals",
    title: "Find your instructor",
    size: "md"
  })), /*#__PURE__*/React.createElement("div", {
    className: "instructors-grid"
  }, /*#__PURE__*/React.createElement("article", {
    className: "cta-card"
  }, /*#__PURE__*/React.createElement("p", null, "Compare experience, languages and real guest reviews to find the right teaching style for you."), /*#__PURE__*/React.createElement("a", {
    className: "outline-btn",
    href: "#"
  }, "Show all instructors", /*#__PURE__*/React.createElement("img", {
    className: "ui-btn-md__arrow",
    src: `${A}/ui-kit/btn-md-arrow-dark.png`,
    alt: "",
    "aria-hidden": "true"
  }))), INSTRUCTORS.map(i => /*#__PURE__*/React.createElement(InstructorCard, {
    instructor: i,
    key: i.slug
  }))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-footer__container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-footer__top"
  }, /*#__PURE__*/React.createElement("a", {
    className: "site-footer__brand",
    href: "#"
  }, /*#__PURE__*/React.createElement("span", null, "My"), " Gudauri"), /*#__PURE__*/React.createElement("p", null, "One trusted local guide for instructors, mountain experiences, stays and everything around Gudauri.")), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__main"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "site-footer__column",
    "aria-label": "Services"
  }, /*#__PURE__*/React.createElement("h4", null, "Services"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Instructors"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Activities"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Rental"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Transfers"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Local services")), /*#__PURE__*/React.createElement("nav", {
    className: "site-footer__column",
    "aria-label": "Explore Gudauri"
  }, /*#__PURE__*/React.createElement("h4", null, "Explore"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Stays"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Places"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Articles"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "About Gudauri")), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__column"
  }, /*#__PURE__*/React.createElement("h4", null, "Contact"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+9951234565"
  }, "+995 123 45 65"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:mygudauri@gmail.com"
  }, "mygudauri@gmail.com"), /*#__PURE__*/React.createElement("p", null, "Gudauri, Georgia")), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__cta"
  }, /*#__PURE__*/React.createElement("p", null, "Are you a local professional?"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Offer a service ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2197")))), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__bottom"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 2026 My Gudauri"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:mygudauri@gmail.com"
  }, "Support"), /*#__PURE__*/React.createElement("span", null, "Privacy"), /*#__PURE__*/React.createElement("span", null, "Cookies")), /*#__PURE__*/React.createElement("p", null, "Independent local platform"))));
}
function HomeScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "home-page"
  }, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(ServiceGrid, null), /*#__PURE__*/React.createElement(Instructors, null), /*#__PURE__*/React.createElement("section", {
    className: "faq-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FaqAccordion, {
    kicker: "Frequently asked questions",
    title: "Good to know before you book",
    items: FAQ
  }))), /*#__PURE__*/React.createElement(Footer, null));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.DestinationCard = __ds_scope.DestinationCard;

__ds_ns.InstructorCard = __ds_scope.InstructorCard;

__ds_ns.ListingCard = __ds_scope.ListingCard;

__ds_ns.ListingCardPill = __ds_scope.ListingCardPill;

__ds_ns.ListingCardRating = __ds_scope.ListingCardRating;

__ds_ns.ListingCardPrice = __ds_scope.ListingCardPrice;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Container = __ds_scope.Container;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.FaqAccordion = __ds_scope.FaqAccordion;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

})();
