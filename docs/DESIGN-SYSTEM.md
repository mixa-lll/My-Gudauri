# My Gudauri design system

The production design system is exported from `src/design-system/index.js`. Storybook demonstrates that API; it is not the implementation source.

## Architecture

The dependency direction is one-way:

```text
Foundations → Primitives → Components → Blocks → Patterns → CMS Templates
```

Pages consume the public design-system barrel. Blocks are grouped by Global, Catalog, Detail, Editorial and Marketing. Patterns describe multi-block user tasks. CMS templates expose named slots and reject arbitrary layout.

## CMS templates

`CatalogPageTemplate` requires SiteNavbar, CatalogHero, CategoryTabs, FilterToolbar, ListingGrid and SiteFooter. PromoArea, BenefitsSection, BookingSteps and FAQSection are optional named positions.

`ObjectDetailPageTemplate` requires SiteNavbar, ObjectHero, PrimaryFacts, DescriptionSection and SiteFooter. Its `additionalSections` data is resolved exclusively through `ADDITIONAL_SECTION_REGISTRY`.

`EditorialArticleTemplate` requires SiteNavbar, ArticleHeader, ArticleBody and SiteFooter. ArticleMedia, TableOfContents, ArticleNotice, Sources and RelatedArticles are optional.

There is no Home, Contacts, About or unique promotion template. There is no WizardTemplate yet because the two existing flows do not share an implemented step structure.

## Statuses

- `draft`: API is still being designed.
- `beta`: usable with review; API may receive compatible refinement.
- `stable`: approved public contract.
- `deprecated`: no new usage; registry includes replacement, removal date and remaining legacy usage.
- `internal`: implementation detail, never consumed by pages or CMS.

## Quality gates

The architecture report enforces public import boundaries. Storybook Composition validates registration, layer dependencies, stories, public exports, cycles and deprecated usage. The a11y addon runs public stories in error mode. The repository rules in `AGENTS.md` are mandatory for future Codex work.
