import { apiError, json } from '../_lib/http';
import { dateValue, insertRequest, objectImage, timeValue } from '../_lib/requests';

// Each accepted flow pins its own version, so a flow can be revised without
// forcing every other category to move at the same time.
const FLOWS = Object.freeze({
  'activity-request-v1': { category: 'activities', version: 1 },
  'rental-request-v1': { category: 'rental', version: 1 },
  // A transfer is arranged by phone and messenger, so email stays optional.
  'transfer-request-v3': { category: 'transfers', version: 3, requiresEmail: false },
  'stay-request-v1': { category: 'stays', version: 1 },
  'service-request-v1': { category: 'services', version: 1 },
  'place-request-v1': { category: 'places', version: 1 },
});

const MESSENGERS = ['WhatsApp', 'Telegram', 'Viber'];

function cleanText(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanAnswers(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const jsonValue = JSON.stringify(value);
  return jsonValue.length <= 12000 ? jsonValue : null;
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== 'object') return apiError('Invalid request data.', 400);
  if (cleanText(payload.website, 120)) return json({ data: { requestCode: 'MG-RECEIVED' } }, { status: 201, cacheControl: 'no-store' });

  const flowKey = cleanText(payload.flowKey, 80);
  const category = cleanText(payload.category, 40);
  const flow = FLOWS[flowKey];
  const flowVersion = Number.parseInt(payload.flowVersion, 10);
  const objectId = cleanText(payload.objectId, 120);
  const objectSlug = cleanText(payload.objectSlug, 120);
  const objectName = cleanText(payload.objectName, 160);
  const answersJson = cleanAnswers(payload.answers);
  const contactName = cleanText(payload.answers?.contactName, 100);
  const contactPhone = cleanText(payload.answers?.contactPhone, 80);
  const contactEmail = cleanText(payload.answers?.contactEmail, 160);
  const messenger = MESSENGERS.includes(payload.answers?.messenger) ? payload.answers.messenger : '';
  const estimatedTotal = Number.isFinite(Number(payload.estimatedTotal)) ? Math.max(0, Number(payload.estimatedTotal)) : null;
  const currency = cleanText(payload.currency, 8) || 'GEL';

  if (!flow || flow.category !== category || flow.version !== flowVersion) return apiError('Unsupported booking flow.', 400);
  if (!objectId || !objectSlug || !objectName || !answersJson) return apiError('Offer details are incomplete.', 400);
  if (!contactName || !contactPhone || !messenger) return apiError('Please add your contact details.', 400);
  if (flow.requiresEmail !== false && !contactEmail) return apiError('Please add your contact details.', 400);

  // Whatever the category asks for, the queue needs the same four facts: the
  // object, the day, how many guests and how much — the rest stays in answers.
  const answers = payload.answers ?? {};
  const scheduledDate = dateValue(answers.date) ?? dateValue(answers.startDate) ?? dateValue(answers.checkIn);
  const scheduledEndDate = dateValue(answers.returnDate) ?? dateValue(answers.endDate) ?? dateValue(answers.checkOut);
  const scheduledStart = timeValue(answers.time) ?? timeValue(answers.pickupTime);
  const guestCount = Number.parseInt(answers.passengers ?? answers.participants ?? answers.guests, 10) || 1;

  try {
    const requestCode = await insertRequest(env.DB, {
      category,
      source: 'booking_flow',
      sourceLabel: 'из формы бронирования',
      objectSlug,
      objectName,
      objectKicker: [answers.direction, answers.equipment, answers.duration].filter((value) => typeof value === 'string' && value).join(' · ') || null,
      objectImageUrl: await objectImage(env.DB, category, objectSlug),
      scheduledDate,
      scheduledEndDate,
      scheduledStart,
      scheduleLabel: [scheduledDate, scheduledStart].filter(Boolean).join(', '),
      guestCount,
      amount: estimatedTotal,
      currency,
      contactName,
      contactPhone,
      contactEmail,
      messenger,
      guestNote: cleanText(answers.comment ?? answers.notes, 1200),
      arrivalNote: 'Заявка получена — форма бронирования на сайте',
      details: { flowKey, flowVersion, objectId, answers: JSON.parse(answersJson) },
    });
    return json({ data: { requestCode } }, { status: 201, cacheControl: 'no-store' });
  } catch (error) {
    console.error('Failed to create booking request', error);
    return apiError('Unable to send your request right now. Please try again.', 500);
  }
}
