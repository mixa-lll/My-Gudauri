import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackLink, Container, SiteNavbar } from '../../design-system';
import { BookingRequestFlow, createBookingOffer, createInitialBookingAnswers, getBookingFlowDefinition, localizeBookingDefinition } from '../../features/booking';
import { useLanguage } from '../../i18n/LanguageContext';
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
  const { t } = useLanguage();
  const definition = useMemo(() => localizeBookingDefinition(getBookingFlowDefinition('instructor-match-v1'), t), [t]);
  const offer = useMemo(() => createBookingOffer({ definition, object: null, basePrice: definition.matchHourlyRate }), [definition]);
  const initialAnswers = useMemo(() => createInitialBookingAnswers(definition), [definition]);

  return <div className="instructor-match-page">
    <SiteNavbar className="instructor-match-page__nav" />
    <main>
      <Container width="detail" className="instructor-match-page__header">
        <div className="instructor-match-page__title-row">
          <BackLink className="instructor-match-page__back" to="/instructors" aria-label={t('instructor.backToList')}>{t('booking.actions.back')}</BackLink>
          <h1>{t('booking.match.title')} — <strong>{t('booking.match.titleAccent')}</strong></h1>
        </div>
      </Container>
      <Container width="detail" className="instructor-match-page__content">
        <BookingRequestFlow definition={definition} offer={offer} initialAnswers={initialAnswers} onSubmit={({ answers }) => createInstructorRequest(matchPayload(answers))} onBack={() => navigate('/instructors')} />
      </Container>
    </main>
  </div>;
}
