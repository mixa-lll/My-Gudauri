import { MainTag, ObjectMainTags } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Main Tags Grid', component: ObjectMainTags, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ObjectMainTags' }) } };
export const Default = { args: { items: [{ label: 'Specialization', value: ['Ski', 'Snowboard'] }, { label: 'Languages', value: ['EN', 'RU', 'KA'] }, { label: 'Experience', value: ['6+ years'] }, { label: 'Certificate', value: ['Verified'] }] } };
export const MainTagComponent = { name: 'Main Tag', parameters: { composition: defineComposition({ root: 'MainTag' }) }, render: () => <dl><MainTag label="Languages" value={['EN', 'RU', 'KA']} /></dl> };
