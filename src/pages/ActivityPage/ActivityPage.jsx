import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActivityObjectPattern,
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
  ObjectMediaGallery,
  SiteFooter,
  SiteNavbar,
} from '../../design-system';
import { createBookingDraft, createBookingOffer, estimateBookingPrice, getBookingFlowDefinition, localizeBookingDefinition, resolveEntryFields, saveBookingDraft } from '../../features/booking';
import { getDestination } from '../../data/destinations';
import { useLanguage } from '../../i18n/LanguageContext';
import { getActivities, getActivity } from '../../services/activitiesApi';
import './ActivityPage.scss';

const REVIEW_DATE_FORMATTER = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });

function reviewDateLabel(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : REVIEW_DATE_FORMATTER.format(date);
}

export function ActivityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const galleryTriggerRef = useRef(null);
  const category = getDestination('activities');
  const { t, tList } = useLanguage();

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setGalleryIndex(0);
    setIsGalleryOpen(false);
    Promise.all([getActivity(slug), getActivities().catch(() => [])])
      .then(([item, all]) => {
        if (!active) return;
        setActivity(item);
        setRelated(all.filter((candidate) => candidate.slug !== slug).slice(0, 3));
        setStatus(item ? 'ready' : 'not-found');
      })
      .catch(() => active && setStatus('error'));
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    document.body.classList.add('activity-detail-body');
    if (activity) document.title = `${activity.name} — My Gudauri`;
    return () => document.body.classList.remove('activity-detail-body');
  }, [activity]);

  const gallery = useMemo(() => (activity?.media ?? []).filter((item) => item.type !== 'video'), [activity]);
  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    requestAnimationFrame(() => galleryTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  if (status === 'loading') return <main className="activity-data-state">Loading activity…</main>;
  if (status === 'not-found') return <main className="activity-data-state"><h1>{t('activity.notFound')}</h1><Link to="/activities">{t('activity.backToList')}</Link></main>;
  if (status === 'error' || !activity) return <main className="activity-data-state"><h1>{t('activity.unavailable')}</h1><p>{t('object.unavailableText')}</p></main>;

  const facts = activity.facts
    .filter((item) => item.label.toLowerCase() !== 'elevation change')
    .slice(0, 3)
    .map((item) => ({
      label: item.label,
      value: String(item.value).split(/\s*·\s*/).filter(Boolean),
      display: item.label.toLowerCase() === 'difficulty' ? 'difficulty' : 'value',
    }));
  const reviews = (activity.reviewsList ?? []).map((review, index) => ({
    id: `${review.author}-${index}`,
    author: review.author,
    text: review.body,
    dateLabel: reviewDateLabel(review.date),
    contextLabel: review.context,
    rating: review.rating,
    avatar: review.avatar || undefined,
  }));
  const bookingDefinition = localizeBookingDefinition(getBookingFlowDefinition('activities'), t);
  const bookingOffer = createBookingOffer({
    definition: bookingDefinition,
    object: { id: `activity:${activity.id ?? activity.slug}`, slug: activity.slug, name: activity.name, typeLabel: activity.category, image: activity.image },
    basePrice: activity.priceAmount,
    currency: activity.currency,
    availability: t('object.requestAvailability'),
  });
  const startBooking = (answers) => {
    saveBookingDraft(createBookingDraft({ definition: bookingDefinition, offer: bookingOffer, answers }));
    navigate(`/booking/activities/${activity.slug}`);
  };
  const openGallery = () => {
    galleryTriggerRef.current = document.activeElement;
    setGalleryIndex(0);
    setIsGalleryOpen(true);
  };
  const heroMedia = activity.heroImage ? <div className="activity-object-media">
    <img src={activity.heroImage} alt={activity.heroImageAlt} loading="eager" />
    {gallery.length ? <button ref={galleryTriggerRef} className="activity-object-media__gallery" type="button" onClick={openGallery}>
      <span><strong>{t('object.openGallery')}</strong><small>{gallery.length} {t(gallery.length === 1 ? 'object.photo' : 'object.photos')}</small></span><span aria-hidden="true">↗</span>
    </button> : null}
  </div> : <MediaPlaceholder label={activity.name} kind="activity" />;

  const hero = <ObjectHero
    variant="centered"
    breadcrumbs={<BackLink to="/activities">{t('activity.backToList')}</BackLink>}
    badges={[activity.category]}
    title={activity.name}
    description={activity.description}
    rating={activity.rating ? { value: activity.rating, reviewsLabel: activity.reviews, href: '#reviews' } : undefined}
    media={heroMedia}
  />;
  const content = <ActivityObjectPattern
    mainTags={<ObjectMainTags items={facts} />}
    objectDescription={<ObjectDescription kicker={t('activity.aboutKicker')} title={t('object.aboutTitle')} tags={activity.tags} tagsLabel={t('object.tagsLabel')}><p>{activity.description}</p></ObjectDescription>}
    additionalSections={[
      ...(activity.schedule?.length ? [{ type: 'activitySchedule', kicker: t('activity.scheduleKicker'), title: t('activity.scheduleTitle'), items: activity.schedule }] : []),
      ...(activity.included?.length || activity.excluded?.length ? [{ type: 'includedServices', kicker: t('activity.bookingDetailsKicker'), title: t('activity.includedTitle'), includedItems: activity.included, excludedItems: activity.excluded }] : []),
      ...(activity.equipment?.length ? [{ type: 'equipmentList', kicker: t('activity.packKicker'), title: t('activity.packTitle'), items: activity.equipment }] : [])
    ]}
    reviews={<ObjectReviews kicker={t('activity.reviewsKicker')} title={t('activity.reviewsTitle')} rating={activity.rating ? { value: activity.rating, label: activity.reviews } : undefined} reviews={reviews} />}
    bookingSteps={<BookingSteps context="object" items={tList('activity.bookingSteps')} />}
    faqSection={<FaqAccordion variant="object" items={tList('catalog.activities.faq')} />}
    relatedListings={<ObjectRelatedListings cardType="activity" title={t('activity.related')} items={related} />}
    bookingWidget={<BookingConfigurator
      title={bookingDefinition.title}
      priceLabel={bookingDefinition.priceLabel}
      object={bookingOffer.object}
      fields={resolveEntryFields(bookingDefinition, bookingOffer)}
      basePrice={bookingOffer.basePrice}
      availability={bookingOffer.availability}
      entryNote={bookingDefinition.entryNote}
      confirmationText={bookingDefinition.confirmationText}
      estimate={(answers) => estimateBookingPrice(bookingDefinition, bookingOffer, answers)}
      actionLabel={t('object.continueRequest')}
      onContinue={startBooking}
    />}
  />;

  return <>
    <div className="activity-detail"><ObjectDetailPageTemplate navbar={<SiteNavbar />} hero={hero} content={content} footer={<SiteFooter />} /></div>
    <ObjectMediaGallery images={gallery} index={galleryIndex} objectName={activity.name} objectLabel={t('activity.galleryLabel')} isOpen={isGalleryOpen} onClose={closeGallery} onIndexChange={setGalleryIndex} />
  </>;
}
