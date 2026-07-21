import { TransferObjectPattern } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { objectPatternProps } from './ObjectPatternStoryParts';
export default { title: 'Patterns/Object/Transfer', component: TransferObjectPattern, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'TransferObjectPattern' }) } };
export const Default = { args: objectPatternProps('transfer') };
