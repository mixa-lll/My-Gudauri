import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ActivityObjectPattern,
  BackLink,
  BookingSteps,
  BookingWidget,
  ObjectDescription,
  ObjectMainTags,
  ObjectRelatedListings,
  ObjectReviews,
  FaqAccordion,
  MediaPlaceholder,
  ObjectDetailPageTemplate,
  ObjectHero,
  RentalObjectPattern,
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
const BOOKING_STEPS = [
  { title: 'Send your request', description: 'Choose the date, group details and the format that suits you.' },
  { title: 'We check the details', description: 'A local manager confirms availability and the final price.' },
  { title: 'Receive confirmation', description: 'Get the meeting details and a secure payment link.' },
];

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

  const facts = item.facts.map(([label, value]) => ({ label, value: String(value).split(/\s*·\s*/).filter(Boolean) }));
  const hero = <ObjectHero
    variant="centered"
    breadcrumbs={<BackLink to={`/${section}`}>Back to {config.navTitle.toLowerCase()}</BackLink>}
    badges={[item.category]}
    title={item.name}
    description={item.description}
    rating={{ value: item.rating, reviewsLabel: item.reviews, href: '#reviews' }}
    media={item.image ? <img src={item.image} alt={`${item.name} in Gudauri`} /> : <MediaPlaceholder label={item.name} />}
  />;

  const content = <Pattern
    mainTags={<ObjectMainTags items={facts} />}
    objectDescription={<ObjectDescription kicker="About the offer" title="What to expect" tags={item.tags} tagsLabel="Useful details"><p>{item.description}</p></ObjectDescription>}
    additionalSections={[{ type: 'includedServices', kicker: 'Included essentials', title: 'What is included', items: item.included }]}
    reviews={<ObjectReviews rating={{ value: item.rating, label: item.reviews }} reviews={[]} />}
    bookingSteps={<BookingSteps context="object" items={BOOKING_STEPS} />}
    relatedListings={<ObjectRelatedListings cardType={cardType} items={related} />}
    faqSection={<FaqAccordion items={config.faq} title="Common questions" kicker="Good to know" />}
    bookingWidget={<BookingWidget category={bookingCategory} price={numericPrice} availability="Request availability" />}
  />;

  return <div className={`destination-detail destination-page--${config.accent}`}><ObjectDetailPageTemplate navbar={<SiteNavbar className="destination-nav-host" />} hero={hero} content={content} footer={<SiteFooter />} /></div>;
}
