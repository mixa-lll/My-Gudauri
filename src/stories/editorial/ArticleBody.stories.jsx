import { ArticleBody } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Editorial/Article Body', component: ArticleBody, parameters: { composition: defineComposition({ root: 'ArticleBody' }) } };
export const Default = { args: { children: <><h2 id="arrival">Arrival</h2><p>Build extra time into a winter road journey and check official road updates.</p><h2 id="weather">Weather</h2><p>Use layers and carry eye protection for rapidly changing visibility.</p></> } };
