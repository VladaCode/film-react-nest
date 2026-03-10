-- Creates tables for the Film project in PostgreSQL
CREATE TABLE IF NOT EXISTS films (
  id VARCHAR(64) PRIMARY KEY,
  rating REAL NOT NULL,
  director TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  image TEXT NOT NULL,
  cover TEXT NOT NULL,
  title TEXT NOT NULL,
  about TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id VARCHAR(64) PRIMARY KEY,
  film_id VARCHAR(64) NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  daytime TIMESTAMPTZ NOT NULL,
  hall INTEGER NOT NULL,
  rows INTEGER NOT NULL,
  seats INTEGER NOT NULL,
  price INTEGER NOT NULL,
  taken TEXT[] NOT NULL DEFAULT '{}'::text[]
);

CREATE INDEX IF NOT EXISTS idx_schedules_film_id ON schedules(film_id);
CREATE INDEX IF NOT EXISTS idx_schedules_daytime ON schedules(daytime);
