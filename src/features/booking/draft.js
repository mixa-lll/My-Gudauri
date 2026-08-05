import { createInitialBookingAnswers, getBookingFlowDefinition } from './contracts';

export const BOOKING_DRAFT_STORAGE_KEY = 'myGudauriBookingDraftV2';

export function createBookingDraft({ definition, offer, answers = {} }) {
  return {
    schemaVersion: 2,
    flowKey: definition.key,
    flowVersion: definition.version,
    category: definition.category,
    object: offer.object,
    offer: {
      basePrice: offer.basePrice,
      // Carried with the draft so the flow quotes the same price the object
      // page did, even if the object is edited mid-request.
      pricingRules: offer.pricingRules ?? null,
      currency: offer.currency,
      constraints: offer.constraints,
      availability: offer.availability,
      pricingPolicyKey: offer.pricingPolicyKey,
      route: offer.route ?? null,
      extras: offer.extras ?? [],
    },
    answers: createInitialBookingAnswers(definition, answers),
    updatedAt: new Date().toISOString(),
  };
}

export function saveBookingDraft(draft, storage = globalThis.sessionStorage) {
  storage?.setItem(BOOKING_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  return draft;
}

export function readBookingDraft(storage = globalThis.sessionStorage) {
  const raw = storage?.getItem(BOOKING_DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw);
    if (draft?.schemaVersion !== 2 || !draft.flowKey || !draft.object?.slug) return null;
    const definition = getBookingFlowDefinition(draft.flowKey);
    if (definition.version !== draft.flowVersion || definition.category !== draft.category) return null;
    return draft;
  } catch {
    return null;
  }
}

export function clearBookingDraft(storage = globalThis.sessionStorage) {
  storage?.removeItem(BOOKING_DRAFT_STORAGE_KEY);
}
