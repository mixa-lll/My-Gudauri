import { StayObjectPattern } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { objectPatternProps } from './ObjectPatternStoryParts';
export default { title: 'Patterns/Object/Stay', component: StayObjectPattern, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'StayObjectPattern' }) } };
export const Default = { args: objectPatternProps('stay') };
