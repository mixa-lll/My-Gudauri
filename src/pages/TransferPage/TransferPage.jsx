import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  BackLink,
  BookingConfigurator,
  BookingSteps,
  FaqAccordion,
  MediaPlaceholder,
  ObjectDescription,
  ObjectDetailPageTemplate,
  ObjectHero,
  ObjectMainTags,
  ObjectRelatedListings,
  ObjectReviews,
  SiteFooter,
  SiteNavbar,
  TransferObjectPattern,
} from '../../design-system';
import { createBookingDraft, createBookingOffer, estimateBookingPrice, getBookingFlowDefinition, localizeBookingDefinition, resolveEntryFields, saveBookingDraft } from '../../features/booking';
import { useLanguage } from '../../i18n/LanguageContext';
import { getTransfer, getTransfers } from '../../services/transfersApi';
import './TransferPage.scss';

function factPair(item) {
  if (Array.isArray(item)) return { label: item[0], value: item[1] };
  return item;
}

function journeyEnds(route, city, fromGudauri) {
  const parts = String(route ?? '').split(/\s*↔\s*/).filter(Boolean);
  const [anchor, otherEnd] = parts.length > 1 ? parts : ['Gudauri', city || parts[0] || 'Gudauri'];
  return fromGudauri ? { start: anchor, finish: otherEnd } : { start: otherEnd, finish: anchor };
}

function reviewDateLabel(value, language) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(date);
}

