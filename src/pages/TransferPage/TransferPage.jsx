import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  BackLink,
  BookingConfigurator,
  BookingSteps,
  FaqAccordion,
  ObjectDescription,
  ObjectDetailPageTemplate,
  ObjectHero,
  ObjectHeroGallery,
  ObjectMainTags,
  ObjectReviews,
  SegmentedControl,
  SiteFooter,
  SiteNavbar,
  TransferConditions,
  TransferObjectPattern,
  TransferRelatedOffers,
  VehicleTypeTag,
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

function factValue(facts, labels) {
  const match = facts.find((item) => labels.some((label) => String(item?.label ?? item?.[0] ?? '').toLowerCase().includes(label)));
  return match?.value ?? match?.[1];
}

export function TransferPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
        setRelated(all.filter((candidate) => candidate.slug !== slug));
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
  const gallery = useMemo(() => {
    const items = [
      transfer?.heroImage ? { src: transfer.heroImage, alt: transfer.heroImageAlt || transfer.name, featured: true } : null,
      ...(transfer?.vehicle?.media ?? transfer?.media ?? []),
    ].filter((item) => item?.src && item?.type !== 'video');
    const sources = new Set();
    return items.filter((item) => {
      if (sources.has(item.src)) return false;
      sources.add(item.src);
      return true;
    });
  }, [transfer]);

  if (status === 'loading') return <main className="transfer-data-state" aria-live="polite">{t('transfer.loading')}</main>;
  if (status === 'not-found') return <main className="transfer-data-state"><h1>{t('transfer.notFound')}</h1><Link to="/transfers">{t('transfer.backToList')}</Link></main>;
  if (status === 'error' || !transfer) return <main className="transfer-data-state"><h1>{t('transfer.unavailable')}</h1><p>{t('object.unavailableText')}</p></main>;

  const legacyEnds = journeyEnds(transfer.category, transfer.city, fromGudauri);
  const route = transfer.routeEntity ?? {
    origin: fromGudauri ? legacyEnds.finish : legacyEnds.start,
    destination: fromGudauri ? legacyEnds.start : legacyEnds.finish,
    duration: transfer.duration,
    zoneType: transfer.pickupType,
  };
  const direction = fromGudauri ? 'from-gudauri' : 'to-gudauri';
  const start = fromGudauri ? route.destination : route.origin;
  const finish = fromGudauri ? route.origin : route.destination;
  const routeLabel = `${start} → ${finish}`;
  const sourceFacts = (transfer.facts ?? []).map(factPair).filter((item) => item?.label && item?.value);
  const luggageValue = factValue(sourceFacts, ['bag', 'багаж', 'luggage']);
  const fallbackFacts = [
    transfer.seats ? { label: t('transfer.seats'), value: String(transfer.seats) } : null,
    luggageValue ? { label: t('transfer.luggage'), value: luggageValue } : null,
    route.distanceKm ? { label: t('transfer.distance'), value: `${route.distanceKm} ${t('transfer.km')}` } : null,
    route.duration ? { label: t('transfer.duration'), value: route.duration } : null,
  ].filter(Boolean);
  const facts = (fallbackFacts.length >= 3 ? fallbackFacts : sourceFacts).slice(0, 3).map((item) => ({
    label: item.label,
    value: String(item.value).split(/\s*·\s*/).filter(Boolean),
  }));
  const vehicle = transfer.vehicle ?? {
    name: transfer.name,
    className: transfer.vehicleClass,
    seats: transfer.seats,
    luggage: { large: luggageValue },
    skiCapacity: luggageValue,
    options: transfer.tags,
    media: transfer.media,
    isExact: false,
  };
  const sameVehicle = related.filter((item) => {
    if (transfer.vehicle?.id && item.vehicle?.id) return item.vehicle.id === transfer.vehicle.id && item.routeEntity?.id !== transfer.routeEntity?.id;
    return item.vehicleClass === transfer.vehicleClass && item.seats === transfer.seats && item.category !== transfer.category;
  }).slice(0, 3);
  const sameRoute = related.filter((item) => {
    if (transfer.routeEntity?.id && item.routeEntity?.id) return item.routeEntity.id === transfer.routeEntity.id && item.vehicle?.id !== transfer.vehicle?.id;
    return item.category === transfer.category && (item.vehicleClass !== transfer.vehicleClass || item.seats !== transfer.seats);
  }).slice(0, 3);
  const relatedDirection = (item) => ({ ...item, direction });
  const bookingDefinition = localizeBookingDefinition(getBookingFlowDefinition('transfers'), t);
  // A ?pickup=airport link — from a campaign or a saved search — opens this same
  // offer with the kind of meeting point already chosen, so the airport never has
  // to become a second product.
  const pickupPoints = route.pickupPoints ?? [];
  const requestedPickup = searchParams.get('pickup');
  const presetPoint = pickupPoints.find((point) => point.kind === requestedPickup)
    ?? pickupPoints.find((point) => point.isDefault)
    ?? pickupPoints[0]
    ?? null;
  const bookingOffer = createBookingOffer({
    definition: bookingDefinition,
    object: { id: `transfer:${transfer.id ?? transfer.slug}`, slug: transfer.slug, name: transfer.name, typeLabel: routeLabel, image: transfer.image },
    basePrice: transfer.priceAmount,
    currency: transfer.currency,
    availability: t('object.requestAvailability'),
    route,
    extras: transfer.extras ?? [],
  });
  const startBooking = (answers) => {
    saveBookingDraft(createBookingDraft({
      definition: bookingDefinition,
      offer: bookingOffer,
      answers: {
        direction: fromGudauri ? 'From Gudauri' : 'To Gudauri',
        ...answers,
        // A ?pickup=airport link preselects the kind of place the guest starts
        // from; the detail fields for it stay optional in step two.
        ...(presetPoint ? { [fromGudauri ? 'toKind' : 'fromKind']: presetPoint.kind } : {}),
      },
    }));
    navigate(`/booking/transfers/${transfer.slug}`);
  };
  // The hero answers the three questions a transfer page opens with — which car,
  // which way, and what it costs — before any scrolling. Direction is a control
  // here rather than a URL the guest has to guess at.
  const bodyTypeLabel = transfer.vehicle?.bodyType ? t(`catalog.transfers.vehicleTypes.${transfer.vehicle.bodyType}`) : null;
  // The heading names the actual car; its class and capacity sit under it.
  const modelName = [transfer.vehicle?.make, transfer.vehicle?.model].filter(Boolean).join(' ') || vehicle.name || transfer.name;
  const journeyNote = [
    route.zoneType,
    route.distanceKm ? `≈${route.distanceKm} ${t('transfer.km')}` : null,
    route.duration,
  ].filter(Boolean).join(' · ');
  const setDirection = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'from-gudauri') params.set('direction', 'from-gudauri');
    else params.delete('direction');
    setSearchParams(params, { replace: true });
  };
  const hero = <ObjectHero
    variant="split"
    mediaVariant="gallery"
    breadcrumbs={<BackLink to="/transfers">{t('transfer.backToList')}</BackLink>}
    badges={[
      // The route is the one thing worth stating above the name, and it reads
      // both ways because the price and the car are the same either direction.
      <span className="transfer-hero-route" key="route">{route.origin}<i aria-hidden="true">↔</i>{route.destination}</span>,
    ]}
    title={<>
      {modelName}
      <small className="transfer-hero-spec">
        {bodyTypeLabel ? <VehicleTypeTag type={transfer.vehicle.bodyType} label={bodyTypeLabel} /> : null}
        {transfer.seats ? <b>{t('transfer.upToSeats', { count: transfer.seats })}</b> : null}
      </small>
    </>}
    description={transfer.description}
    rating={transfer.rating ? { value: transfer.rating, reviewsLabel: transfer.reviews, href: '#reviews' } : undefined}
    details={<div className="transfer-hero-controls">
      {journeyNote ? <p className="transfer-hero-controls__note">{journeyNote}</p> : null}
      {route.bidirectional === false ? null : <SegmentedControl
        label={t('transfer.directionLabel')}
        options={[
          { value: 'to-gudauri', label: t('transfer.toAnchor', { place: route.destination }) },
          { value: 'from-gudauri', label: t('transfer.fromAnchor', { place: route.destination }) },
        ]}
        value={direction}
        onChange={setDirection}
      />}
    </div>}
    media={<ObjectHeroGallery
      showPreviews={false}
      images={gallery}
      objectName={vehicle.name || transfer.name}
      objectLabel={t('transfer.galleryLabel')}
      openLabel={t('object.openGallery')}
      photosLabel={t('object.photos')}
      placeholderKind="transfer"
    />}
  />;
  const content = <TransferObjectPattern
    mainTags={<ObjectMainTags items={facts} />}
    objectDescription={<ObjectDescription kicker={t('transfer.aboutKicker')} title={t('object.aboutTitle')} tags={transfer.tags} tagsLabel={t('object.tagsLabel')}><p>{transfer.description}</p></ObjectDescription>}
    additionalSections={[
      {
        type: 'transferVehicle',
        kicker: t('transfer.vehicleKicker'),
        title: t('transfer.vehicleTitle'),
        description: t('transfer.vehicleDescription'),
        vehicle,
        labels: {
          classLabel: t('transfer.vehicleClass'), seats: t('transfer.seats'), largeBags: t('transfer.largeBags'),
          carryOn: t('transfer.carryOn'), skis: t('transfer.skis'), gallery: t('transfer.galleryLabel'),
          model: t('transfer.makeModel'), options: t('transfer.options'), analogueNotice: t('transfer.analogueNotice'),
        },
      },
      {
        type: 'transferRoute',
        kicker: t('transfer.routeKicker'),
        title: routeLabel,
        description: route.duration ? t('transfer.routeDescription', { duration: route.duration }) : t('transfer.routeDescriptionFallback'),
        route,
        direction,
        labels: {
          map: t('transfer.mapLabel', { route: routeLabel }), openMap: t('transfer.openMap'), direction: t('transfer.directionLabel'),
          from: t('transfer.startLabel'), to: t('transfer.finishLabel'), distance: t('transfer.distance'), duration: t('transfer.duration'),
          zone: t('transfer.zone'), addressNotice: t('transfer.addressNotice'),
        },
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
      {
        type: 'transferConditions',
        kicker: t('transfer.conditionsKicker'),
        title: t('transfer.conditionsTitle'),
        description: t('transfer.conditionsDescription'),
        items: transfer.conditions?.length ? transfer.conditions : tList('transfer.defaultConditions'),
      },
    ]}
    reviews={<ObjectReviews kicker={t('transfer.reviewsKicker')} title={t('transfer.reviewsTitle')} description={t('transfer.reviewsDescription', { vehicle: vehicle.name || transfer.name })} rating={transfer.rating ? { value: transfer.rating, label: transfer.reviews } : undefined} reviews={reviews} />}
    bookingSteps={<BookingSteps context="object" items={tList('transfer.bookingSteps')} />}
    faqSection={<FaqAccordion variant="object" items={tList('catalog.transfers.faq')} />}
    relatedListings={<TransferRelatedOffers
      sameVehicle={sameVehicle.map(relatedDirection)}
      sameRoute={sameRoute.map(relatedDirection)}
      sameVehicleTitle={t('transfer.sameVehicleTitle')}
      sameVehicleDescription={t('transfer.sameVehicleDescription')}
      sameRouteTitle={t('transfer.sameRouteTitle')}
      sameRouteDescription={t('transfer.sameRouteDescription')}
    />}
    bookingWidget={<BookingConfigurator
      key={direction}
      title={bookingDefinition.title}
      priceLabel={bookingDefinition.priceLabel}
      object={bookingOffer.object}
      fields={resolveEntryFields(bookingDefinition, bookingOffer)}
      basePrice={bookingOffer.basePrice}
      availability={bookingOffer.availability}
      entryNote={bookingDefinition.entryNote}
      confirmationText={bookingDefinition.confirmationText}
      defaultValues={{ passengers: 2, direction: fromGudauri ? 'From Gudauri' : 'To Gudauri', luggage: 'Standard' }}
      estimate={(answers) => estimateBookingPrice(bookingDefinition, bookingOffer, answers)}
      actionLabel={t('object.continueRequest')}
      onContinue={startBooking}
    />}
  />;

  return <div className="transfer-detail"><ObjectDetailPageTemplate navbar={<SiteNavbar />} hero={hero} content={content} footer={<SiteFooter />} /></div>;
}
