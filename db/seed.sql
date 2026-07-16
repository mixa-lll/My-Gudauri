PRAGMA foreign_keys = ON;

DELETE FROM instructor_reviews;
DELETE FROM instructor_media;
DELETE FROM instructor_tags;
DELETE FROM instructor_about;
DELETE FROM instructor_languages;
DELETE FROM instructor_disciplines;
DELETE FROM languages;
DELETE FROM disciplines;
DELETE FROM instructors;

INSERT INTO disciplines (slug, name, icon_url) VALUES
  ('snowboard', 'Snowboard', '/assets/design-2/icon-snow.png'),
  ('ski', 'Ski', '/assets/design-2/icon-ski.png');

INSERT INTO languages (code, name) VALUES
  ('Ge', 'Georgian'),
  ('En', 'English'),
  ('Ru', 'Russian');

INSERT INTO instructors (
  slug, status, display_name, card_description, tagline, intro, card_image_url,
  hero_image_url, hero_image_alt, booking_avatar_url, experience_years, rating,
  review_count, availability_label, certificate_label, hourly_rate_gel, sort_order
) VALUES
  ('mikhail', 'published', 'Mikhail Andreev', 'Ski & snowboard · 8 years experience', 'Private lessons in Gudauri', 'Calm, technique-focused coaching for first turns, confident carving and freeride preparation.', '/assets/design-2/card-mikhail.png', '/assets/design-3/hero-main.png', 'Mikhail Andreev on a ski slope', '/assets/design-3/avatar-booking.jpg', 8, 4.8, 6, 'Available this week', 'Verified Instructor', 345, 10),
  ('oleg', 'published', 'Oleg Yung', 'Snowboard · Freeride specialist', 'Freeride and snowboard lessons', 'Mountain-focused coaching for riders who want stronger technique, control and confidence away from groomed pistes.', '/assets/design-2/card-oleg.png', '/assets/design-2/card-oleg.png', 'Oleg Yung snowboarding in Gudauri', '/assets/design-2/card-oleg.png', 7, 4.8, 6, 'Available this week', 'Verified Instructor', 345, 20),
  ('alex-red', 'published', 'Alex Red', 'Ski · Beginner-friendly lessons', 'Friendly ski lessons in Gudauri', 'Clear and supportive lessons for first-time skiers and guests building confidence on blue slopes.', '/assets/design-2/card-red-ski.png', '/assets/design-2/card-red-ski.png', 'Alex Red skiing in Gudauri', '/assets/design-2/card-red-ski.png', 6, 4.8, 6, 'Available this week', 'Verified Instructor', 345, 30),
  ('andrey', 'published', 'Andrey Gregorev', 'Ski & snowboard · Kids and families', 'Family lessons in Gudauri', 'Patient ski and snowboard coaching designed around children, parents and mixed-level family groups.', '/assets/design-2/card-andrey.png', '/assets/design-2/card-andrey.png', 'Andrey Gregorev teaching in Gudauri', '/assets/design-2/card-andrey.png', 9, 4.8, 6, 'Limited availability', 'Verified Instructor', 345, 40),
  ('nino', 'published', 'Nino Beridze', 'Ski · Technique and confidence', 'Technique-focused ski coaching', 'Structured lessons for guests who want smoother turns, better balance and more confidence across the mountain.', '/assets/design-2/card-mikhail.png', '/assets/design-3/hero-main.png', 'Nino Beridze on a Gudauri ski slope', '/assets/design-3/avatar-booking.jpg', 8, 4.9, 11, 'Available this week', 'Verified Instructor', 345, 50),
  ('giorgi', 'published', 'Giorgi Maisuradze', 'Snowboard · All levels welcome', 'Snowboard lessons for every level', 'Progressive snowboard coaching from first turns to confident riding on steeper Gudauri terrain.', '/assets/design-2/card-oleg.png', '/assets/design-2/card-oleg.png', 'Giorgi Maisuradze snowboarding in Gudauri', '/assets/design-2/card-oleg.png', 6, 4.8, 8, 'Available this week', 'Verified Instructor', 345, 60),
  ('levan', 'published', 'Levan Kapanadze', 'Ski & snowboard · Private lessons', 'Private mountain coaching', 'Flexible private lessons shaped around your pace, goals and preferred mix of ski or snowboard practice.', '/assets/design-2/card-red-ski.png', '/assets/design-2/card-red-ski.png', 'Levan Kapanadze teaching in Gudauri', '/assets/design-2/card-red-ski.png', 10, 4.9, 14, 'Limited availability', 'Verified Instructor', 345, 70),
  ('mari', 'published', 'Mari Gelashvili', 'Ski · First-time and family lessons', 'Relaxed ski lessons for families', 'Warm, confidence-building instruction for beginners, children and families discovering Gudauri together.', '/assets/design-2/card-andrey.png', '/assets/design-2/card-andrey.png', 'Mari Gelashvili teaching a ski lesson', '/assets/design-2/card-andrey.png', 7, 5.0, 9, 'Available this week', 'Verified Instructor', 345, 80);

INSERT INTO instructor_disciplines (instructor_id, discipline_id, sort_order)
SELECT i.id, d.id, 1 FROM instructors i JOIN disciplines d ON d.slug = 'snowboard' WHERE i.slug IN ('mikhail', 'oleg', 'andrey', 'giorgi', 'levan');
INSERT INTO instructor_disciplines (instructor_id, discipline_id, sort_order)
SELECT i.id, d.id, 2 FROM instructors i JOIN disciplines d ON d.slug = 'ski' WHERE i.slug IN ('mikhail', 'alex-red', 'andrey', 'nino', 'levan', 'mari');

