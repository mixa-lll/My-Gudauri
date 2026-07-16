PRAGMA foreign_keys = ON;

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Technique', 10 FROM instructors i
WHERE slug IN ('mikhail', 'oleg', 'nino', 'levan')
  AND NOT EXISTS (SELECT 1 FROM instructor_tags t WHERE t.instructor_id = i.id AND t.label = 'Technique');

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Carving', 11 FROM instructors i
WHERE slug IN ('mikhail', 'nino')
  AND NOT EXISTS (SELECT 1 FROM instructor_tags t WHERE t.instructor_id = i.id AND t.label = 'Carving');

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Freeride', 11 FROM instructors i
WHERE slug IN ('oleg', 'levan')
  AND NOT EXISTS (SELECT 1 FROM instructor_tags t WHERE t.instructor_id = i.id AND t.label = 'Freeride');

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'First lessons', 10 FROM instructors i
WHERE slug IN ('alex-red', 'andrey', 'giorgi', 'mari')
  AND NOT EXISTS (SELECT 1 FROM instructor_tags t WHERE t.instructor_id = i.id AND t.label = 'First lessons');

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Kids & families', 11 FROM instructors i
WHERE slug IN ('andrey', 'mari')
  AND NOT EXISTS (SELECT 1 FROM instructor_tags t WHERE t.instructor_id = i.id AND t.label = 'Kids & families');

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Kids lessons', 11 FROM instructors i
WHERE slug IN ('alex-red', 'giorgi')
  AND NOT EXISTS (SELECT 1 FROM instructor_tags t WHERE t.instructor_id = i.id AND t.label = 'Kids lessons');

INSERT INTO instructor_tags (instructor_id, label, sort_order)
SELECT id, 'Freestyle', 12 FROM instructors i
WHERE slug = 'giorgi'
  AND NOT EXISTS (SELECT 1 FROM instructor_tags t WHERE t.instructor_id = i.id AND t.label = 'Freestyle');
