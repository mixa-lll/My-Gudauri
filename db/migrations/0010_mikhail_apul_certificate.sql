PRAGMA foreign_keys = ON;

DELETE FROM instructor_certifications
WHERE instructor_id = (SELECT id FROM instructors WHERE slug = 'mikhail')
  AND title = 'Verified Instructor'
  AND file_url IS NULL;

INSERT INTO instructor_certifications (instructor_id, title, level, file_url, sort_order)
SELECT
  id,
  'APUL D Snowboard Instructor Licence',
  '50-hour professional qualification · Issued 25 Feb 2025 · Valid until 25 Feb 2028',
  '/assets/design-3/certificates/mikhail-apul-d.jpg',
  0
FROM instructors
WHERE slug = 'mikhail'
  AND NOT EXISTS (
    SELECT 1
    FROM instructor_certifications certificate
    WHERE certificate.instructor_id = instructors.id
      AND certificate.file_url = '/assets/design-3/certificates/mikhail-apul-d.jpg'
  );
