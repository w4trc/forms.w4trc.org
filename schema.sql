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
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
