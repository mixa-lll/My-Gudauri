import { INSTRUCTOR_DEFAULTS, resolveInstructor, validateInstructor } from '../../src/shared/instructorDefaults.js';
import { collectMediaGarbage, nextSortOrder, resolveUniqueSlug } from './cms.js';

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
const integer = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
const blank = (value) => value === '' || value === null || value === undefined || !Number.isFinite(Number(value));
const optionalInteger = (value, fallback) => blank(value) ? fallback : Math.round(Number(value));
const optionalDecimal = (value, fallback) => blank(value) ? fallback : Number(value);

export function slugify(value) {
  return text(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function listAdminInstructors(db) {
  const { results } = await db.prepare(`
    SELECT
      i.id, i.slug, i.status, i.display_name AS name, i.card_description AS description,
      i.card_image_url AS image, i.rating, i.review_count AS reviews, i.experience_years AS experienceYears,
      i.sort_order, i.updated_at,
      COALESCE((SELECT json_group_array(item.name) FROM (
        SELECT d.name FROM instructor_disciplines link JOIN disciplines d ON d.id = link.discipline_id
        WHERE link.instructor_id = i.id ORDER BY link.sort_order, d.name
      ) item), '[]') AS disciplines_json,
      COALESCE((SELECT json_group_array(item.code) FROM (
        SELECT l.code FROM instructor_languages link JOIN languages l ON l.id = link.language_id
        WHERE link.instructor_id = i.id ORDER BY link.sort_order, l.code
      ) item), '[]') AS languages_json
    FROM instructors i
    ORDER BY i.updated_at DESC, i.sort_order, i.display_name
  `).all();
  return results.map((item) => ({
    ...item,
    disciplines: JSON.parse(item.disciplines_json || '[]'),
    languages: JSON.parse(item.languages_json || '[]'),
  }));
}

export async function getAdminInstructor(db, slug) {
  const base = await db.prepare('SELECT * FROM instructors WHERE slug = ?').bind(slug).first();
  if (!base) return null;
  const [disciplines, languages, about, tags, certifications, media, reviews] = await db.batch([
    db.prepare('SELECT d.slug FROM instructor_disciplines link JOIN disciplines d ON d.id = link.discipline_id WHERE link.instructor_id = ? ORDER BY link.sort_order').bind(base.id),
    db.prepare('SELECT l.code FROM instructor_languages link JOIN languages l ON l.id = link.language_id WHERE link.instructor_id = ? ORDER BY link.sort_order').bind(base.id),
    db.prepare('SELECT body FROM instructor_about WHERE instructor_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM instructor_tags WHERE instructor_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT title, level, file_url FROM instructor_certifications WHERE instructor_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT media_type AS type, url, thumbnail_url, alt, is_featured AS featured FROM instructor_media WHERE instructor_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT author_name, lesson_label, rating, review_date, body, avatar_url, avatar_position, is_published FROM instructor_reviews WHERE instructor_id = ? ORDER BY sort_order, id').bind(base.id)
  ]);
  return {
    ...base,
    disciplines: disciplines.results.map((item) => item.slug),
    languages: languages.results.map((item) => item.code),
    about: about.results.map((item) => item.body),
    tags: tags.results.map((item) => item.label),
    certifications: certifications.results,
    media: media.results.map((item) => ({ ...item, featured: Boolean(item.featured) })),
    reviewsList: reviews.results.map((item) => ({ ...item, is_published: Boolean(item.is_published) }))
  };
}

async function replaceRelations(db, instructorId, payload) {
  const statements = [
    db.prepare('DELETE FROM instructor_disciplines WHERE instructor_id = ?').bind(instructorId),
    db.prepare('DELETE FROM instructor_languages WHERE instructor_id = ?').bind(instructorId),
    db.prepare('DELETE FROM instructor_about WHERE instructor_id = ?').bind(instructorId),
    db.prepare('DELETE FROM instructor_tags WHERE instructor_id = ?').bind(instructorId),
    db.prepare('DELETE FROM instructor_certifications WHERE instructor_id = ?').bind(instructorId),
    db.prepare('DELETE FROM instructor_media WHERE instructor_id = ?').bind(instructorId),
    db.prepare('DELETE FROM instructor_reviews WHERE instructor_id = ?').bind(instructorId)
  ];
  const disciplines = Array.isArray(payload.disciplines) ? payload.disciplines : [];
  const languages = Array.isArray(payload.languages) ? payload.languages : [];
  disciplines.forEach((slug, index) => statements.push(db.prepare('INSERT INTO instructor_disciplines (instructor_id, discipline_id, sort_order) SELECT ?, id, ? FROM disciplines WHERE slug = ?').bind(instructorId, index, text(slug))));
  languages.forEach((code, index) => statements.push(db.prepare('INSERT INTO instructor_languages (instructor_id, language_id, sort_order) SELECT ?, id, ? FROM languages WHERE code = ?').bind(instructorId, index, text(code))));
  (Array.isArray(payload.about) ? payload.about : []).filter(Boolean).forEach((body, index) => statements.push(db.prepare('INSERT INTO instructor_about (instructor_id, body, sort_order) VALUES (?, ?, ?)').bind(instructorId, text(body), index)));
  (Array.isArray(payload.tags) ? payload.tags : []).filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO instructor_tags (instructor_id, label, sort_order) VALUES (?, ?, ?)').bind(instructorId, text(label), index)));
  (Array.isArray(payload.certifications) ? payload.certifications : []).filter((item) => text(item.title)).forEach((item, index) => statements.push(db.prepare('INSERT INTO instructor_certifications (instructor_id, title, level, file_url, sort_order) VALUES (?, ?, ?, ?, ?)').bind(instructorId, text(item.title), text(item.level) || null, text(item.file_url || item.fileUrl) || null, index)));
  (Array.isArray(payload.media) ? payload.media : []).filter((item) => text(item.url)).forEach((item, index) => statements.push(db.prepare('INSERT INTO instructor_media (instructor_id, media_type, url, thumbnail_url, alt, sort_order, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(instructorId, item.type === 'video' ? 'video' : 'image', text(item.url), text(item.thumbnail_url) || null, text(item.alt, 'Instructor photo'), index, item.featured ? 1 : 0)));
  (Array.isArray(payload.reviewsList) ? payload.reviewsList : []).filter((item) => text(item.author_name) && text(item.body)).forEach((item, index) => statements.push(db.prepare('INSERT INTO instructor_reviews (instructor_id, author_name, lesson_label, rating, review_date, body, avatar_url, avatar_position, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(instructorId, text(item.author_name), text(item.lesson_label), Math.max(1, Math.min(5, integer(item.rating, 5))), text(item.review_date), text(item.body), text(item.avatar_url) || null, integer(item.avatar_position, 1), item.is_published === false ? 0 : 1, index)));
  await db.batch(statements);
}

const instructorMediaUrls = (record) => [
  record?.card_image_url,
  record?.hero_image_url,
  record?.booking_avatar_url,
  ...(Array.isArray(record?.media) ? record.media.map((item) => item.url) : []),
].filter(Boolean);

export async function saveInstructor(db, payload, currentSlug, { bucket } = {}) {
  const errors = validateInstructor(payload, { publishing: payload.status === 'published' });
  const firstError = Object.values(errors)[0];
  if (firstError) throw new Error(firstError);

  const existing = currentSlug ? await db.prepare('SELECT id FROM instructors WHERE slug = ?').bind(currentSlug).first() : null;
  if (currentSlug && !existing) return null;
  const previousMedia = existing ? instructorMediaUrls(await getAdminInstructor(db, currentSlug)) : [];

  const resolved = resolveInstructor(payload);
  const slug = await resolveUniqueSlug(db, {
    table: 'instructors',
    requested: payload.slug,
    fallback: payload.display_name,
    currentId: existing?.id,
    conflictMessage: (base) => `Адрес /instructors/${base} уже занят другим инструктором. Выберите другой.`,
  });
  const minHours = Math.max(1, optionalInteger(payload.min_hours, INSTRUCTOR_DEFAULTS.min_hours));
  const minPeople = Math.max(1, optionalInteger(payload.min_people, INSTRUCTOR_DEFAULTS.min_people));
  const sortOrder = optionalInteger(payload.sort_order, null) ?? await nextSortOrder(db, 'instructors');

  const values = [
    slug,
    resolved.status,
    resolved.display_name,
    resolved.gender,
    resolved.role,
    resolved.card_description,
    resolved.tagline,
    resolved.intro,
    resolved.card_image_url,
    resolved.hero_image_url,
    resolved.hero_image_alt,
    resolved.booking_avatar_url,
    Math.max(0, optionalInteger(payload.experience_years, INSTRUCTOR_DEFAULTS.experience_years)),
    Math.max(0, Math.min(5, optionalDecimal(payload.rating, INSTRUCTOR_DEFAULTS.rating))),
    Math.max(0, optionalInteger(payload.review_count, INSTRUCTOR_DEFAULTS.review_count)),
    resolved.availability_label,
    resolved.certificate_label,
    Math.max(0, optionalInteger(payload.hourly_rate_gel, INSTRUCTOR_DEFAULTS.hourly_rate_gel)),
    minHours,
    Math.max(minHours, optionalInteger(payload.max_hours, INSTRUCTOR_DEFAULTS.max_hours)),
    Math.max(1, optionalInteger(payload.hours_step, INSTRUCTOR_DEFAULTS.hours_step)),
    minPeople,
    Math.max(minPeople, optionalInteger(payload.max_people, INSTRUCTOR_DEFAULTS.max_people)),
    Math.max(minHours, optionalInteger(payload.default_hours, INSTRUCTOR_DEFAULTS.default_hours)),
    Math.max(minPeople, optionalInteger(payload.default_people, INSTRUCTOR_DEFAULTS.default_people)),
    sortOrder,
  ];

  let instructorId;
  if (existing) {
    await db.prepare('UPDATE instructors SET slug=?, status=?, display_name=?, gender=?, role=?, card_description=?, tagline=?, intro=?, card_image_url=?, hero_image_url=?, hero_image_alt=?, booking_avatar_url=?, experience_years=?, rating=?, review_count=?, availability_label=?, certificate_label=?, hourly_rate_gel=?, min_hours=?, max_hours=?, hours_step=?, min_people=?, max_people=?, default_hours=?, default_people=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values, existing.id).run();
    instructorId = existing.id;
  } else {
    const result = await db.prepare('INSERT INTO instructors (slug, status, display_name, gender, role, card_description, tagline, intro, card_image_url, hero_image_url, hero_image_alt, booking_avatar_url, experience_years, rating, review_count, availability_label, certificate_label, hourly_rate_gel, min_hours, max_hours, hours_step, min_people, max_people, default_hours, default_people, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(...values).run();
    instructorId = result.meta.last_row_id;
  }
  await replaceRelations(db, instructorId, { ...payload, about: resolved.about });
  const saved = await getAdminInstructor(db, slug);
  const dropped = previousMedia.filter((url) => !instructorMediaUrls(saved).includes(url));
  if (dropped.length) await collectMediaGarbage(db, bucket, dropped);
  return saved;
}

async function getDuplicateSlug(db, sourceSlug) {
  const baseSlug = `${sourceSlug}-copy`;
  const { results } = await db.prepare('SELECT slug FROM instructors WHERE slug = ? OR slug LIKE ?').bind(baseSlug, `${baseSlug}-%`).all();
  const existing = new Set(results.map((item) => item.slug));
  if (!existing.has(baseSlug)) return baseSlug;
  let suffix = 2;
  while (existing.has(`${baseSlug}-${suffix}`)) suffix += 1;
  return `${baseSlug}-${suffix}`;
}

export async function duplicateInstructor(db, sourceSlug) {
  const source = await getAdminInstructor(db, sourceSlug);
  if (!source) return null;
  const slug = await getDuplicateSlug(db, source.slug);
  return saveInstructor(db, {
    ...source,
    id: undefined,
    slug,
    status: 'draft',
    display_name: `${source.display_name} — копия`,
    rating: 0,
    review_count: 0,
    reviewsList: [],
  });
}
