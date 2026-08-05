PRAGMA foreign_keys = ON;

-- Second half of the move started in 0022, deliberately a separate migration.
--
-- 0022 only adds: while it is applied, the previous release still reads the old
-- per-instructor columns and keeps serving. This one removes them, so it must
-- run only once the release that reads `collection_pricing` is live. Splitting
-- the two is what makes the change deployable without a window of 500s — and
-- reversible right up until this file runs.
--
-- What stays on the instructor is what genuinely differs between them: how large
-- a group this particular coach will take. Everything else is category-owned now,
-- and a stale copy is worse than no copy.
DROP TABLE IF EXISTS instructor_price_tiers;
ALTER TABLE instructors DROP COLUMN hourly_rate_gel;
ALTER TABLE instructors DROP COLUMN min_hours;
ALTER TABLE instructors DROP COLUMN max_hours;
ALTER TABLE instructors DROP COLUMN hours_step;
ALTER TABLE instructors DROP COLUMN default_hours;
ALTER TABLE instructors DROP COLUMN default_people;
ALTER TABLE instructors DROP COLUMN price_round_to;
