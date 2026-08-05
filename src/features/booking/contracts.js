import { calculatePrice } from '../../shared/pricing';

const COMMON_CONTACT_STEP = 'contact-details';
const COMMON_REVIEW_STEP = 'request-review';

const CATEGORY_ALIASES = Object.freeze({
  instructor: 'instructors',
  activity: 'activities',
  transfer: 'transfers',
  stay: 'stays',
});

export const BOOKING_FLOW_REGISTRY = Object.freeze({
  'instructor-match-v1': Object.freeze({
    key: 'instructor-match-v1',
    version: 1,
    category: 'instructors',
    title: 'Request a lesson',
    priceLabel: 'Price',
    matchHourlyRate: 345,
    entryNote: 'The operator confirms a suitable instructor, the weather and meeting point before payment.',
    confirmationText: 'Tell us what you need and the local team will match an instructor for you.',
    entryFields: [],
    fields: Object.freeze({
      dateRange: { id: 'dateRange', initial: { start: '', end: '' } },
      timePreferences: { id: 'timePreferences', initial: [] },
      timeSlotsByDate: { id: 'timeSlotsByDate', initial: {} },
      companyType: { id: 'companyType', initial: 'Family' },
      adultsCount: { id: 'adultsCount', initial: 1 },
      childrenCount: { id: 'childrenCount', initial: 0 },
      languages: { id: 'languages', initial: ['English'] },
      activities: { id: 'activities', initial: ['Ski'] },
      pace: { id: 'pace', initial: 'Medium' },
      skillLevel: { id: 'skillLevel', initial: 'Beginner' },
      budget: { id: 'budget', initial: 'Mid-range' },
      notes: { id: 'notes', initial: '' },
      contactName: { id: 'contactName', initial: '' },
      contactPhone: { id: 'contactPhone', initial: '' },
      contactEmail: { id: 'contactEmail', initial: '' },
      messenger: { id: 'messenger', initial: 'WhatsApp' },
    }),
    steps: ['instructor-match-dates', 'instructor-match-company', 'instructor-match-preferences', COMMON_CONTACT_STEP],
    pricingPolicy: 'operator-match-v1',
    requestKind: 'inquiry',
    presentation: 'operator-match',
  }),
  'instructor-lesson-v1': Object.freeze({
    key: 'instructor-lesson-v1',
    version: 1,
    category: 'instructors',
    title: 'Book a lesson',
    priceLabel: 'Estimated lesson total',
    entryNote: 'Hours can be split across several days.',
    confirmationText: 'Pick a date and time — the manager confirms whether the instructor is free, or suggests another.',
    entryFields: ['duration', 'participants'],
    fields: Object.freeze({
      duration: { id: 'duration', label: 'Hours', singularLabel: 'Hour', shortLabel: 'h', control: 'quantity', min: 2, max: 12, step: 2, initial: 2, affectsPrice: true },
      participants: { id: 'participants', label: 'Students', singularLabel: 'Student', shortLabel: 'ppl', shortSingularLabel: 'person', control: 'quantity', min: 1, max: 10, step: 1, initial: 1 },
      companyType: { id: 'companyType', initial: 'Family' },
      adultsCount: { id: 'adultsCount', initial: '' },
      childrenCount: { id: 'childrenCount', initial: 0 },
      languages: { id: 'languages', initial: ['English'] },
      level: { id: 'level', label: 'Group level', control: 'select', initial: 'Beginner', options: ['Beginner', 'Intermediate', 'Advanced'] },
      dateRange: { id: 'dateRange', initial: { start: '', end: '' } },
      timePreferences: { id: 'timePreferences', initial: [] },
      timeSlotsByDate: { id: 'timeSlotsByDate', initial: {} },
    }),
    steps: ['instructor-dates', 'instructor-participants', COMMON_CONTACT_STEP, COMMON_REVIEW_STEP],
    pricingPolicy: 'instructor-hourly-v1',
    requestKind: 'transaction',
  }),
  'activity-request-v1': Object.freeze({
    key: 'activity-request-v1',
    version: 1,
    category: 'activities',
    title: 'Request an activity',
    priceLabel: 'Estimated activity total',
    entryNote: 'Timing may change with weather and mountain conditions.',
    confirmationText: 'Continue to choose a date and time. The manager confirms the activity and final meeting details.',
    entryFields: ['participants', 'duration'],
    fields: Object.freeze({
      participants: { id: 'participants', label: 'People', singularLabel: 'Person', shortLabel: 'ppl', shortSingularLabel: 'person', control: 'quantity', min: 1, max: 12, step: 1, initial: 1, affectsPrice: true },
      duration: { id: 'duration', label: 'Duration', control: 'select', initial: 'Half day', options: ['Half day', 'Full day'] },
    }),
    steps: ['activity-details', COMMON_CONTACT_STEP, COMMON_REVIEW_STEP],
    pricingPolicy: 'activity-per-person-v1',
    requestKind: 'inquiry',
  }),
  'rental-request-v1': Object.freeze({
    key: 'rental-request-v1',
    version: 1,
    category: 'rental',
    title: 'Request equipment',
    priceLabel: 'Estimated rental total',
    entryNote: 'Equipment sizes and availability are confirmed before payment.',
    confirmationText: 'Continue to add sizes and pickup dates. The manager confirms the selected equipment.',
    entryFields: ['days', 'equipment'],
    fields: Object.freeze({
      days: { id: 'days', label: 'Days', singularLabel: 'Day', shortLabel: 'days', shortSingularLabel: 'day', control: 'quantity', min: 1, max: 14, step: 1, initial: 1, affectsPrice: true },
      equipment: { id: 'equipment', label: 'Equipment', control: 'select', initial: 'Ski set', options: ['Ski set', 'Snowboard set', 'Clothing'] },
    }),
    steps: ['rental-details', COMMON_CONTACT_STEP, COMMON_REVIEW_STEP],
    pricingPolicy: 'rental-daily-v1',
    requestKind: 'inquiry',
  }),
  'transfer-request-v1': Object.freeze({
    key: 'transfer-request-v1',
    version: 1,
    category: 'transfers',
    title: 'Request a transfer',
    priceLabel: 'Estimated transfer total',
    entryNote: 'The final route and pickup time are confirmed by the manager.',
    confirmationText: 'Continue to add your travel details. The manager confirms the vehicle and exact pickup time.',
    entryFields: ['passengers', 'pickup'],
    fields: Object.freeze({
      passengers: { id: 'passengers', label: 'Passengers', singularLabel: 'Passenger', shortLabel: 'ppl', shortSingularLabel: 'person', control: 'quantity', min: 1, max: 16, step: 1, initial: 2 },
      pickup: { id: 'pickup', label: 'Pickup point', control: 'text', initial: '', placeholder: 'Tbilisi airport', required: true },
    }),
    steps: ['transfer-details', COMMON_CONTACT_STEP, COMMON_REVIEW_STEP],
    pricingPolicy: 'transfer-fixed-v1',
    requestKind: 'inquiry',
  }),
  'stay-request-v1': Object.freeze({
    key: 'stay-request-v1',
    version: 1,
    category: 'stays',
    title: 'Request a stay',
    priceLabel: 'Estimated stay total',
    entryNote: 'Availability and the final stay total are confirmed before payment.',
    confirmationText: 'Continue to choose dates and guest details. The host confirms availability and the final price.',
    entryFields: ['nights', 'guests'],
    fields: Object.freeze({
      nights: { id: 'nights', label: 'Nights', singularLabel: 'Night', shortLabel: 'nights', shortSingularLabel: 'night', control: 'quantity', min: 1, max: 30, step: 1, initial: 2, affectsPrice: true },
      guests: { id: 'guests', label: 'Guests', singularLabel: 'Guest', shortLabel: 'guests', shortSingularLabel: 'guest', control: 'quantity', min: 1, max: 12, step: 1, initial: 2 },
    }),
    steps: ['stay-details', COMMON_CONTACT_STEP, COMMON_REVIEW_STEP],
    pricingPolicy: 'stay-nightly-v1',
    requestKind: 'inquiry',
  }),
  'service-request-v1': Object.freeze({
    key: 'service-request-v1',
    version: 1,
    category: 'services',
    title: 'Request a service',
    priceLabel: 'Starting price',
    entryNote: 'The service scope and final price are confirmed after your request.',
    confirmationText: 'Continue to describe what you need. The provider confirms availability and the final quote.',
    entryFields: ['participants', 'duration'],
    fields: Object.freeze({
      participants: { id: 'participants', label: 'People', singularLabel: 'Person', shortLabel: 'ppl', shortSingularLabel: 'person', control: 'quantity', min: 1, max: 20, step: 1, initial: 1 },
      duration: { id: 'duration', label: 'Duration', control: 'select', initial: 'Standard', options: ['Standard', 'Extended', 'Custom'] },
    }),
    steps: ['service-details', COMMON_CONTACT_STEP, COMMON_REVIEW_STEP],
    pricingPolicy: 'request-only-v1',
    requestKind: 'inquiry',
  }),
  'place-request-v1': Object.freeze({
    key: 'place-request-v1',
    version: 1,
    category: 'places',
    title: 'Send an inquiry',
    priceLabel: 'Starting price',
    entryNote: 'Availability is confirmed directly with the venue.',
    confirmationText: 'Continue to add your preferred time and contact details. The venue confirms your request.',
    entryFields: ['guests', 'preferredTime'],
    fields: Object.freeze({
      guests: { id: 'guests', label: 'Guests', singularLabel: 'Guest', shortLabel: 'guests', shortSingularLabel: 'guest', control: 'quantity', min: 1, max: 20, step: 1, initial: 2 },
      preferredTime: { id: 'preferredTime', label: 'Preferred time', control: 'text', initial: '', placeholder: '19:00', required: true },
    }),
    steps: ['place-details', COMMON_CONTACT_STEP, COMMON_REVIEW_STEP],
    pricingPolicy: 'request-only-v1',
    requestKind: 'inquiry',
  }),
});