export function TransferPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t, tList } = useLanguage();
  const [transfer, setTransfer] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading');
  const fromGudauri = searchParams.get('direction') === 'from-gudauri';

  useEffect(() => {
    let active = true;
    setStatus('loading');
    Promise.all([getTransfer(slug), getTransfers().catch(() => [])])
      .then(([item, all]) => {
        if (!active) return;
        setTransfer(item);
        setRelated(all.filter((candidate) => candidate.slug !== slug).slice(0, 3));
        setStatus(item ? 'ready' : 'not-found');
      })
      .catch(() => active && setStatus('error'));
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    document.body.classList.add('transfer-detail-body');
    if (transfer) document.title = `${transfer.name} — My Gudauri`;
    return () => document.body.classList.remove('transfer-detail-body');
  }, [transfer]);

  const reviews = useMemo(() => (transfer?.reviewsList ?? []).map((review, index) => ({
    id: `${review.author}-${index}`,
    author: review.author,
    text: review.body,
    dateLabel: reviewDateLabel(review.date, language),
    contextLabel: review.context,
    rating: review.rating,
    avatar: review.avatar || undefined,
  })), [language, transfer]);

  if (status === 'loading') return <main className="transfer-data-state" aria-live="polite">{t('transfer.loading')}</main>;
  if (status === 'not-found') return <main className="transfer-data-state"><h1>{t('transfer.notFound')}</h1><Link to="/transfers">{t('transfer.backToList')}</Link></main>;
  if (status === 'error' || !transfer) return <main className="transfer-data-state"><h1>{t('transfer.unavailable')}</h1><p>{t('object.unavailableText')}</p></main>;

  const { start, finish } = journeyEnds(transfer.category, transfer.city, fromGudauri);
  const routeLabel = `${start} → ${finish}`;
  const sourceFacts = (transfer.facts ?? []).map(factPair).filter((item) => item?.label && item?.value);
  const fallbackFacts = [
    transfer.vehicleClass ? { label: t('transfer.vehicle'), value: transfer.vehicleClass } : null,
    transfer.seats ? { label: t('transfer.seats'), value: String(transfer.seats) } : null,
    transfer.duration ? { label: t('transfer.duration'), value: transfer.duration } : null,
  ].filter(Boolean);
  const facts = (sourceFacts.length ? sourceFacts : fallbackFacts).slice(0, 3).map((item) => ({
    label: item.label,
    value: String(item.value).split(/\s*·\s*/).filter(Boolean),
  }));
  const bookingDefinition = localizeBookingDefinition(getBookingFlowDefinition('transfers'), t);
  const bookingOffer = createBookingOffer({
    definition: bookingDefinition,
    object: { id: `transfer:${transfer.id ?? transfer.slug}`, slug: transfer.slug, name: transfer.name, typeLabel: routeLabel, image: transfer.image },
    basePrice: transfer.priceAmount,
    currency: transfer.currency,
    availability: t('object.requestAvailability'),
  });
  const startBooking = (answers) => {
    saveBookingDraft(createBookingDraft({ definition: bookingDefinition, offer: bookingOffer, answers: { ...answers, direction: fromGudauri ? 'from-gudauri' : 'to-gudauri', route: routeLabel } }));
    navigate(`/booking/transfers/${transfer.slug}`);
  };
  const heroMedia = transfer.heroImage
    ? <img className="transfer-object-media" src={transfer.heroImage} alt={transfer.heroImageAlt || transfer.name} loading="eager" />
    : <MediaPlaceholder label={transfer.name} kind="transfer" />;
  const hero = <ObjectHero
    variant="centered"
    breadcrumbs={<BackLink to="/transfers">{t('transfer.backToList')}</BackLink>}
    badges={[routeLabel]}
    title={transfer.name}
    description={transfer.description}
    rating={transfer.rating ? { value: transfer.rating, reviewsLabel: transfer.reviews, href: '#reviews' } : undefined}
    media={heroMedia}
  />;
  const content = <TransferObjectPattern
    mainTags={<ObjectMainTags items={facts} />}
    objectDescription={<ObjectDescription kicker={t('transfer.aboutKicker')} title={t('object.aboutTitle')} tags={transfer.tags} tagsLabel={t('object.tagsLabel')}><p>{transfer.description}</p></ObjectDescription>}
    additionalSections={[
      {
        type: 'routeMap',
        kicker: t('transfer.routeKicker'),
        title: routeLabel,
        description: transfer.duration ? t('transfer.routeDescription', { duration: transfer.duration }) : t('transfer.routeDescriptionFallback'),
        start,
        finish,
        startLabel: t('transfer.startLabel'),
        finishLabel: t('transfer.finishLabel'),
        confirmationLabel: t('transfer.confirmationLabel'),
      },
      ...(transfer.included?.length ? [{
        type: 'includedServices',
        kicker: t('transfer.includedKicker'),
        title: t('transfer.includedTitle'),
        includedItems: transfer.included,
        excludedItems: [],
        includedLabel: t('transfer.includedLabel'),
        excludedLabel: t('transfer.excludedLabel'),
        emptyExcludedLabel: t('transfer.noExclusions'),
      }] : []),
    ]}
    reviews={<ObjectReviews kicker={t('transfer.reviewsKicker')} title={t('transfer.reviewsTitle')} rating={transfer.rating ? { value: transfer.rating, label: transfer.reviews } : undefined} reviews={reviews} />}
    bookingSteps={<BookingSteps context="object" items={tList('transfer.bookingSteps')} />}
    faqSection={<FaqAccordion variant="object" items={tList('catalog.transfers.faq')} />}
    relatedListings={<ObjectRelatedListings cardType="transfer" title={t('transfer.related')} items={related.map((item) => ({ ...item, direction: fromGudauri ? 'from-gudauri' : 'to-gudauri' }))} />}
    bookingWidget={<BookingConfigurator
      title={bookingDefinition.title}
      priceLabel={bookingDefinition.priceLabel}
      object={bookingOffer.object}
      fields={resolveEntryFields(bookingDefinition, bookingOffer)}
      basePrice={bookingOffer.basePrice}
      availability={bookingOffer.availability}
      entryNote={bookingDefinition.entryNote}
      confirmationText={bookingDefinition.confirmationText}
      defaultValues={{ passengers: 2, pickup: start }}
      estimate={(answers) => estimateBookingPrice(bookingDefinition, bookingOffer, answers)}
      actionLabel={t('object.continueRequest')}
      onContinue={startBooking}
    />}
  />;

  return <div className="transfer-detail"><ObjectDetailPageTemplate navbar={<SiteNavbar />} hero={hero} content={content} footer={<SiteFooter />} /></div>;
}
