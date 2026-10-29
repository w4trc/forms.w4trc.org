# forms.w4trc.org

Cloudflare Pages project for W4TRC form submissions. Static HTML in `public/`, server-side logic in `functions/`.

---

## Deployment

### Prerequisites
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated
- Account ID: `4b724b576c4285b15dfd8aa32fc83af7`

### First-time D1 Setup
Only needs to be done once. The database already exists; if starting fresh:

```bash
# Create the D1 database
wrangler d1 create w4trc-forms

# Apply the schema
wrangler d1 execute w4trc-forms --file=schema.sql --remote
```

Then go to **Cloudflare Dashboard → Pages → w4trc-forms → Settings → Functions → D1 database bindings** and add:
- Variable name: `db`
- Database: `w4trc-forms`

### Deploy
Push to `main` — Cloudflare Pages deploys automatically via Git integration.

### Local Development
```bash
wrangler pages dev public
```

To test from a phone on the same WiFi:
```bash
wrangler pages dev public --ip 0.0.0.0
```
Then open `http://<your-local-ip>:8788` on the phone. Find your IP with `ipconfig`.

---

## Forms

### Silent Key Submission — `/silent-key`
**File:** `public/silent-key.html`
**Handler:** `functions/api/submit.js`

A standard HTML form for submitting a silent key (deceased amateur radio operator) to be listed on the W4TRC website. On submission, the handler posts a Discord embed to the webhook configured in the `DISCORD_WEBHOOK_URL` environment variable, then redirects to `/thank-you.html`.

**Fields:**
- Submitter name + email
- Silent key name, callsign, year born, year passed
- Optional: short description, obituary link

**Environment variable required:** `DISCORD_WEBHOOK_URL` — set in Cloudflare Pages dashboard under Settings → Environment Variables.

---

### W1AW Operator Signup — `/w1aw`
**File:** `public/w1aw.html`
**Handler:** `functions/api/w1aw/signups.js`
**Database:** D1 — `w1aw_signups` table

An interactive signup sheet for W4TRC's W1AW/4 portable operation at Warriors Path State Park on June 13, 2026, as part of the ARRL America250 Worked All States event.

The page fetches and renders signups live via JavaScript (no page reloads). Clicking a time slot expands an inline form.

**Time slots:** 12:00 PM – 6:00 PM in 1-hour increments (6 slots)
**Limit:** 3 operators per slot, enforced both client- and server-side

**API endpoints:**
- `GET /api/w1aw/signups` — returns all signups as JSON
- `POST /api/w1aw/signups` — creates a signup; returns 409 if slot is full

**D1 schema (`schema.sql`):**
```sql
CREATE TABLE IF NOT EXISTS w1aw_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time_slot TEXT NOT NULL,
  name TEXT NOT NULL,
  callsign TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

**`time_slot` values:** `12pm`, `1pm`, `2pm`, `3pm`, `4pm`, `5pm`

---

### Annual Picnic Signup — `/picnic`
**File:** `public/picnic.html`
**Handler:** `functions/api/picnic/signups.js`
**Database:** D1 — `picnic_signups` table

An interactive potluck signup sheet for W4TRC's Annual Picnic at Eastman Recreation Area (date/time and shelter number TBD — placeholders are marked in `picnic.html`).

The page fetches and renders signups live via JavaScript (no page reloads). No email or notification is sent — it's just a public view of who's coming and what they're bringing.

**Fields:**
- Name (required)
- Callsign (optional)
- Number of people attending (required)
- What they're bringing (optional)

**API endpoints:**
- `GET /api/picnic/signups` — returns all signups as JSON
- `POST /api/picnic/signups` — creates a signup

**D1 schema (`schema.sql`):**
```sql
CREATE TABLE IF NOT EXISTS picnic_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  callsign TEXT NOT NULL DEFAULT '',
  num_people INTEGER NOT NULL DEFAULT 1,
  bringing_item TEXT NOT NULL DEFAULT '',
  created_at TEXT
);
```

---

### Membership Survey — `/survey` (admin: `/survey/admin`)
**Files:** `public/survey.html`, `public/survey/admin.html`, `public/survey-questions.js`
**Handler:** `functions/api/survey/responses.js`
**Database:** D1 — `survey_responses` table

An optional-anonymous membership survey: age range, license class, interest levels (Meshtastic/MeshCore, digital modes, contesting, fox hunting, POTA, etc.), net participation, volunteering, meetings, and free-form suggestions. Contact info is optional.

**Questions live in `public/survey-questions.js`** — shared by the form, the admin view, and server-side validation. Answers are stored as JSON, so adding or rewording questions needs no migration. Don't rename an existing question `id` once responses are coming in.

**Admin view** (`/survey/admin`) shows summary charts, an interest ranking, a contacts/volunteers list, all free-text suggestions, individual responses (with delete for spam), and CSV export. It's protected by a shared key.

**Secret required:** `SURVEY_ADMIN_KEY` — set in Cloudflare Pages → Settings → Variables and Secrets (as a secret). For local dev, put `SURVEY_ADMIN_KEY=...` in `.dev.vars` (gitignored).

**API endpoints:**
- `POST /api/survey/responses` — public; submit a response
- `GET /api/survey/responses` — admin; list responses (`Authorization: Bearer <key>`)
- `DELETE /api/survey/responses?id=N` — admin; delete a response

---

## Project Structure

```
public/
  silent-key.html     # Silent Key form
  w1aw.html           # W1AW operator signup
  field-day.html      # Field Day potluck signup
  picnic.html         # Annual Picnic potluck signup
  thank-you.html      # Redirect target after Silent Key submission
  styles.css          # Shared dark theme styles
  images/
    mountaintexture.png
    250am.png         # ARRL America250 WAS logo

functions/
  api/
    submit.js         # POST handler for Silent Key
    w1aw/
      signups.js      # GET + POST handler for W1AW signups
    field-day/
      signups.js      # GET + POST handler for Field Day signups
    picnic/
      signups.js      # GET + POST handler for Picnic signups

schema.sql            # D1 migration — run once with wrangler d1 execute
wrangler.toml         # Cloudflare config (account, D1 binding)
```
