PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS activity_excluded (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS activity_equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS activity_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  time_label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_activity_excluded_activity ON activity_excluded(activity_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_equipment_activity ON activity_equipment(activity_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_schedule_activity ON activity_schedule(activity_id, sort_order);

INSERT INTO activity_excluded (activity_id, label, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Lunch and personal snacks', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Personal travel insurance', 1),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Hotel transfer', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Personal travel insurance', 1),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Hotel transfer', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Personal travel insurance', 1),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Ski or snowboard rental', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Personal travel insurance', 1),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Lift pass', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Ski or snowboard rental', 1),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Personal purchases', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Additional alcohol beyond the tastings', 1);

INSERT INTO activity_equipment (activity_id, label, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Warm waterproof layers', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Comfortable winter boots', 1), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Water and personal snacks', 2),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Warm waterproof layers', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Gloves and neck warmer', 1), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Warm boots', 2),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Warm windproof jacket', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Sunglasses or goggles', 1), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Closed winter shoes', 2),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Avalanche-ready ski or snowboard setup', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Helmet and goggles', 1), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Small avalanche backpack', 2),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Ski or snowboard equipment', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Helmet and goggles', 1), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Waterproof layers and gloves', 2),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Warm layers for short outdoor stops', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Comfortable walking shoes', 1), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Water bottle', 2);

INSERT INTO activity_schedule (activity_id, time_label, title, description, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), '09:00', 'Meet in Gudauri', 'Meet your guide and start through the Terek valley.', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), '11:30', 'Gergeti viewpoint', 'Explore the church and panoramic mountain views.', 1), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), '16:30', 'Return to Gudauri', 'Drop-off after the final scenic stops.', 2),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), '10:00', 'Briefing and helmet fitting', 'Meet the guide and learn the controls.', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), '10:30', 'Plateau ride', 'Guided ride with photo stops above Gudauri.', 1), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), '12:00', 'Return to base', 'Finish and hand back the equipment.', 2),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'On confirmation', 'Weather and meeting check', 'The pilot confirms the take-off window.', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'At take-off', 'Safety briefing', 'Harness fitting and a short flight introduction.', 1), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), '15–25 min', 'Tandem flight', 'Land with the pilot and collect your video.', 2),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), '08:00', 'Safety briefing', 'Meet the guide, check weather and avalanche equipment.', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), '09:00', 'Helicopter drops', 'Select lines according to snow and group level.', 1), ((SELECT id FROM activities WHERE slug = 'heli-ski'), '16:00', 'Return to Gudauri', 'Debrief after the final run.', 2),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), '09:00', 'Meet your guide', 'Review conditions, equipment and the plan.', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), '10:00', 'Freeride session', 'Progress through terrain selected for the group.', 1), ((SELECT id FROM activities WHERE slug = 'freeride-day'), '15:00', 'Debrief and return', 'Wrap up the day back in Gudauri.', 2),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), '11:00', 'Meet your host', 'Start with a transfer to the first family kitchen.', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), '12:30', 'Regional tastings', 'Try local dishes and mountain wine.', 1), ((SELECT id FROM activities WHERE slug = 'gastro-route'), '16:00', 'Return to Gudauri', 'Drop-off after the final stop.', 2);
