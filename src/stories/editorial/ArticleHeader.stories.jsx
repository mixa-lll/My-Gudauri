import { ArticleHeader } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Editorial/Article Header', component: ArticleHeader, parameters: { composition: defineComposition({ root: 'ArticleHeader' }) } };
export const Default = { args: { backLink: { to: '/articles', children: 'All guides' }, category: 'Planning', title: 'Your first week in Gudauri', dek: 'A practical, locally reviewed guide to transport, weather and time on the mountain.', author: 'My Gudauri editorial', publishedAt: '12 January 2026', readingTime: '8 min' } };
export const LongTitle = { args: { backLink: { to: '/articles', children: 'All guides' }, category: 'First time', title: 'Your first week in Gudauri, planned simply', dek: 'Where to stay, when to ski and what to book before you arrive.', publishedAt: 'Reviewed July 2026', readingTime: '8 min read' } };
