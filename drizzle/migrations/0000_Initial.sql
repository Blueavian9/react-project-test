-- drizzle/migrations/0000_initial.sql
-- Initial schema for HolisticBook (HIPAA-aligned: client_info & intake_responses will be encrypted strings)

CREATE TABLE practitioners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  settings JSON
);

CREATE TABLE availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  practitioner_id INTEGER NOT NULL REFERENCES practitioners(id),
  slots JSON
);

CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  practitioner_id INTEGER NOT NULL REFERENCES practitioners(id),
  client_info TEXT,              -- encrypted JSON string (HIPAA PHI)
  status TEXT DEFAULT 'pending',
  intake_responses JSON,         -- encrypted if containing PHI
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);