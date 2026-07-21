import { ArticleNotice } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Editorial/Article Notice', component: ArticleNotice, parameters: { composition: defineComposition({ root: 'ArticleNotice' }) } };
export const Information = { args: { title: 'Local note', children: 'Lift and road status can change during heavy snowfall.' } };
export const Warning = { args: { title: 'Safety', tone: 'warning', children: 'Check official conditions before leaving marked terrain.' } };
