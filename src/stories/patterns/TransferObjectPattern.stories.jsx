import { PATTERN_CONTRACTS, TransferObjectPattern } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { objectPatternProps } from './ObjectPatternStoryParts';
export default { title: 'Patterns/Object/Transfer', component: TransferObjectPattern, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'TransferObjectPattern' }), docs: { description: { component: `${PATTERN_CONTRACTS.transferObject.task} Sequence: ${PATTERN_CONTRACTS.transferObject.sequence.join(' → ')}.` } } } };
export const Default = { args: objectPatternProps('transfer') };
