import { MainTag, ObjectMainTags } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Main Tags Grid', component: ObjectMainTags, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ObjectMainTags' }) } };
export const Default = { args: { items: [{ label: 'Difficulty', value: 3, display: 'difficulty' }, { label: 'Duration', value: '6 hours' }, { label: 'Highest point', value: '3,300 m' }] } };
export const DifficultyLevels = { name: 'Difficulty — representative levels', render: () => <dl className="ds-object-main-tags">{[1, 3, 5].map((level) => <MainTag key={level} label={`Difficulty ${level}`} value={level} display="difficulty" />)}</dl> };
export const GenericValues = { name: 'Generic values', args: { items: [{ label: 'Specialization', value: ['Ski', 'Snowboard'] }, { label: 'Languages', value: ['EN', 'RU', 'KA'] }, { label: 'Experience', value: ['6+ years'] }] } };
export const LongValues = { name: 'Long values', args: { items: [{ label: 'Specialization', value: ['Snowboard', 'Freeride'] }, { label: 'Meeting point', value: 'New Gudauri gondola' }, { label: 'Availability', value: 'Request confirmation' }] } };
export const MainTagComponent = { name: 'Main Tag', parameters: { composition: defineComposition({ root: 'MainTag' }) }, render: () => <dl><MainTag label="Difficulty" value={4} display="difficulty" /></dl> };
