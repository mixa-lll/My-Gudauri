import { EquipmentList, IncludedServices, RouteProgram, SafetyRequirements } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Category Sections', tags: ['autodocs'], parameters: { controls: { disable: true } } };
export const Route = { name: 'Route Program', parameters: { composition: defineComposition({ root: 'RouteProgram' }) }, render: () => <RouteProgram items={[{ title: '10:00 · Meeting', description: 'Equipment and conditions check.' }, { title: '10:30 · Route', description: 'Progressive terrain selection.' }]} /> };
export const Included = { name: 'Included Services', parameters: { composition: defineComposition({ root: 'IncludedServices' }) }, render: () => <IncludedServices items={['Equipment check', 'Route briefing']} /> };
export const Equipment = { name: 'Equipment List', parameters: { composition: defineComposition({ root: 'EquipmentList' }) }, render: () => <EquipmentList items={['Helmet', 'Goggles', 'Weatherproof layers']} /> };
export const Safety = { name: 'Safety Requirements', parameters: { composition: defineComposition({ root: 'SafetyRequirements' }) }, render: () => <SafetyRequirements notice="Weather can change quickly." items={['Helmet required', 'Follow guide instructions']} /> };
