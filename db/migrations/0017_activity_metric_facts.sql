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
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Difficulty', '1', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Duration', '8 hours', 1), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Highest point', '2,395 m', 2), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Elevation change', '1,800 m', 3),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Difficulty', '2', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Duration', '2 hours', 1), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Highest point', '3,000 m', 2), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Elevation change', '700 m', 3),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Difficulty', '1', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Duration', '0.5 hour', 1), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Highest point', '3,000 m', 2), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Elevation change', '1,000 m', 3),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Difficulty', '5', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Duration', '7 hours', 1), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Highest point', '4,200 m', 2), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Elevation change', '2,000 m', 3),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Difficulty', '3', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Duration', '6 hours', 1), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Highest point', '3,300 m', 2), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Elevation change', '1,000 m', 3),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Difficulty', '1', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Duration', '5 hours', 1), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Highest point', '2,400 m', 2), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Elevation change', '400 m', 3),
  ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Difficulty', '4', 0), ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Duration', '6–7 hours', 1), ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Highest point', '3,250 m', 2), ((SELECT id FROM activities WHERE slug = 'aragveti-ski-tour'), 'Elevation change', '1,000 m', 3),
  ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Difficulty', '4', 0), ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Duration', '7–8 hours', 1), ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Highest point', '3,450 m', 2), ((SELECT id FROM activities WHERE slug = 'dedaena-ski-tour'), 'Elevation change', '1,200 m', 3),
  ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Difficulty', '4', 0), ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Duration', '6–7 hours', 1), ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Highest point', '3,300 m', 2), ((SELECT id FROM activities WHERE slug = 'miketi-ski-tour'), 'Elevation change', '1,000 m', 3);
