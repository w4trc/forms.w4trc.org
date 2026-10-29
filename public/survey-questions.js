// Membership Survey question definitions.
// Shared by the survey form, the admin view, and the server-side validator
// (functions/api/survey/responses.js). Answers are stored as JSON, so adding,
// removing, or rewording questions here needs no database migration.
// Avoid renaming an existing `id` once responses are coming in — old answers
// are keyed by it.
//
// Question types:
//   radio    – pick one. `other: true` adds a free-text "Other" box.
//   checkbox – pick any. `other: true` adds a free-text "Other" box.
//   scale    – a grid of `items`, each rated on `scale` (stored as the index).
//   text     – free-form textarea.

export const INTEREST_SCALE = ['Not interested', 'Somewhat interested', 'Very interested'];

export const SECTIONS = [
  {
    id: 'about',
    title: 'About You',
    questions: [
      {
        id: 'age_range',
        type: 'radio',
        label: 'Age range',
        options: ['Under 18', '18–29', '30–44', '45–59', '60–74', '75+', 'Prefer not to say'],
      },
      {
        id: 'license_class',
        type: 'radio',
        label: 'License class',
        options: ['None', 'Technician', 'General', 'Extra', 'Other'],
        other: true,
      },
      {
        id: 'years_licensed',
        type: 'radio',
        label: 'How long have you been licensed?',
        options: ['Not licensed yet', 'Less than 1 year', '1–5 years', '6–15 years', '16–30 years', 'More than 30 years'],
      },
      {
        id: 'license_goal',
        type: 'radio',
        label: 'Are you working toward a new license or an upgrade?',
        options: ['Yes – Technician', 'Yes – General', 'Yes – Extra', 'Maybe someday', 'No'],
      },
      {
        id: 'membership_status',
        type: 'radio',
        label: 'Your connection to KARC',
        options: ['Current member', 'Former member', 'Not a member yet, but interested', 'Just curious'],
      },
    ],
  },
  {
    id: 'interests',
    title: 'Interests',
    intro: 'How interested are you in each of these? This helps us plan meetings, presentations, and activities.',
    questions: [
      {
        id: 'interests',
        type: 'scale',
        label: 'Interest level',
        scale: INTEREST_SCALE,
        items: [
          { id: 'mesh', label: 'Meshtastic / MeshCore (off-grid mesh networks)' },
          { id: 'digital', label: 'Digital modes (FT8, JS8Call, Winlink, etc.)' },
          { id: 'dmr_dstar', label: 'Digital voice (DMR, D-STAR, System Fusion)' },
          { id: 'contesting', label: 'Contesting' },
          { id: 'fox_hunting', label: 'Fox hunting / direction finding' },
          { id: 'pota_sota', label: 'Parks / Summits on the Air (POTA / SOTA)' },
          { id: 'hf_dx', label: 'HF operating / DXing' },
          { id: 'cw', label: 'CW / Morse code' },
          { id: 'emcomm', label: 'Emergency communications (ARES / RACES / SKYWARN)' },
          { id: 'public_service', label: 'Public service events (races, parades, etc.)' },
          { id: 'satellites', label: 'Satellites / ISS contacts' },
          { id: 'antennas', label: 'Antenna building' },
          { id: 'homebrew', label: 'Kit building / homebrew / electronics' },
          { id: 'sdr', label: 'Software-defined radio (SDR)' },
          { id: 'computers', label: 'Raspberry Pi / Arduino / computers in radio' },
          { id: 'aprs', label: 'APRS' },
          { id: 'field_day', label: 'Field Day / portable operating' },
          { id: 'special_events', label: 'Special event stations' },
          { id: 'license_classes', label: 'License classes / upgrade study' },
          { id: 'youth_stem', label: 'Youth / STEM outreach' },
          { id: 'social', label: 'Social events (picnics, dinners, coffee meetups)' },
        ],
      },
      {
        id: 'interests_other',
        type: 'text',
        label: 'Anything else you’re into that we didn’t list?',
        rows: 2,
      },
    ],
  },
  {
    id: 'nets',
    title: 'Nets & Getting Involved',
    questions: [
      {
        id: 'net_participation',
        type: 'radio',
        label: 'How often do you check in to club nets?',
        options: ['Regularly', 'Occasionally', 'Rarely', 'Never', 'I didn’t know about them'],
      },
      {
        id: 'net_barriers',
        type: 'checkbox',
        label: 'What would help you check in more?',
        options: [
          'A different day or time',
          'Better signal / coverage where I am',
          'More interesting topics or a theme',
          'A reminder before the net',
          'Help setting up my radio',
          'More confidence on the air',
        ],
        other: true,
      },
      {
        id: 'volunteer',
        type: 'checkbox',
        label: 'Would you be interested in helping with any of these?',
        options: [
          'Serving as net control',
          'Starting or running a new net',
          'Giving a presentation at a meeting',
          'Field Day setup / operating',
          'Special event stations',
          'Public service events',
          'License classes / mentoring (Elmering)',
          'Repeater or technical projects',
          'Website / social media',
        ],
        other: true,
      },
    ],
  },
  {
    id: 'meetings',
    title: 'Meetings & Communication',
    questions: [
      {
        id: 'meeting_attendance',
        type: 'radio',
        label: 'How often do you attend club meetings?',
        options: ['Every meeting', 'Most meetings', 'Sometimes', 'Rarely', 'Never'],
      },
      {
        id: 'meeting_barriers',
        type: 'checkbox',
        label: 'What would help you attend more often?',
        options: [
          'A different day or time',
          'A virtual / hybrid option',
          'More interesting programs',
          'More hands-on activities',
          'More social time',
          'A different location',
        ],
        other: true,
      },
      {
        id: 'communication',
        type: 'checkbox',
        label: 'How do you prefer to hear about club news and events?',
        options: ['Email', 'Club website', 'Facebook', 'Discord', 'Text message', 'On-air announcements', 'At meetings'],
        other: true,
      },
    ],
  },
  {
    id: 'ideas',
    title: 'Your Ideas',
    questions: [
      {
        id: 'presentation_suggestions',
        type: 'text',
        label: 'Presentation suggestions',
        placeholder: 'Topics you’d like to see at a meeting, or a presentation you could give…',
      },
      {
        id: 'activity_suggestions',
        type: 'text',
        label: 'Activity suggestions',
        placeholder: 'Outings, build nights, operating events, contests, social events…',
      },
      {
        id: 'questions_comments',
        type: 'text',
        label: 'Questions / comments',
        placeholder: 'Anything you’d like the club officers to know or answer…',
      },
      {
        id: 'other_comments',
        type: 'text',
        label: 'Anything else?',
        placeholder: 'Any other thoughts about the club — what we’re doing well, or what we could do better.',
      },
    ],
  },
];

