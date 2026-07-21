# My Gudauri design-system rules

These rules apply to every Codex change in this repository.

## Source of truth

- Inspect Storybook and `src/design-system/architecture/registry.ts` before creating UI.
- Import production UI only from `src/design-system`; never deep-import component implementation files.
- Reuse a registered public component or block. Do not create a page-local equivalent of an existing element.
- Do not use anything with `deprecated` status for new work.

## Tokens and variants

- Use semantic color roles (`surface-*`, `text-*`, `border-*`, `action-*`, `status-*`, `focus-ring`) in production UI. Raw palette tokens are foundation implementation details.
- Use spacing, radius, motion, focus, layer, opacity, control-height, icon-size and media-ratio tokens. Do not introduce raw values where a token exists.
- Add a variant only for a named, confirmed product scenario. Story-only labels such as `template` or `filled` must never enter a production component API.

## CMS composition

- Use `CatalogPageTemplate`, `ObjectDetailPageTemplate` or `EditorialArticleTemplate`; never build a conditional mega-template.
- CMS pages may compose only named template slots and registered blocks.
- `ObjectDetailPageTemplate.additionalSections` accepts only keys from `ADDITIONAL_SECTION_REGISTRY`.
- Promo content accepts only keys from `PROMO_TYPES`; arbitrary promo markup is not a CMS option.
- Do not add `WizardTemplate` until Booking and Instructor Match share one implemented step contract.

## Definition of done

- Add or update a Storybook story, autodocs and Composition metadata for every public component, block, pattern or template change.
- Add the element to the design-system registry with layer, status, source, story, public export and allowed dependencies.
- Cover default, focus, disabled, validation and async states when applicable.
- Verify keyboard navigation, visible focus, heading order, ARIA, contrast, dialog focus management, reduced motion and touch target size.
- Run `npm run architecture:check`, `npm run build`, and `npm run build-storybook`.
- Finish with zero Design QA errors and zero architecture warnings.
