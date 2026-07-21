import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ActivityObjectPattern,
  BackLink,
  BookingWidget,
  DescriptionSection,
  FaqAccordion,
  MediaPlaceholder,
  ObjectDetailPageTemplate,
  ObjectHero,
  PrimaryFacts,
  RelatedListings,
  RentalObjectPattern,
  SecondaryTags,
  SiteFooter,
  SiteNavbar,
  StayObjectPattern,
  TransferObjectPattern,
} from '../../design-system';
import { getDestination, getDestinationItem } from '../../data/destinations';
import './DestinationDetailPage.scss';

const OBJECT_PATTERNS = { rental: RentalObjectPattern, transfers: TransferObjectPattern, stays: StayObjectPattern };
const CARD_TYPES = { rental: 'rental', transfers: 'transfer', stays: 'stay' };
const BOOKING_CATEGORIES = { rental: 'rental', transfers: 'transfer', stays: 'stay' };

export function DestinationDetailPage() {
  const { section, slug } = useParams();
  const config = getDestination(section);
  const item = getDestinationItem(section, slug);

  useEffect(() => {
    document.body.classList.add('destination-detail-body');
    if (item) document.title = `${item.name} — My Gudauri`;
    return () => document.body.classList.remove('destination-detail-body');
  }, [item]);

  if (!config || !item) return <main className="destination-detail-state"><h1>Page not found</h1><Link to={config ? `/${section}` : '/'}>Back to catalogue</Link></main>;

  const Pattern = OBJECT_PATTERNS[section] ?? ActivityObjectPattern;
  const cardType = CARD_TYPES[section] ?? 'activity';
  const bookingCategory = BOOKING_CATEGORIES[section] ?? 'activity';
  const numericPrice = Number.parseFloat(String(item.price).replace(/[^0-9.,]/g, '').replace(',', '.')) || undefined;
  const related = config.items.filter((candidate) => candidate.slug !== item.slug).slice(0, 3).map((candidate) => ({ ...candidate, title: candidate.name }));

  const hero = <ObjectHero
    variant="centered"
    breadcrumbs={<BackLink to={`/${section}`}>Back to {config.navTitle.toLowerCase()}</BackLink>}
    badges={[item.category, config.navTitle]}
    title={item.name}
    description={item.description}
    media={item.image ? <img src={item.image} alt={`${item.name} in Gudauri`} /> : <MediaPlaceholder label={item.name} />}
  />;

  const content = <Pattern
    primaryFacts={<PrimaryFacts items={item.facts.map(([label, value]) => ({ label, value }))} />}
    description={<DescriptionSection kicker="About the offer" title="What to expect"><p>{item.description}</p></DescriptionSection>}
    secondaryTags={<SecondaryTags kicker="At a glance" title="Useful details" items={item.tags} />}
    additionalSections={[{ type: 'includedServices', kicker: 'Included essentials', title: 'What is included', items: item.included }]}
    relatedListings={<RelatedListings cardType={cardType} items={related} />}
    faqSection={<FaqAccordion items={config.faq} title="Common questions" kicker="Good to know" />}
    bookingWidget={<BookingWidget category={bookingCategory} price={numericPrice} availability="Request availability" />}
  />;

  return <div className={`destination-detail destination-page--${config.accent}`}><ObjectDetailPageTemplate navbar={<SiteNavbar className="destination-nav-host" />} hero={hero} content={content} footer={<SiteFooter />} /></div>;
}
