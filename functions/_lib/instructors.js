function parseJson(value) {
  try {
    return JSON.parse(value || '[]');
  } catch {
    return [];
  }
}

function mapSummary(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name,
    description: row.card_description,
    rating: row.rating,
    reviews: row.review_count,
    image: row.card_image_url,
    sports: parseJson(row.disciplines_json),
    languages: parseJson(row.languages_json)
  };
}

const SUMMARY_SELECT = `
  SELECT
    i.id,
    i.slug,
    i.display_name,
    i.card_description,
    i.rating,
    i.review_count,
    i.card_image_url,
    COALESCE((
      SELECT json_group_array(json_object('slug', item.slug, 'name', item.name, 'icon', item.icon_url))
      FROM (
        SELECT d.slug, d.name, d.icon_url
        FROM instructor_disciplines link
        JOIN disciplines d ON d.id = link.discipline_id
        WHERE link.instructor_id = i.id
        ORDER BY link.sort_order, d.name
      ) item
    ), '[]') AS disciplines_json,
    COALESCE((
      SELECT json_group_array(json_object('code', item.code, 'name', item.name))
      FROM (
        SELECT l.code, l.name
        FROM instructor_languages link
        JOIN languages l ON l.id = link.language_id
        WHERE link.instructor_id = i.id
        ORDER BY link.sort_order, l.code
      ) item
    ), '[]') AS languages_json
  FROM instructors i
`;

export async function listInstructors(db) {
  const result = await db.prepare(`${SUMMARY_SELECT} WHERE i.status = 'published' ORDER BY i.sort_order, i.display_name`).all();
  return result.results.map(mapSummary);
}

export async function getInstructor(db, slug) {
  const instructor = await db.prepare(`${SUMMARY_SELECT} WHERE i.status = 'published' AND i.slug = ? LIMIT 1`).bind(slug).first();
  if (!instructor) return null;

  const [aboutResult, tagsResult, mediaResult, reviewsResult] = await db.batch([
    db.prepare('SELECT body FROM instructor_about WHERE instructor_id = ? ORDER BY sort_order, id').bind(instructor.id),
    db.prepare('SELECT label FROM instructor_tags WHERE instructor_id = ? ORDER BY sort_order, id').bind(instructor.id),
    db.prepare('SELECT media_type, url, thumbnail_url, alt, is_featured FROM instructor_media WHERE instructor_id = ? ORDER BY sort_order, id').bind(instructor.id),
    db.prepare("SELECT author_name, lesson_label, rating, review_date, body, avatar_url, avatar_position FROM instructor_reviews WHERE instructor_id = ? AND is_published = 1 ORDER BY sort_order, id").bind(instructor.id)
  ]);

  const detail = await db.prepare(`
    SELECT role, tagline, intro, hero_image_url, hero_image_alt, booking_avatar_url,
      experience_years, availability_label, certificate_label, hourly_rate_gel,
      min_hours, max_hours, hours_step, min_people, max_people, default_hours, default_people
    FROM instructors WHERE id = ?
  `).bind(instructor.id).first();

  return {
    ...mapSummary(instructor),
    role: detail.role,
    tagline: detail.tagline,
    intro: detail.intro,
    heroImage: detail.hero_image_url,
    heroImageAlt: detail.hero_image_alt,
    bookingAvatar: detail.booking_avatar_url,
    experienceYears: detail.experience_years,
    availability: detail.availability_label,
    certificate: detail.certificate_label,
    about: aboutResult.results.map((item) => item.body),
    tags: tagsResult.results.map((item) => item.label),
    media: mediaResult.results.map((item) => ({
      type: item.media_type,
      src: item.url,
      thumbnail: item.thumbnail_url || item.url,
      alt: item.alt,
      featured: Boolean(item.is_featured)
    })),
    reviewsList: reviewsResult.results.map((item) => ({
      author: item.author_name,
      lesson: item.lesson_label,
      rating: item.rating,
      date: item.review_date,
      body: item.body,
      avatar: item.avatar_url,
      avatarPosition: item.avatar_position
    })),
    pricing: {
      hourlyRateGel: detail.hourly_rate_gel,
      minHours: detail.min_hours,
      maxHours: detail.max_hours,
      hoursStep: detail.hours_step,
      minPeople: detail.min_people,
      maxPeople: detail.max_people,
      defaultHours: detail.default_hours,
      defaultPeople: detail.default_people
    }
  };
}
