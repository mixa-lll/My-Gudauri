ALTER TABLE instructors
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));

UPDATE instructors SET gender = 'female' WHERE slug IN ('nino', 'mari');
UPDATE instructors SET gender = 'male' WHERE gender IS NULL;
