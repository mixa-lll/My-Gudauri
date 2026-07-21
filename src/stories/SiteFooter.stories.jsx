import { SiteFooter } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default { title: 'Blocks/Global/Site Footer', component: SiteFooter, parameters: { fullscreen: true, composition: defineComposition({ root: 'SiteFooter' }) } };
export const Desktop = { render: () => <SiteFooter /> };
export const Mobile = { globals: { viewport: { value: 'mobile1', isRotated: false } }, render: () => <SiteFooter /> };
