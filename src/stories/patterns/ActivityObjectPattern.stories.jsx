import { ActivityObjectPattern } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { objectPatternProps } from './ObjectPatternStoryParts';
export default { title: 'Patterns/Object/Activity', component: ActivityObjectPattern, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ActivityObjectPattern' }) } };
export const Default = { args: objectPatternProps('activity') };
