PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS activity_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  context_label TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_date TEXT NOT NULL,
  body TEXT NOT NULL,
  avatar_url TEXT,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_activity_reviews_public
  ON activity_reviews(activity_id, is_published, sort_order, id);

INSERT INTO activity_reviews (activity_id, author_name, context_label, rating, review_date, body, is_published, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Maya K.', 'Kazbegi day tour', 5, '2026-02-18', 'A beautiful route with enough time at every stop. The guide explained the history clearly and never rushed the group.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Daniel R.', 'Private excursion', 5, '2026-03-07', 'The views were exceptional and the transfer was comfortable. Gergeti was the highlight of our week in Georgia.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Alex M.', 'Snowmobile tour', 5, '2026-01-24', 'Clear briefing, warm equipment and a spectacular route across the plateau. It felt exciting and well organised.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Nino G.', 'Couples ride', 5, '2026-02-11', 'Our guide chose a comfortable pace and stopped at the best viewpoints for photos.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Sophie L.', 'Tandem flight', 5, '2026-02-03', 'The pilot made everything feel calm and safe. The flight over the valley was unforgettable.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Omar H.', 'Paragliding', 5, '2026-03-12', 'Communication was easy, the weather window was chosen carefully and the video arrived the same day.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Mark T.', 'Heli-ski day', 5, '2026-02-22', 'Professional safety checks, excellent terrain choices and a guide who understood the level of the group.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Eva S.', 'Advanced ski day', 5, '2026-03-02', 'A demanding but very rewarding day. Every run was selected according to the snow and visibility.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Tom B.', 'Aragveti ski tour', 5, '2026-02-14', 'A steady ascent, clear route decisions and a long descent in excellent snow. The pace was just right.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Irina P.', 'Guided ski tour', 5, '2026-03-16', 'The guide explained the terrain and avalanche decisions throughout the route, which made the day both useful and enjoyable.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Luca F.', 'Dedaena ski tour', 5, '2026-02-27', 'A scenic route with a well-managed pace and plenty of time to enjoy the summit.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Anna V.', 'Ski touring', 5, '2026-03-19', 'Good communication before the tour and thoughtful adjustments when the weather changed.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'James W.', 'Miketi ski tour', 5, '2026-01-30', 'A rewarding tour with varied terrain. The guide kept the group together without making the day feel slow.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Elena D.', 'Private ski tour', 5, '2026-03-05', 'Everything from the meeting point to the final descent was organised clearly.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Chris N.', 'Freeride discovery day', 5, '2026-02-09', 'The guide found good snow and explained every terrain choice. I finished the day feeling much more confident off piste.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Maria A.', 'Guided freeride', 5, '2026-03-10', 'A great balance of coaching and riding. The route matched our level and the safety briefing was practical.', 1, 1),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Julia C.', 'Food and wine tour', 5, '2026-02-16', 'Warm hosts, generous tastings and stories that made every dish more meaningful.', 1, 0),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Peter J.', 'Private gastro route', 5, '2026-03-21', 'A relaxed afternoon with excellent food and a comfortable return transfer to Gudauri.', 1, 1);
