import { RentalObjectPattern } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { objectPatternProps } from './ObjectPatternStoryParts';
export default { title: 'Patterns/Object/Rental', component: RentalObjectPattern, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'RentalObjectPattern' }) } };
export const Default = { args: objectPatternProps('rental') };
