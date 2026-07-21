import { MainTag, PrimaryFacts } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Primary Facts', component: PrimaryFacts, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'PrimaryFacts' }) } };
export const Default = { args: { items: [{ label: 'Duration', value: '2–6 hours' }, { label: 'Languages', value: 'EN · RU · KA' }, { label: 'Group', value: '1–6 guests' }, { label: 'Season', value: 'December–April' }] } };
export const MainTagComponent = { name: 'Main Tag', parameters: { composition: defineComposition({ root: 'MainTag' }) }, render: () => <dl><MainTag label="Experience" value="6+ years" /></dl> };