export const CATEGORY_BOOKING_REGISTRY = Object.freeze({
  instructors: { flowKey: 'instructor-lesson-v1', objectPatternKey: 'instructor' },
  activities: { flowKey: 'activity-request-v1', objectPatternKey: 'activity' },
  rental: { flowKey: 'rental-request-v1', objectPatternKey: 'rental' },
  transfers: { flowKey: 'transfer-request-v1', objectPatternKey: 'transfer' },
  stays: { flowKey: 'stay-request-v1', objectPatternKey: 'stay' },
  services: { flowKey: 'service-request-v1', objectPatternKey: 'activity' },
  places: { flowKey: 'place-request-v1', objectPatternKey: 'activity' },
});

export function normalizeBookingCategory(category) {
  return CATEGORY_ALIASES[category] ?? category;
}

export function getBookingFlowDefinition(categoryOrFlowKey) {
  if (BOOKING_FLOW_REGISTRY[categoryOrFlowKey]) return BOOKING_FLOW_REGISTRY[categoryOrFlowKey];
  const category = normalizeBookingCategory(categoryOrFlowKey);
  const flowKey = CATEGORY_BOOKING_REGISTRY[category]?.flowKey;
  if (!flowKey) throw new Error(`Booking: unsupported category or flow “${categoryOrFlowKey}”.`);
  return BOOKING_FLOW_REGISTRY[flowKey];
}

