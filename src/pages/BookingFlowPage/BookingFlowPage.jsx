import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackLink, Container, ErrorState, LoadingState, SiteFooter, SiteNavbar } from '../../design-system';
import {
  BookingRequestFlow,
  createBookingDraft,
  createBookingOffer,
  getBookingFlowDefinition,
  localizeBookingDefinition,
  readBookingDraft,
  saveBookingDraft,
} from '../../features/booking';
import { useLanguage } from '../../i18n/LanguageContext';
import { getInstructor } from '../../services/instructorsApi';
import { getTransfer } from '../../services/transfersApi';
import { createBookingRequest } from '../../services/bookingRequestsApi';
import { createInstructorRequest } from '../../services/instructorRequestsApi';
import './BookingFlowPage.scss';

function draftOffer(draft) {
  return {
    ...draft.offer,
    object: draft.object,
    flowKey: draft.flowKey,
    flowVersion: draft.flowVersion,
  };
}

async function loadInstructorDraft(slug, t) {
  const instructor = await getInstructor(slug);
  if (!instructor) return null;
  const definition = localizeBookingDefinition(getBookingFlowDefinition('instructors'), t);
  const offer = createBookingOffer({
    definition,
    object: {
      id: `instructor:${instructor.id ?? instructor.slug}`,
      slug: instructor.slug,
      name: instructor.name,
      typeLabel: t('instructor.typeLabel'),
      image: instructor.bookingAvatar ?? instructor.image,
    },
    basePrice: instructor.pricing.hourlyRateGel,
    pricingRules: instructor.pricing.rules,
    availability: instructor.availability,
    constraints: {
      duration: { min: instructor.pricing.minHours, max: instructor.pricing.maxHours, step: instructor.pricing.hoursStep, initial: instructor.pricing.defaultHours },
      participants: { min: instructor.pricing.minPeople, max: instructor.pricing.maxPeople, initial: instructor.pricing.defaultPeople },
    },
  });
  return createBookingDraft({ definition, offer, answers: { duration: instructor.pricing.defaultHours, participants: instructor.pricing.defaultPeople } });
}

/*
 * Reloading the booking page must not lose the request, so a transfer draft can
 * be rebuilt from the slug alone. The route carries its meeting points, so the
 * first step can ask about pickup without a second fetch.
 */
async function loadTransferDraft(slug, t) {
  const transfer = await getTransfer(slug);
  if (!transfer) return null;
  const definition = localizeBookingDefinition(getBookingFlowDefinition('transfers'), t);
  const route = transfer.routeEntity ?? { origin: transfer.city, destination: 'Gudauri', duration: transfer.duration, pickupPoints: [] };
  const points = route.pickupPoints ?? [];
  const preset = points.find((point) => point.isDefault) ?? points[0] ?? null;
  const offer = createBookingOffer({
    definition,
    object: {
      id: `transfer:${transfer.id ?? transfer.slug}`,
      slug: transfer.slug,
      name: transfer.name,
      typeLabel: `${route.origin} → ${route.destination}`,
      image: transfer.image,
    },
    basePrice: transfer.priceAmount,
    currency: transfer.currency,
    route,
    extras: transfer.extras ?? [],
  });
  return createBookingDraft({
    definition,
    offer,
    answers: { pointId: preset?.id ?? '', pointKind: preset?.kind ?? '', pointLabel: preset?.label ?? '' },
  });
}

function instructorPayload({ offer, answers, estimatedTotal }) {
  const adultsCount = Math.max(1, Number(answers.adultsCount) || Number(answers.participants) || 1);
  const childrenCount = Math.max(0, Number(answers.childrenCount) || 0);
  const participantCount = adultsCount + childrenCount;
  return {
    requestType: 'specific_instructor',
    // The operator queue sorts and reports on money, so the estimate the guest
    // saw travels with the request rather than being recomputed later.
    estimatedTotal,
    currency: offer.currency,
    instructorSlug: offer.object.slug,
    instructorName: offer.object.name,
    preferredDates: [answers.dateRange?.start, answers.dateRange?.end].filter(Boolean).join(' – '),
    dateRangeStart: answers.dateRange?.start,
    dateRangeEnd: answers.dateRange?.end || answers.dateRange?.start,
    sessionSlots: answers.timeSlotsByDate ?? {},
    participantCount,
    companyType: answers.companyType ?? (participantCount > 1 ? 'Friends' : 'Solo'),
    adultsCount,
    childrenCount,
    languages: answers.languages ?? ['English'],
    activities: [],
    participants: [],
    skillLevel: answers.level ?? 'Beginner',
    groupSkillLevel: answers.level ?? 'Beginner',
    notes: answers.comment,
    contactName: answers.contactName,
    contactPhone: answers.contactPhone,
    contactEmail: answers.contactEmail,
    messenger: answers.messenger,
  };
}

