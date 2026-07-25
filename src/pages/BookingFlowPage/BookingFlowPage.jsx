import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackLink, Container, ErrorState, LoadingState, SiteFooter, SiteNavbar } from '../../design-system';
import {
  BookingRequestFlow,
  createBookingDraft,
  createBookingOffer,
  getBookingFlowDefinition,
  readBookingDraft,
  saveBookingDraft,
} from '../../features/booking';
import { getInstructor } from '../../services/instructorsApi';
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

async function loadInstructorDraft(slug) {
  const instructor = await getInstructor(slug);
  if (!instructor) return null;
  const definition = getBookingFlowDefinition('instructors');
  const offer = createBookingOffer({
    definition,
    object: {
      id: `instructor:${instructor.id ?? instructor.slug}`,
      slug: instructor.slug,
      name: instructor.name,
      typeLabel: 'Private instructor',
      image: instructor.bookingAvatar ?? instructor.image,
    },
    basePrice: instructor.pricing.hourlyRateGel,
    availability: instructor.availability,
    constraints: {
      duration: { min: instructor.pricing.minHours, max: instructor.pricing.maxHours, step: instructor.pricing.hoursStep, initial: instructor.pricing.defaultHours },
      participants: { min: instructor.pricing.minPeople, max: instructor.pricing.maxPeople, initial: instructor.pricing.defaultPeople },
    },
  });
  return createBookingDraft({ definition, offer, answers: { duration: instructor.pricing.defaultHours, participants: instructor.pricing.defaultPeople } });
}

function instructorPayload({ offer, answers }) {
  const adultsCount = Math.max(1, Number(answers.adultsCount) || Number(answers.participants) || 1);
  const childrenCount = Math.max(0, Number(answers.childrenCount) || 0);
  const participantCount = adultsCount + childrenCount;
  return {
    requestType: 'specific_instructor',
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

    if ((category === 'instructors' || !category) && slug) {
      loadInstructorDraft(slug)
        .then((draft) => {
          if (!active) return;
          if (!draft) { setState({ status: 'error', draft: null, error: 'Instructor not found.' }); return; }
          saveBookingDraft(draft);
          setState({ status: 'ready', draft, error: '' });
        })
        .catch((error) => active && setState({ status: 'error', draft: null, error: error.message }));
      return () => { active = false; };
    }

    setState({ status: 'error', draft: null, error: 'Open a specific offer and configure the request first.' });
    return () => { active = false; };
  }, [category, slug]);

  if (state.status === 'loading') return <><SiteNavbar /><Container as="main" width="detail" className="booking-flow-page__state"><LoadingState title="Preparing your request" /></Container><SiteFooter /></>;
  if (state.status === 'error' || !state.draft) return <><SiteNavbar /><Container as="main" width="detail" className="booking-flow-page__state"><ErrorState title="Booking cannot be opened" description={state.error} action={<BackLink to="/instructors">Back to instructors</BackLink>} /></Container><SiteFooter /></>;

  const definition = getBookingFlowDefinition(state.draft.flowKey);
  const offer = draftOffer(state.draft);
  const backPath = definition.category === 'instructors' ? `/instructors/${offer.object.slug}` : `/${definition.category}/${offer.object.slug}`;
  const submit = definition.category === 'instructors'
    ? ({ offer: submittedOffer, answers }) => createInstructorRequest(instructorPayload({ offer: submittedOffer, answers }))
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
        <BackLink className="booking-flow-page__back" to={backPath} aria-label="Back to the offer">Back to the offer</BackLink>
        <h1>{definition.title} <strong>with {offer.object.name}</strong></h1>
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