export function createInitialBookingAnswers(definition, overrides = {}) {
  const initial = Object.fromEntries(Object.values(definition.fields).map((field) => [field.id, field.initial ?? '']));
  const answers = { ...initial, ...overrides };
  if (definition.key === 'instructor-lesson-v1' && !Number(overrides.adultsCount)) {
    answers.adultsCount = Number(answers.participants) || 1;
  }
  return answers;
}

export function resolveEntryFields(definition, offer) {
  return definition.entryFields.map((fieldId) => {
    const field = definition.fields[fieldId];
    const constraints = offer?.constraints?.[fieldId];
    return { ...field, ...constraints };
  });
}

export function createBookingOffer({ definition, object, currency = 'GEL', basePrice = 0, constraints = {}, availability, pricingRules }) {
  return Object.freeze({
    object,
    flowKey: definition.key,
    flowVersion: definition.version,
    pricingPolicyKey: definition.pricingPolicy,
    currency,
    basePrice: Number(basePrice) || 0,
    // Per-object volume ladders. Left out, the shared engine applies the
    // platform defaults for the policy — an offer is always quotable.
    pricingRules: pricingRules ?? null,
    constraints,
    availability,
  });
}

/** Every slot in the operator-match flow is a two-hour block. */
const MATCH_SLOT_HOURS = 2;

/**
 * Map a flow's answers onto the quantities the pricing engine expects.
 * Only the match flow needs a translation: it has no hours field, its duration
 * comes from the slots the guest picked, and its group size is split into
 * adults and children.
 */
function pricingQuantities(definition, answers = {}) {
  if (definition.pricingPolicy !== 'operator-match-v1') return answers;
  const adults = Math.max(1, Number(answers.adultsCount) || 1);
  const children = Math.max(0, Number(answers.childrenCount) || 0);
  return {
    ...answers,
    duration: Object.values(answers.timeSlotsByDate ?? {}).flat().length * MATCH_SLOT_HOURS,
    participants: adults + children,
  };
}

/** The full quote — total plus the parts a price breakdown is built from. */
export function estimateBookingPrice(definition, offer, answers) {
  return calculatePrice({
    basePrice: offer?.basePrice,
    policyKey: definition.pricingPolicy,
    rules: offer?.pricingRules,
    quantities: pricingQuantities(definition, answers),
  });
}

export function estimateBookingTotal(definition, offer, answers) {
  return estimateBookingPrice(definition, offer, answers).total;
}

export function formatBookingPrice(amount, currency = 'GEL', onRequestLabel = 'On request') {
  return amount > 0 ? `${new Intl.NumberFormat('en').format(amount)} ${currency}` : onRequestLabel;
}

const TRANSLATABLE_FIELD_PROPS = ['label', 'singularLabel', 'shortLabel', 'shortSingularLabel', 'placeholder'];

function localizeField(field, flowKey, t) {
  const base = `booking.flows.${flowKey}.fields.${field.id}`;
  const localized = { ...field };
  for (const prop of TRANSLATABLE_FIELD_PROPS) {
    if (field[prop]) localized[prop] = t(`${base}.${prop}`);
  }
  if (field.options) {
    localized.options = field.options.map((option) => ({ value: option, label: t(`booking.options.${optionKey(option)}`) }));
  }
  return localized;
}

export function optionKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Answer values stay in English so stored requests remain consistent across languages;
// only what the guest reads is translated.
export function localizeBookingDefinition(definition, t) {
  const base = `booking.flows.${definition.key}`;
  return {
    ...definition,
    title: t(`${base}.title`),
    priceLabel: t(`${base}.priceLabel`),
    entryNote: t(`${base}.entryNote`),
    confirmationText: t(`${base}.confirmationText`),
    fields: Object.fromEntries(
      Object.entries(definition.fields).map(([id, field]) => [id, localizeField(field, definition.key, t)])
    ),
  };
}
