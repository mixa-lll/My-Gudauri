import { defineComposition } from '../design-system/architecture/registry';
import { RegisteredAdditionalSections } from '../design-system/blocks/detail/DetailBlocks';

export default { title: 'Design System/Composition/Registered Sections', component: RegisteredAdditionalSections, parameters: { controls: { disable: true }, composition: defineComposition({ root: 'RegisteredAdditionalSections' }) } };
export const AllowedRegistry = { render: () => <main className="sb-canvas sb-section"><p className="sb-template-note">Internal CMS guard. Product authors use ObjectDetailPageTemplate.additionalSections instead of rendering this component directly.</p><RegisteredAdditionalSections sections={[{ type: 'includedServices', items: ['Equipment check', 'Route briefing'] }, { type: 'safetyRequirements', notice: 'Weather can change quickly.', items: ['Helmet required', 'Follow guide instructions'] }]} /></main> };
