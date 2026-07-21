import { CMS_TEMPLATE_CONTRACTS, EditorialArticleTemplate } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { Contract, Slot } from './TemplateStoryParts';

export default {
  title: 'CMS Templates/Editorial Article Template',
  component: EditorialArticleTemplate,
  parameters: { fullscreen: true, controls: { disable: true }, composition: defineComposition({ root: 'EditorialArticleTemplate' }) },
};

export const Default = {
  render: () => (
    <>
      <Contract contract={CMS_TEMPLATE_CONTRACTS.editorialArticle} />
      <EditorialArticleTemplate
        navbar={<Slot name="SiteNavbar" />}
        header={<Slot name="ArticleHeader" />}
        media={<Slot name="ArticleMedia" optional />}
        tableOfContents={<Slot name="TableOfContents" optional />}
        body={<Slot name="ArticleBody" />}
        sources={<Slot name="Sources" optional />}
        relatedArticles={<Slot name="RelatedArticles" optional />}
        footer={<Slot name="SiteFooter" />}
      />
    </>
  ),
};
