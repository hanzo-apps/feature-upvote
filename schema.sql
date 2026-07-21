-- Upvote — Hanzo Base schema (the `databaseSchema` DDL).
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- id/created/updated/owner/org itself, so they are never re-declared here; every
-- row is stamped with the verified IAM owner+org and is org-scoped — the access
-- rule is `@request.auth.org_id = org`, so a member of your org reads/writes a
-- row and other orgs never see it. Your team shares one board.
--
-- Keep this file in lockstep with what the app reads/writes (src/views/*).

-- A feature request on the board.
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',   -- open | planned | shipped
  votes INTEGER NOT NULL DEFAULT 0,      -- denormalized upvote counter (kept in lockstep with `votes`)
  author_name TEXT NOT NULL DEFAULT ''
);

-- One principal's upvote on a request — enforces one vote per person + toggling.
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL,              -- the Base `requests` id this vote is for
  voter TEXT NOT NULL                    -- the IAM principal who cast it
);

-- Discussion under a request.
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL,              -- the Base `requests` id this comment is on
  body TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT ''
);
