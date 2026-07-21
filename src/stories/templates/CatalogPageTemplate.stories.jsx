import { CatalogPageTemplate, CMS_TEMPLATE_CONTRACTS } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { Contract, Slot } from './TemplateStoryParts';

export default {
  title: 'CMS Templates/Catalog Page Template',
  component: CatalogPageTemplate,
  parameters: { fullscreen: true, controls: { disable: true }, composition: defineComposition({ root: 'CatalogPageTemplate' }) },
};

export const Default = {
  render: () => (
    <>
      <Contract contract={CMS_TEMPLATE_CONTRACTS.catalog} />
      <CatalogPageTemplate
        navbar={<Slot name="SiteNavbar" />}
        hero={<Slot name="CatalogHero" />}
        categoryTabs={<Slot name="CategoryTabs" />}
        filterToolbar={<Slot name="FilterToolbar" />}
        listingGrid={<Slot name="ListingGrid" />}
        promoArea={<Slot name="PromoArea" optional />}
        benefitsSection={<Slot name="BenefitsSection" optional />}
        bookingSteps={<Slot name="BookingSteps" optional />}
        faqSection={<Slot name="FAQSection" optional />}
        footer={<Slot name="SiteFooter" />}
      />
    </>
  ),
};
