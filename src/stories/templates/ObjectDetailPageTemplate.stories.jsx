import { CMS_TEMPLATE_CONTRACTS, ObjectDetailPageTemplate } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { Contract, Slot } from './TemplateStoryParts';

export default {
  title: 'CMS Templates/Object Detail Page Template',
  component: ObjectDetailPageTemplate,
  tags: ['autodocs'],
  parameters: { fullscreen: true, controls: { disable: true }, composition: defineComposition({ root: 'ObjectDetailPageTemplate' }) },
};

export const Default = {
  render: () => (
    <>
      <Contract contract={CMS_TEMPLATE_CONTRACTS.objectDetail} />
      <ObjectDetailPageTemplate
        navbar={<Slot name="SiteNavbar" />}
        hero={<Slot name="ObjectHero" />}
        content={<Slot name="InstructorObjectPattern" />}
        footer={<Slot name="SiteFooter" />}
      />
    </>
  ),
};
