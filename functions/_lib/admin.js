const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
const integer = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
const decimal = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function slugify(value) {
  return text(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function listAdminInstructors(db) {
  const { results } = await db.prepare(`SELECT id, slug, status, display_name AS name, card_description AS description, card_image_url AS image, rating, review_count AS reviews, sort_order FROM instructors ORDER BY sort_order, display_name`).all();
  return results;
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

export async function saveInstructor(db, payload, currentSlug) {
  const displayName = text(payload.display_name);
  const slug = slugify(payload.slug || displayName);
  if (!displayName || !slug || !text(payload.card_description) || !text(payload.tagline) || !text(payload.intro) || !text(payload.card_image_url) || !text(payload.hero_image_url) || !text(payload.hero_image_alt) || !text(payload.booking_avatar_url)) throw new Error('Please fill in all required text and image fields.');
  const values = [slug, ['draft', 'published', 'archived'].includes(payload.status) ? payload.status : 'draft', displayName, ['male', 'female'].includes(payload.gender) ? payload.gender : null, text(payload.role, 'Instructor'), text(payload.card_description), text(payload.tagline), text(payload.intro), text(payload.card_image_url), text(payload.hero_image_url), text(payload.hero_image_alt), text(payload.booking_avatar_url), Math.max(0, integer(payload.experience_years)), Math.max(0, Math.min(5, decimal(payload.rating))), Math.max(0, integer(payload.review_count)), text(payload.availability_label) || null, text(payload.certificate_label) || null, Math.max(0, integer(payload.hourly_rate_gel)), Math.max(1, integer(payload.min_hours, 1)), Math.max(1, integer(payload.max_hours, 1)), Math.max(1, integer(payload.hours_step, 1)), Math.max(1, integer(payload.min_people, 1)), Math.max(1, integer(payload.max_people, 1)), Math.max(1, integer(payload.default_hours, 1)), Math.max(1, integer(payload.default_people, 1)), integer(payload.sort_order)];
  let instructorId;
  if (currentSlug) {
    const existing = await db.prepare('SELECT id FROM instructors WHERE slug = ?').bind(currentSlug).first();
    if (!existing) return null;
    await db.prepare('UPDATE instructors SET slug=?, status=?, display_name=?, gender=?, role=?, card_description=?, tagline=?, intro=?, card_image_url=?, hero_image_url=?, hero_image_alt=?, booking_avatar_url=?, experience_years=?, rating=?, review_count=?, availability_label=?, certificate_label=?, hourly_rate_gel=?, min_hours=?, max_hours=?, hours_step=?, min_people=?, max_people=?, default_hours=?, default_people=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values, existing.id).run();
    instructorId = existing.id;
  } else {
    const result = await db.prepare('INSERT INTO instructors (slug, status, display_name, gender, role, card_description, tagline, intro, card_image_url, hero_image_url, hero_image_alt, booking_avatar_url, experience_years, rating, review_count, availability_label, certificate_label, hourly_rate_gel, min_hours, max_hours, hours_step, min_people, max_people, default_hours, default_people, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(...values).run();
    instructorId = result.meta.last_row_id;
  }
  await replaceRelations(db, instructorId, payload);
  return getAdminInstructor(db, slug);
}
