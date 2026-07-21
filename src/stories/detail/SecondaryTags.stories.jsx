import { SecondaryTags } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Secondary Tags', component: SecondaryTags, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'SecondaryTags' }) } };
export const Default = { args: { kicker: 'Best suited for', title: 'Lesson focus', items: ['First turns', 'Carving', 'Freeride preparation', 'English', 'Russian'] } };
