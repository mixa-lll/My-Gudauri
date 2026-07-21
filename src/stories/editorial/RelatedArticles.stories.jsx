import { RelatedArticles } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Editorial/Related Articles', component: RelatedArticles, parameters: { composition: defineComposition({ root: 'RelatedArticles' }) } };
export const Default = { args: { items: [{ slug: 'snow-road', title: 'The winter road guide', category: 'Planning', readingTime: '6 min', excerpt: 'What to check before the drive.' }] } };
