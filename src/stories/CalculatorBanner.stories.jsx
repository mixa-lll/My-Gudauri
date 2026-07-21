import { Button, PromoArea } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default { title: 'Blocks/Catalog/Promo', component: PromoArea, parameters: { composition: defineComposition({ root: 'PromoArea' }) } };

const base = { title: 'Plan with a local expert', description: 'Tell us what you need and receive a curated selection.', action: <Button>Start selection</Button> };
export const SplitPromo = { args: { promo: { type: 'split', eyebrow: 'Recommended', ...base } } };
export const RateBanner = { args: { promo: { type: 'rate', title: 'Private lessons from 200 GEL', description: 'Final price depends on duration and group size.' } } };
export const SafetyNotice = { args: { promo: { type: 'safety', title: 'Check mountain conditions', description: 'Routes and lift access can change with weather.' } } };
export const SelectionCTA = { args: { promo: { type: 'selection', ...base } } };
export const ConditionsBanner = { args: { promo: { type: 'conditions', title: 'Flexible booking conditions', description: 'Review cancellation and rescheduling before you confirm.' } } };
