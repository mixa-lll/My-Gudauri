import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackLink, Container, SiteNavbar } from '../../design-system';
import { BookingRequestFlow, createBookingOffer, createInitialBookingAnswers, getBookingFlowDefinition } from '../../features/booking';
import { createInstructorRequest } from '../../services/instructorRequestsApi';
import './InstructorMatchPage.scss';

function matchPayload(answers) {
  const people = Number(answers.adultsCount || 0) + Number(answers.childrenCount || 0);
  const dateRange = answers.dateRange ?? {};
  return {
    requestType: 'manager_match',
    instructorSlug: '',
    instructorName: '',
    dateRangeStart: dateRange.start ?? '',
    dateRangeEnd: dateRange.end || dateRange.start || '',
    preferredDates: [dateRange.start, dateRange.end].filter(Boolean).join(' – '),
    sessionSlots: answers.timeSlotsByDate ?? {},
    timePreferences: answers.timePreferences ?? [],
    companyType: answers.companyType,
    adultsCount: Number(answers.adultsCount || 0),
    childrenCount: Number(answers.childrenCount || 0),
    participantCount: people,
    languages: answers.languages ?? [],
    activities: answers.activities ?? [],
    pace: answers.pace,
    skillLevel: answers.skillLevel,
    budget: answers.budget,
    notes: answers.notes,
    contactName: answers.contactName,
    contactPhone: answers.contactPhone,
    contactEmail: answers.contactEmail,
    messenger: answers.messenger,
  };
}

export function InstructorMatchPage() {
  const navigate = useNavigate();
  const definition = useMemo(() => getBookingFlowDefinition('instructor-match-v1'), []);
  const offer = useMemo(() => createBookingOffer({ definition, object: null, basePrice: definition.matchHourlyRate }), [definition]);
  const initialAnswers = useMemo(() => createInitialBookingAnswers(definition), [definition]);

  return <div className="instructor-match-page">
    <SiteNavbar className="instructor-match-page__nav" />
    <main>
      <Container width="detail" className="instructor-match-page__header">
        <div className="instructor-match-page__title-row">
          <BackLink className="instructor-match-page__back" to="/instructors" aria-label="Back to instructors">Back</BackLink>
          <h1>Request a lesson — <strong>we’ll match an instructor</strong></h1>
        </div>
      </Container>
      <Container width="detail" className="instructor-match-page__content">
        <BookingRequestFlow definition={definition} offer={offer} initialAnswers={initialAnswers} onSubmit={({ answers }) => createInstructorRequest(matchPayload(answers))} onBack={() => navigate('/instructors')} />
      </Container>
    </main>
  </div>;
}
