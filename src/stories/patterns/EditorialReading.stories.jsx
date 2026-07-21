import { ArticleBody, ArticleHeader, EditorialReading, TableOfContents } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default {
  title: 'Patterns/Editorial Reading',
  component: EditorialReading,
  parameters: { controls: { disable: true }, composition: defineComposition({ root: 'EditorialReading' }) },
};

export const Default = {
  render: () => (
    <EditorialReading
      header={<ArticleHeader category="Guide" title="Reading pattern" dek="Header, navigation, body and onward journeys form one task pattern." />}
      tableOfContents={<TableOfContents items={[{ id: 'section', label: 'Section' }]} />}
      body={<ArticleBody><h2 id="section">Section</h2><p>A readable article body with stable heading anchors.</p></ArticleBody>}
    />
  ),
};
