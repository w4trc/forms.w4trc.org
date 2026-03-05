CREATE TABLE IF NOT EXISTS w1aw_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time_slot TEXT NOT NULL,
  name TEXT NOT NULL,
  callsign TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
