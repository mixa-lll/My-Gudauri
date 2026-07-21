import { ArticleMedia } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Editorial/Article Media', component: ArticleMedia, parameters: { composition: defineComposition({ root: 'ArticleMedia' }) } };
export const Default = { args: { alt: 'Snowy Gudauri ridge', caption: 'Visibility changes quickly above the treeline.', credit: 'My Gudauri archive' } };
export const Portrait = { args: { alt: 'Mountain guide portrait', aspect: 'portrait', caption: 'Portrait media keeps a controlled reading width.' } };
