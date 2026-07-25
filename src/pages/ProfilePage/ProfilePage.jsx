import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BackLink,
  Badge,
  BookingConfigurator,
  FaqAccordion,
  InstructorCertifications,
  InstructorObjectPattern,
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
import { createBookingDraft, createBookingOffer, estimateBookingTotal, getBookingFlowDefinition, resolveEntryFields, saveBookingDraft } from '../../features/booking';
import { FAQ_ITEMS } from '../../data/faqItems';
import { getInstructor, getInstructors } from '../../services/instructorsApi';
import './ProfilePage.scss';

export function ProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [status, setStatus] = useState('loading');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [relatedInstructors, setRelatedInstructors] = useState([]);
  const galleryTriggerRef = useRef(null);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setGalleryIndex(0);
    setIsGalleryOpen(false);

    Promise.all([getInstructor(slug), getInstructors().catch(() => [])])
      .then(([data, instructors]) => {
        if (!active) return;
        setInstructor(data);
        setRelatedInstructors(instructors.filter((item) => item.slug !== slug).slice(0, 3));
        setStatus(data ? 'ready' : 'not-found');
      })
      .catch(() => active && setStatus('error'));

    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    document.body.classList.add('profile-page-body');
    if (instructor) document.title = `${instructor.name} — My Gudauri`;
    return () => document.body.classList.remove('profile-page-body');
  }, [instructor]);

  const gallery = useMemo(() => (instructor?.media ?? [])
    .filter((item) => item.type !== 'video')
    .map((item) => ({ ...item, thumbnail: item.thumbnail || item.src })), [instructor]);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    requestAnimationFrame(() => galleryTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  if (status === 'loading') return <main className="profile-data-state">Loading instructor…</main>;
  if (status === 'not-found') return <main className="profile-data-state"><h1>Instructor not found</h1><Link to="/instructors">Back to instructors</Link></main>;
  if (status === 'error' || !instructor) return <main className="profile-data-state"><h1>Profile is temporarily unavailable</h1><p>Please try again later.</p></main>;

  const openGallery = () => {
    galleryTriggerRef.current = document.activeElement;
    setGalleryIndex(0);
    setIsGalleryOpen(true);
  };
  const sportNames = instructor.sports.map((sport) => sport.name);
  const languageCodes = instructor.languages.map((language) => language.code);
  const facts = [
    { label: 'Specialization', value: sportNames },
    { label: 'Languages', value: languageCodes },
    { label: 'Experience', value: [`${instructor.experienceYears}+ years`] },
  ];
  const reviews = (instructor.reviewsList ?? []).map((review, index) => ({
    id: `${review.author}-${index}`,
    author: review.author,
    text: review.body,
    dateLabel: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(review.date)),
    contextLabel: review.lesson,
    rating: review.rating,
    avatar: review.avatar && !review.avatar.includes('avatars-sprite') ? review.avatar : undefined,
  }));
  const related = relatedInstructors.map((item) => ({ ...item, title: item.name }));
  const bookingDefinition = getBookingFlowDefinition('instructors');
  const bookingOffer = createBookingOffer({
    definition: bookingDefinition,
    object: { id: `instructor:${instructor.id ?? instructor.slug}`, slug: instructor.slug, name: instructor.name, typeLabel: 'Private instructor', image: instructor.bookingAvatar },
    basePrice: instructor.pricing.hourlyRateGel,
    availability: instructor.availability,
    constraints: {
      duration: { min: instructor.pricing.minHours, max: instructor.pricing.maxHours, step: instructor.pricing.hoursStep, initial: instructor.pricing.defaultHours },
      participants: { min: instructor.pricing.minPeople, max: instructor.pricing.maxPeople, initial: instructor.pricing.defaultPeople },
    },
  });
  const startBooking = (answers) => {
    saveBookingDraft(createBookingDraft({ definition: bookingDefinition, offer: bookingOffer, answers }));
    navigate(`/booking/instructors/${instructor.slug}`);
  };

  const hero = <ObjectHero
    variant="split"
    breadcrumbs={<BackLink to="/instructors">Back to instructors</BackLink>}
    badges={sportNames}
    title={instructor.name}
    description={instructor.intro}
    rating={{ value: instructor.rating, reviewsLabel: `${instructor.reviews} reviews`, href: '#reviews' }}
    media={<div className="profile-object-media">
      <img src={instructor.heroImage} alt={instructor.heroImageAlt} loading="eager" />
      <Badge className="profile-object-media__availability" mediaOverlay>{instructor.availability}</Badge>
      <button ref={galleryTriggerRef} className="profile-object-media__gallery" type="button" onClick={openGallery}>
        <span><strong>Open gallery</strong><small>{gallery.length} photos</small></span><span aria-hidden="true">↗</span>
      </button>
    </div>}
  />;

  const content = <InstructorObjectPattern
    mainTags={<ObjectMainTags items={facts} />}
    objectDescription={<ObjectDescription kicker={instructor.tagline} title="About the instructor" tags={instructor.tags} tagsLabel="Lesson focus">{instructor.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</ObjectDescription>}
    certifications={<InstructorCertifications items={instructor.certifications} />}
    reviews={<ObjectReviews rating={{ value: instructor.rating, label: `${instructor.reviews} reviews` }} reviews={reviews} />}
    faqSection={<FaqAccordion variant="object" kicker="Good to know" title="Common questions" items={FAQ_ITEMS} />}
    bookingWidget={<BookingConfigurator
      title="Configure your lesson"
      priceLabel={bookingDefinition.priceLabel}
      object={bookingOffer.object}
      fields={resolveEntryFields(bookingDefinition, bookingOffer)}
      basePrice={bookingOffer.basePrice}
      availability={bookingOffer.availability}
      entryNote={bookingDefinition.entryNote}
      confirmationText={bookingDefinition.confirmationText}
      defaultValues={{ duration: instructor.pricing.defaultHours, participants: instructor.pricing.defaultPeople }}
      estimate={(answers) => estimateBookingTotal(bookingDefinition, bookingOffer, answers)}
      onContinue={startBooking}
    />}
    relatedListings={<ObjectRelatedListings cardType="instructor" title="More instructors" items={related} />}
  />;

  return <>
    <ObjectDetailPageTemplate navbar={<SiteNavbar />} hero={hero} content={content} footer={<SiteFooter />} />
    <ObjectMediaGallery images={gallery} index={galleryIndex} objectName={instructor.name} objectLabel="Instructor media" isOpen={isGalleryOpen} onClose={closeGallery} onIndexChange={setGalleryIndex} />
  </>;
}
