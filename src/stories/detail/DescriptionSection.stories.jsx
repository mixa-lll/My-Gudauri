import { ObjectDescription } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Object Description', component: ObjectDescription, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ObjectDescription' }) } };
export const Default = { args: { title: 'About this experience', tags: ['First turns', 'Carving', 'English'], tagsLabel: 'Lesson focus', children: <><p>Long-form content stays within the readable text width and follows the page heading sequence.</p><p>Supporting tags belong to the same content block and do not introduce another heading.</p></> } };
