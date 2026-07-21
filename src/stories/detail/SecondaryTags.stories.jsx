import { ObjectTagCloud } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Tag Cloud', component: ObjectTagCloud, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ObjectTagCloud' }) } };
export const Default = { args: { kicker: 'Best suited for', title: 'Lesson focus', items: ['First turns', 'Carving', 'Freeride preparation', 'English', 'Russian'] } };