export function BookingFlowPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { category, slug } = useParams();
  const [state, setState] = useState({ status: 'loading', draft: null, error: '' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    let active = true;
    const stored = readBookingDraft();
    const storedMatchesRoute = stored && (!slug || stored.object.slug === slug) && (!category || stored.category === category);
    if (storedMatchesRoute) {
      setState({ status: 'ready', draft: stored, error: '' });
      return () => { active = false; };
    }

    const loader = category === 'transfers' ? loadTransferDraft : (category === 'instructors' || !category) ? loadInstructorDraft : null;
    if (loader && slug) {
      loader(slug, t)
        .then((draft) => {
          if (!active) return;
          if (!draft) { setState({ status: 'error', draft: null, error: t('booking.page.instructorNotFound') }); return; }
          saveBookingDraft(draft);
          setState({ status: 'ready', draft, error: '' });
        })
        .catch((error) => active && setState({ status: 'error', draft: null, error: error.message }));
      return () => { active = false; };
    }

    setState({ status: 'error', draft: null, error: t('booking.page.noDraft') });
    return () => { active = false; };
  }, [category, slug]);

  if (state.status === 'loading') return <><SiteNavbar /><Container as="main" width="detail" className="booking-flow-page__state"><LoadingState title={t('booking.page.preparing')} /></Container><SiteFooter /></>;
  if (state.status === 'error' || !state.draft) return <><SiteNavbar /><Container as="main" width="detail" className="booking-flow-page__state"><ErrorState title={t('booking.page.cannotOpen')} description={state.error} action={<BackLink to="/instructors">{t('instructor.backToList')}</BackLink>} /></Container><SiteFooter /></>;

  const definition = localizeBookingDefinition(getBookingFlowDefinition(state.draft.flowKey), t);
  const offer = draftOffer(state.draft);
  const backPath = definition.category === 'instructors' ? `/instructors/${offer.object.slug}` : `/${definition.category}/${offer.object.slug}`;
  const submit = definition.category === 'instructors'
    ? ({ offer: submittedOffer, answers, estimatedTotal }) => createInstructorRequest(instructorPayload({ offer: submittedOffer, answers, estimatedTotal }))
    : ({ offer: submittedOffer, answers, estimatedTotal }) => createBookingRequest({
      category: definition.category,
      flowKey: definition.key,
      flowVersion: definition.version,
      objectId: submittedOffer.object.id,
      objectSlug: submittedOffer.object.slug,
      objectName: submittedOffer.object.name,
      answers,
      estimatedTotal,
      currency: submittedOffer.currency,
    });

  return <div className="booking-flow-page">
    <SiteNavbar className="booking-flow-page__nav" />
    <main>
      <Container width="detail" className="booking-flow-page__header">
        <BackLink className="booking-flow-page__back" to={backPath} aria-label={t('booking.actions.backToOffer')}>{t('booking.actions.backToOffer')}</BackLink>
        <h1>{definition.title} <strong>{t('booking.page.withObject', { name: offer.object.name })}</strong></h1>
      </Container>
      <Container width="detail" className="booking-flow-page__content">
        <BookingRequestFlow
          definition={definition}
          offer={offer}
          initialAnswers={state.draft.answers}
          onAnswersChange={(answers) => saveBookingDraft({ ...state.draft, answers, updatedAt: new Date().toISOString() })}
          onSubmit={submit}
          onBack={() => navigate(backPath)}
        />
      </Container>
    </main>
  </div>;
}
