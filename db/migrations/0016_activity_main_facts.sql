PRAGMA foreign_keys = ON;

DELETE FROM activity_facts
WHERE activity_id IN (
  SELECT id FROM activities WHERE slug IN (
    'kazbegi-gergeti', 'snowmobile-plateau', 'paragliding-gudauri',
    'heli-ski', 'freeride-day', 'gastro-route',
    'aragveti-ski-tour', 'dedaena-ski-tour', 'miketi-ski-tour'
  )
);

INSERT INTO activity_facts (activity_id, label, value, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Duration', '8 hours', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Difficulty', 'Easy', 1), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Route', 'Gudauri → Kazbegi', 2), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Highlights', 'Gergeti & valley', 3),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Duration', '2 hours', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Difficulty', 'Easy', 1), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Terrain', 'Snow plateau', 2), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Ride type', 'Guided', 3),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Flight time', '15–25 min', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Difficulty', 'Easy', 1), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Take-off', 'Gudauri', 2), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Vertical', 'Up to 1,000 m', 3),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Duration', 'Full day', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Difficulty', 'Expert', 1), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Runs', '3–5', 2), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Terrain', 'Backcountry', 3),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Duration', '6 hours', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Difficulty', 'Intermediate+', 1), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Vertical', 'Up to 1,000 m', 2), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Terrain', 'Off-piste', 3),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Duration', '5 hours', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Difficulty', 'Easy', 1), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Stops', '3 local venues', 2), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Tastings', 'Food & wine', 3),
  ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Duration', '6–7 hours', 0), ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Difficulty', 'Advanced', 1), ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Vertical gain', 'Up to 1,000 m', 2), ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Ascent', '3–4 hours', 3),
  ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Duration', '7–8 hours', 0), ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Difficulty', 'Advanced', 1), ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Vertical gain', 'Up to 1,200 m', 2), ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Ascent', '4–5 hours', 3),
  ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Duration', '6–7 hours', 0), ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Difficulty', 'Advanced', 1), ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Vertical gain', 'Up to 1,000 m', 2), ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Ascent', '3–4 hours', 3);
