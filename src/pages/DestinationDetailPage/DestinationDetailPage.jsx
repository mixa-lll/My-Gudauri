import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActivityObjectPattern,
  BackLink,
  BookingSteps,
  BookingConfigurator,
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
import { createBookingDraft, createBookingOffer, estimateBookingTotal, getBookingFlowDefinition, localizeBookingDefinition, resolveEntryFields, saveBookingDraft } from '../../features/booking';
import { getDestination, getDestinationItem } from '../../data/destinations';
import { useLanguage } from '../../i18n/LanguageContext';
import './DestinationDetailPage.scss';

const OBJECT_PATTERNS = { rental: RentalObjectPattern, transfers: TransferObjectPattern, stays: StayObjectPattern };
const CARD_TYPES = { rental: 'rental', transfers: 'transfer', stays: 'stay' };
const PLACEHOLDER_KINDS = { activities: 'activity', rental: 'rental', transfers: 'transfer', stays: 'stay', services: 'service', places: 'place' };
const OMITTED_SUMMARY_LABELS = {
  activities: ['season', 'video', 'runs', 'terrain', 'meals'],
  rental: ['service', 'stance', 'check', 'care', 'helmet'],
  transfers: ['class', 'vehicle'],
  stays: ['size', 'breakfast', 'workspace'],
  services: ['delivery', 'format', 'check', 'setup', 'style', 'duration'],
  places: ['spend', 'booking', 'children', 'wi-fi', 'atm', 'season'],
};

function summaryFacts(section, facts) {
  const priorities = OMITTED_SUMMARY_LABELS[section] ?? [];
  const omittedLabel = priorities.find((label) => facts.some(([itemLabel]) => itemLabel.toLowerCase() === label));
  const selected = omittedLabel ? facts.filter(([label]) => label.toLowerCase() !== omittedLabel) : facts.slice(0, -1);
  return selected.slice(0, 3).map(([label, value]) => ({ label, value: String(value).split(/\s*·\s*/).filter(Boolean) }));
}

export function DestinationDetailPage() {
  const { section, slug } = useParams();
  const navigate = useNavigate();
  const { t, tList } = useLanguage();
  const config = getDestination(section);
  const item = getDestinationItem(section, slug);

  useEffect(() => {
    document.body.classList.add('destination-detail-body');
    if (item) document.title = `${item.name} — My Gudauri`;
    return () => document.body.classList.remove('destination-detail-body');
  }, [item]);

  if (!config || !item) return <main className="destination-detail-state"><h1>{t('object.notFound')}</h1><Link to={config ? `/${section}` : '/'}>{t('object.backToCatalogue')}</Link></main>;

  const Pattern = OBJECT_PATTERNS[section] ?? ActivityObjectPattern;
  const cardType = CARD_TYPES[section] ?? 'activity';
  const numericPrice = Number.parseFloat(String(item.price).replace(/[^0-9.,]/g, '').replace(',', '.')) || undefined;
  const bookingDefinition = localizeBookingDefinition(getBookingFlowDefinition(section), t);
  const bookingOffer = createBookingOffer({
    definition: bookingDefinition,
    object: { id: `${section}:${item.slug}`, slug: item.slug, name: item.name, typeLabel: item.category, image: item.image },
    basePrice: numericPrice,
    availability: t('object.requestAvailability'),
  });
  const startBooking = (answers) => {
    saveBookingDraft(createBookingDraft({ definition: bookingDefinition, offer: bookingOffer, answers }));
    navigate(`/booking/${bookingDefinition.category}/${item.slug}`);
  };
  const related = config.items.filter((candidate) => candidate.slug !== item.slug).slice(0, 3).map((candidate) => ({ ...candidate, title: candidate.name }));

  const facts = summaryFacts(section, item.facts);
  const hero = <ObjectHero
    variant="centered"
    breadcrumbs={<BackLink to={`/${section}`}>{t('object.backTo', { section: t(`categories.${section}.title`).toLowerCase() })}</BackLink>}
    badges={[item.category]}
    title={item.name}
    description={item.description}
    rating={{ value: item.rating, reviewsLabel: item.reviews, href: '#reviews' }}
    media={item.image ? <img src={item.image} alt={t('object.mediaAlt', { name: item.name })} /> : <MediaPlaceholder label={item.name} kind={PLACEHOLDER_KINDS[section] ?? 'generic'} />}
  />;

  const content = <Pattern
    mainTags={<ObjectMainTags items={facts} />}
    objectDescription={<ObjectDescription kicker={t('object.aboutKicker')} title={t('object.aboutTitle')} tags={item.tags} tagsLabel={t('object.tagsLabel')}><p>{item.description}</p></ObjectDescription>}
    additionalSections={[{ type: 'includedServices', kicker: t('object.includedKicker'), title: t('object.includedTitle'), items: item.included }]}
    reviews={<ObjectReviews rating={{ value: item.rating, label: item.reviews }} reviews={[]} />}
    bookingSteps={<BookingSteps context="object" items={tList('object.bookingSteps')} />}
    relatedListings={<ObjectRelatedListings cardType={cardType} items={related} />}
    faqSection={<FaqAccordion variant="object" items={tList(`catalog.${section}.faq`)} />}
    bookingWidget={<BookingConfigurator
      title={bookingDefinition.title}
      priceLabel={bookingDefinition.priceLabel}
      object={bookingOffer.object}
      fields={resolveEntryFields(bookingDefinition, bookingOffer)}
      basePrice={bookingOffer.basePrice}
      availability={bookingOffer.availability}
      entryNote={bookingDefinition.entryNote}
      confirmationText={bookingDefinition.confirmationText}
      estimate={(answers) => estimateBookingTotal(bookingDefinition, bookingOffer, answers)}
      actionLabel={t('object.continueRequest')}
      onContinue={startBooking}
    />}
  />;

  return <div className={`destination-detail destination-page--${config.accent}`}><ObjectDetailPageTemplate navbar={<SiteNavbar className="destination-nav-host" />} hero={hero} content={content} footer={<SiteFooter />} /></div>;
}
