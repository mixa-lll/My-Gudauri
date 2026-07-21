import { RegisteredAdditionalSections } from '../blocks/detail/DetailBlocks';
import './CmsTemplates.scss';

function RequiredSlot({ name, children }) {
  if (children == null) throw new Error(`CMS template: required slot “${name}” is missing.`);
  return children;
}

export function CatalogPageTemplate({ navbar, hero, categoryTabs, filterToolbar, listingGrid, footer, promoArea, benefitsSection, bookingSteps, faqSection }) {
  return <div className="cms-template cms-template--catalog">
    <RequiredSlot name="SiteNavbar">{navbar}</RequiredSlot>
    <main><RequiredSlot name="CatalogHero">{hero}</RequiredSlot><RequiredSlot name="CategoryTabs">{categoryTabs}</RequiredSlot><RequiredSlot name="FilterToolbar">{filterToolbar}</RequiredSlot><RequiredSlot name="ListingGrid">{listingGrid}</RequiredSlot>{promoArea}{benefitsSection}{bookingSteps}{faqSection}</main>
    <RequiredSlot name="SiteFooter">{footer}</RequiredSlot>
  </div>;
}

export function ObjectDetailPageTemplate({ navbar, hero, primaryFacts, description, footer, additionalDetails, reviews, bookingSteps, relatedListings, bookingWidget, additionalSections = [] }) {
  return <div className="cms-template cms-template--detail">
    <RequiredSlot name="SiteNavbar">{navbar}</RequiredSlot>
    <main><RequiredSlot name="ObjectHero">{hero}</RequiredSlot><RequiredSlot name="PrimaryFacts">{primaryFacts}</RequiredSlot><div className="cms-template__detail-layout"><div className="cms-template__flow"><RequiredSlot name="DescriptionSection">{description}</RequiredSlot>{additionalDetails}<RegisteredAdditionalSections sections={additionalSections} />{reviews}{bookingSteps}{relatedListings}</div>{bookingWidget ? <aside>{bookingWidget}</aside> : null}</div></main>
    <RequiredSlot name="SiteFooter">{footer}</RequiredSlot>
  </div>;
}

export function EditorialArticleTemplate({ navbar, header, media, body, footer, tableOfContents, notices, sources, relatedArticles }) {
  return <div className="cms-template cms-template--editorial">
    <RequiredSlot name="SiteNavbar">{navbar}</RequiredSlot>
    <main><RequiredSlot name="ArticleHeader">{header}</RequiredSlot>{media}<div className="cms-template__article-layout">{tableOfContents ? <aside>{tableOfContents}</aside> : null}<div className="cms-template__article-flow">{notices}<RequiredSlot name="ArticleBody">{body}</RequiredSlot>{sources}</div></div>{relatedArticles}</main>
    <RequiredSlot name="SiteFooter">{footer}</RequiredSlot>
  </div>;
}

export const CMS_TEMPLATE_CONTRACTS = {
  catalog: {
    name: 'CatalogPageTemplate',
    required: ['SiteNavbar', 'CatalogHero', 'CategoryTabs', 'FilterToolbar', 'ListingGrid', 'SiteFooter'],
    optional: ['PromoArea', 'BenefitsSection', 'BookingSteps', 'FAQSection'],
    order: ['SiteNavbar', 'CatalogHero', 'CategoryTabs', 'FilterToolbar', 'ListingGrid', 'PromoArea?', 'BenefitsSection?', 'BookingSteps?', 'FAQSection?', 'SiteFooter'],
    dataSource: 'CMS catalog model + search/index API',
    allowedChildren: ['SiteNavbar', 'CatalogHero', 'CategoryTabs', 'FilterToolbar', 'ListingGrid', 'PromoArea', 'BenefitsSection', 'BookingSteps', 'FAQSection', 'SiteFooter'],
    contentLimits: 'Hero title ≤ 72 chars; description ≤ 180 chars; listing media uses registered aspect-ratio tokens.',
    responsive: 'Single-column flow below tablet; filters wrap and may open in a dialog; grid keeps a 280px minimum card width.',
    states: ['loading', 'empty', 'error', 'ready'],
    variants: ['instructors', 'activities', 'rental', 'transfer', 'editorial']
  },
  objectDetail: {
    name: 'ObjectDetailPageTemplate',
    required: ['SiteNavbar', 'ObjectHero', 'PrimaryFacts', 'DescriptionSection', 'SiteFooter'],
    optional: ['AdditionalDetails', 'ReviewsSection', 'BookingSteps', 'RelatedListings', 'StickyBookingWidget', 'additionalSections[]'],
    order: ['SiteNavbar', 'ObjectHero', 'PrimaryFacts', 'DescriptionSection', 'AdditionalDetails?', 'additionalSections[]?', 'ReviewsSection?', 'BookingSteps?', 'RelatedListings?', 'SiteFooter'],
    dataSource: 'CMS object model + availability/review services',
    allowedChildren: ['ObjectHero', 'PrimaryFacts', 'DescriptionSection', 'AdditionalDetails', 'ReviewsSection', 'DetailBookingSteps', 'RelatedListings', 'StickyBookingWidget', 'CertificationsSection', 'RouteProgram', 'IncludedServices', 'EquipmentList', 'SafetyRequirements'],
    contentLimits: 'Hero title ≤ 72 chars; lead ≤ 240 chars; galleries require descriptive alt text; arbitrary HTML blocks are rejected.',
    responsive: 'Hero and content/sidebar stack below tablet; booking widget becomes a bottom sticky action.',
    states: ['loading', 'not-found', 'error', 'ready', 'unavailable'],
    variants: ['instructor', 'activity', 'rental', 'transfer']
  },
  editorialArticle: {
    name: 'EditorialArticleTemplate',
    required: ['SiteNavbar', 'ArticleHeader', 'ArticleBody', 'SiteFooter'],
    optional: ['ArticleMedia', 'TableOfContents', 'ArticleNotice', 'Sources', 'RelatedArticles'],
    order: ['SiteNavbar', 'ArticleHeader', 'ArticleMedia?', 'TableOfContents?', 'ArticleNotice*', 'ArticleBody', 'Sources?', 'RelatedArticles?', 'SiteFooter'],
    dataSource: 'CMS editorial article model',
    allowedChildren: ['ArticleHeader', 'ArticleMedia', 'TableOfContents', 'ArticleNotice', 'ArticleBody', 'Sources', 'RelatedArticles'],
    contentLimits: 'Body is sanitized rich text; heading levels start at h2; captions ≤ 160 chars; media requires alt or explicit decorative marking.',
    responsive: 'Table of contents becomes an inline disclosure below tablet; body measure remains capped at the text-width token.',
    states: ['loading', 'not-found', 'error', 'ready'],
    variants: ['guide', 'news', 'story']
  }
};