INSERT INTO instructor_languages (instructor_id, language_id, sort_order)
SELECT i.id, l.id, 1 FROM instructors i JOIN languages l ON l.code = 'Ge';
INSERT INTO instructor_languages (instructor_id, language_id, sort_order)
SELECT i.id, l.id, 2 FROM instructors i JOIN languages l ON l.code = 'En';
INSERT INTO instructor_languages (instructor_id, language_id, sort_order)
SELECT i.id, l.id, 3 FROM instructors i JOIN languages l ON l.code = 'Ru' WHERE i.slug IN ('mikhail', 'nino', 'mari');

INSERT INTO instructor_about (instructor_id, body, sort_order)
SELECT id, 'I am a certified local instructor with extensive teaching experience in Gudauri. I work with adults, teenagers and families who want to feel confident and in control on the mountain.', 1 FROM instructors;
INSERT INTO instructor_about (instructor_id, body, sort_order)
SELECT id, 'Lessons are structured around clear explanations, practical exercises and steady progress. Safety, comfort and good technique remain the priority at every stage.', 2 FROM instructors;
INSERT INTO instructor_about (instructor_id, body, sort_order)
SELECT id, 'Every session is adapted to your current level, pace and goals, from first turns to stronger carving and more confident all-mountain riding.', 3 FROM instructors;

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Beginners', 1 FROM instructors;
INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Intermediate', 2 FROM instructors;
INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Private lessons', 3 FROM instructors;
INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Confidence training', 4 FROM instructors;

INSERT INTO instructor_tags (instructor_id, label, sort_order) SELECT id, 'Technique', 10 FROM instructors WHERE slug IN ('mikhail', 'oleg', 'nino', 'levan');
INSERT INTO instructor_tags (instructor_id, label, sort_order) SELECT id, 'Carving', 11 FROM instructors WHERE slug IN ('mikhail', 'nino');
INSERT INTO instructor_tags (instructor_id, label, sort_order) SELECT id, 'Freeride', 11 FROM instructors WHERE slug IN ('oleg', 'levan');
INSERT INTO instructor_tags (instructor_id, label, sort_order) SELECT id, 'First lessons', 10 FROM instructors WHERE slug IN ('alex-red', 'andrey', 'giorgi', 'mari');
INSERT INTO instructor_tags (instructor_id, label, sort_order) SELECT id, 'Kids & families', 11 FROM instructors WHERE slug IN ('andrey', 'mari');
INSERT INTO instructor_tags (instructor_id, label, sort_order) SELECT id, 'Kids lessons', 11 FROM instructors WHERE slug IN ('alex-red', 'giorgi');
INSERT INTO instructor_tags (instructor_id, label, sort_order) SELECT id, 'Freestyle', 12 FROM instructors WHERE slug = 'giorgi';

INSERT INTO instructor_media (instructor_id, media_type, url, alt, sort_order, is_featured)
SELECT id, 'image', '/assets/design-3/hero-main.png', 'Instructor on a Gudauri ski slope', 0, 1 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_media (instructor_id, media_type, url, alt, sort_order) SELECT id, 'image', '/assets/design-3/media-1.jpg', 'Snowboard students on a slope', 1 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_media (instructor_id, media_type, url, alt, sort_order) SELECT id, 'image', '/assets/design-3/media-2.jpg', 'Two riders resting in snow', 2 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_media (instructor_id, media_type, url, alt, sort_order) SELECT id, 'image', '/assets/design-3/media-3.jpg', 'Child snowboard student', 3 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_media (instructor_id, media_type, url, alt, sort_order) SELECT id, 'image', '/assets/design-3/media-4.jpg', 'Snowboard lesson moment', 4 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_media (instructor_id, media_type, url, alt, sort_order) SELECT id, 'image', '/assets/design-3/media-5.jpg', 'Kids ski group', 5 FROM instructors WHERE slug = 'mikhail';

INSERT INTO instructor_reviews (instructor_id, author_name, lesson_label, rating, review_date, body, avatar_url, avatar_position, sort_order)
SELECT id, 'Karla Lynn', '2 hour lesson', 5, '2025-08-18', 'Mikhail helped me go from complete beginner to confidently skiing blue slopes in just a few days.', '/assets/design-3/avatars-sprite.png', 1, 1 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_reviews (instructor_id, author_name, lesson_label, rating, review_date, body, avatar_url, avatar_position, sort_order)
SELECT id, 'Marina Ivanova', '8 hour lesson', 5, '2025-08-11', 'Very patient and professional. Every explanation was clear and the lesson felt adapted to my pace.', '/assets/design-3/avatars-sprite.png', 2, 2 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_reviews (instructor_id, author_name, lesson_label, rating, review_date, body, avatar_url, avatar_position, sort_order)
SELECT id, 'Daniel Moore', '4 hour lesson', 5, '2025-03-07', 'A calm instructor with a strong eye for technique. I made visible progress during a single morning.', '/assets/design-3/avatars-sprite.png', 3, 3 FROM instructors WHERE slug = 'mikhail';
INSERT INTO instructor_reviews (instructor_id, author_name, lesson_label, rating, review_date, body, avatar_url, avatar_position, sort_order)
SELECT id, 'Sofia Klein', '6 hour lesson', 4, '2025-02-22', 'Great balance of challenge and support, with practical exercises I could repeat on my own.', '/assets/design-3/avatars-sprite.png', 4, 4 FROM instructors WHERE slug = 'mikhail';
