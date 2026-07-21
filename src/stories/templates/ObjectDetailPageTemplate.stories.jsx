import { CMS_TEMPLATE_CONTRACTS, ObjectDetailPageTemplate } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { Contract, Slot } from './TemplateStoryParts';

export default {
  title: 'CMS Templates/Object Detail Page Template',
  component: ObjectDetailPageTemplate,
  parameters: { fullscreen: true, controls: { disable: true }, composition: defineComposition({ root: 'ObjectDetailPageTemplate' }) },
};

export const Default = {
  render: () => (
    <>
      <Contract contract={CMS_TEMPLATE_CONTRACTS.objectDetail} />
      <ObjectDetailPageTemplate
        navbar={<Slot name="SiteNavbar" />}
        hero={<Slot name="ObjectHero" />}
        primaryFacts={<Slot name="PrimaryFacts" />}
        description={<Slot name="DescriptionSection" />}
        additionalDetails={<Slot name="AdditionalDetails" optional />}
        reviews={<Slot name="ReviewsSection" optional />}
        faqSection={<Slot name="FaqAccordion" optional />}
        bookingWidget={<Slot name="StickyBookingWidget" optional />}
        footer={<Slot name="SiteFooter" />}
        additionalSections={[]}
      />
    </>
  ),
};
