import { InstructorObjectPattern } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { objectPatternProps } from './ObjectPatternStoryParts';
export default { title: 'Patterns/Object/Instructor', component: InstructorObjectPattern, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'InstructorObjectPattern' }) } };
export const Default = { args: objectPatternProps('instructor') };
