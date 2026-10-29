CREATE TABLE IF NOT EXISTS w1aw_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time_slot TEXT NOT NULL,
  name TEXT NOT NULL,
  callsign TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS field_day_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  callsign TEXT NOT NULL,
  num_people INTEGER NOT NULL DEFAULT 1,
  potluck_item TEXT NOT NULL DEFAULT '',
  created_at TEXT
);
  
CREATE TABLE IF NOT EXISTS picnic_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  callsign TEXT NOT NULL DEFAULT '',
  num_people INTEGER NOT NULL DEFAULT 1,
  bringing_item TEXT NOT NULL DEFAULT '',
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS net_suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  callsign TEXT,
  suggested_datetime TEXT NOT NULL,
  comments TEXT,
  willing_net_control INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Membership Survey. Contact fields are optional (anonymous responses leave them NULL).
-- `answers` is a JSON object keyed by question id from public/survey-questions.js.
CREATE TABLE IF NOT EXISTS survey_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  callsign TEXT,
  email TEXT,
  phone TEXT,
  contact_ok INTEGER NOT NULL DEFAULT 0,
  answers TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
