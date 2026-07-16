import { apiError, json } from '../_lib/http';

const ALLOWED = {
  requestType: ['specific_instructor', 'manager_match'],
  slot: ['morning', 'midday', 'afternoon'],
  companyType: ['Family', 'Friends', 'Solo'],
  language: ['English', 'Russian', 'Georgian'],
  activity: ['Ski', 'Snowboard', 'Freeride', 'Sightseeing'],
  pace: ['Relaxed', 'Medium', 'Adrenaline'],
  skillLevel: ['Beginner', 'Intermediate', 'Advanced'],
  budget: ['Economy', 'Mid-range', 'Premium'],
  messenger: ['WhatsApp', 'Telegram', 'Viber']
};

function cleanText(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function allowedValue(value, options) {
  return options.includes(value) ? value : '';
}

function allowedList(value, options, max = options.length) {
  return Array.isArray(value) ? [...new Set(value.filter((item) => options.includes(item)))].slice(0, max) : [];
}

function cleanDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value : '';
}

function cleanSlots(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter(([date]) => cleanDate(date))
    .slice(0, 31)
    .map(([date, slots]) => [date, allowedList(slots, ALLOWED.slot, 3)]));
}

function cleanParticipants(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 10).map((participant) => ({
    name: cleanText(participant?.name, 100),
    age: Math.max(0, Math.min(99, Number.parseInt(participant?.age, 10) || 0)) || null,
    skillLevel: allowedValue(participant?.skillLevel, ALLOWED.skillLevel) || 'Beginner',
    notes: cleanText(participant?.notes, 400)
  }));
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== 'object') return apiError('Invalid request data.', 400);

  // Honeypot fields return a generic success response so automated submissions get no signal.
  if (cleanText(payload.website, 120)) return json({ data: { requestCode: 'MG-RECEIVED' } }, { status: 201, cacheControl: 'no-store' });

  const requestType = allowedValue(payload.requestType, ALLOWED.requestType);
  const dateRangeStart = cleanDate(payload.dateRangeStart);
  const dateRangeEnd = cleanDate(payload.dateRangeEnd);
  const sessionSlots = cleanSlots(payload.sessionSlots);
  const selectedSlotIds = [...new Set(Object.values(sessionSlots).flat())];
  const preferredDates = cleanText(payload.preferredDates, 180);
  const instructorSlug = cleanText(payload.instructorSlug, 100) || null;
  const instructorName = cleanText(payload.instructorName, 120) || null;
  const companyType = allowedValue(payload.companyType, ALLOWED.companyType) || 'Solo';
  const participantCount = Math.max(1, Math.min(10, Number.parseInt(payload.participantCount, 10) || 1));
  const childrenCount = Math.max(0, Math.min(participantCount, Number.parseInt(payload.childrenCount, 10) || 0));
  const languages = allowedList(payload.languages, ALLOWED.language);
  const activities = allowedList(payload.activities, ALLOWED.activity);
  const pace = allowedValue(payload.pace, ALLOWED.pace);
  const skillLevel = allowedValue(payload.skillLevel, ALLOWED.skillLevel);
  const budget = allowedValue(payload.budget, ALLOWED.budget);
  const participants = cleanParticipants(payload.participants);
  const notes = cleanText(payload.notes, 1200);
  const contactName = cleanText(payload.contactName, 100);
  const contactPhone = cleanText(payload.contactPhone, 80);
  const contactEmail = cleanText(payload.contactEmail, 160);
  const messenger = allowedValue(payload.messenger, ALLOWED.messenger);

  if (!requestType || !dateRangeStart || !dateRangeEnd || dateRangeEnd < dateRangeStart || !Object.values(sessionSlots).some((slots) => slots.length)) return apiError('Choose dates and at least one lesson time slot.', 400);
  if (requestType === 'specific_instructor' && (!instructorSlug || !instructorName || !participants.length)) return apiError('Add the instructor and at least one participant.', 400);
  if (requestType === 'manager_match' && (!languages.length || !activities.length || !pace || !skillLevel || !budget)) return apiError('Please complete your matching preferences.', 400);
  if (!contactName || !contactPhone || !messenger) return apiError('Please add your name, phone and preferred contact method.', 400);

  const requestCode = `MG-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const legacyDiscipline = activities.includes('Snowboard') && !activities.includes('Ski') ? 'Snowboard' : activities.includes('Ski') && !activities.includes('Snowboard') ? 'Ski' : 'Either';
  const legacySkillLevel = skillLevel || participants[0]?.skillLevel || 'Beginner';
  const legacyLanguage = languages[0] || 'English';
  const legacyParticipantCount = requestType === 'specific_instructor' ? participants.length : participantCount;

  try {
    await env.DB.prepare(`
      INSERT INTO instructor_requests (
        request_code, instructor_slug, instructor_name, preferred_dates,
        time_preferences_json, discipline, skill_level, lesson_language,
        participant_count, has_children, extras_json, notes,
        contact_name, contact_phone, contact_email, messenger,
        request_type, date_range_start, date_range_end, session_slots_json,
        company_type, children_count, languages_json, activities_json, pace,
        budget, participants_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      requestCode, instructorSlug, instructorName, preferredDates || `${dateRangeStart} – ${dateRangeEnd}`,
      JSON.stringify(selectedSlotIds), legacyDiscipline, legacySkillLevel, legacyLanguage,
      legacyParticipantCount, childrenCount > 0 ? 1 : 0, '[]', notes || null,
      contactName, contactPhone, contactEmail || null, messenger,
      requestType, dateRangeStart, dateRangeEnd, JSON.stringify(sessionSlots),
      companyType, childrenCount, JSON.stringify(languages), JSON.stringify(activities), pace || null,
      budget || null, JSON.stringify(participants)
    ).run();
    return json({ data: { requestCode } }, { status: 201, cacheControl: 'no-store' });
  } catch (error) {
    console.error('Failed to create instructor request', error);
    return apiError('Unable to send your request right now. Please try again.', 500);
  }
}
