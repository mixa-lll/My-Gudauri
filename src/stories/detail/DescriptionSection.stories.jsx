import { DescriptionSection } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Description Section', component: DescriptionSection, parameters: { composition: defineComposition({ root: 'DescriptionSection' }) } };
export const Default = { args: { title: 'About this experience', children: <><p>Long-form content stays within the readable text width and follows the page heading sequence.</p><p>CMS content is sanitized before it reaches this named section.</p></> } };
