-- Christmas party: add "name or callsign" and "what are you bringing" (potluck sign-up).
-- Run once: npx wrangler d1 execute w4trc-forms --remote --file=migrations/2026-11-christmas-party-potluck.sql
ALTER TABLE christmas_party_signups ADD COLUMN name TEXT NOT NULL DEFAULT '';
ALTER TABLE christmas_party_signups ADD COLUMN bringing_item TEXT NOT NULL DEFAULT '';