export const CONTACT_FIELDS = [
  { id: 'name', label: 'Name', placeholder: 'Jane Smith', max: 100 },
  { id: 'callsign', label: 'Call Sign', placeholder: 'W4XYZ', max: 20 },
  { id: 'email', label: 'Email', placeholder: 'you@example.com', max: 200, type: 'email' },
  { id: 'phone', label: 'Phone', placeholder: '(423) 555-0123', max: 30, type: 'tel' },
];

export const MAX_TEXT = 4000;
export const MAX_OTHER = 300;

export function allQuestions() {
  return SECTIONS.flatMap(s => s.questions);
}

// Validates and cleans a submitted answers object. Unknown keys and values that
// aren't valid options are dropped. Returns the cleaned object.
export function sanitizeAnswers(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

  for (const q of allQuestions()) {
    const v = raw[q.id];
    if (q.type === 'radio') {
      if (q.options.includes(v)) out[q.id] = v;
    } else if (q.type === 'checkbox') {
      if (Array.isArray(v)) {
        const picked = q.options.filter(o => v.includes(o));
        if (picked.length) out[q.id] = picked;
      }
    } else if (q.type === 'scale') {
      if (v && typeof v === 'object') {
        const grid = {};
        for (const item of q.items) {
          const n = v[item.id];
          if (Number.isInteger(n) && n >= 0 && n < q.scale.length) grid[item.id] = n;
        }
        if (Object.keys(grid).length) out[q.id] = grid;
      }
    } else if (q.type === 'text') {
      const t = str(v, MAX_TEXT);
      if (t) out[q.id] = t;
    }

    if (q.other) {
      const t = str(raw[q.id + '_other'], MAX_OTHER);
      if (t) out[q.id + '_other'] = t;
    }
  }
  return out;
}
