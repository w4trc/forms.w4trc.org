import { sanitizeAnswers, CONTACT_FIELDS } from '../../../public/survey-questions.js';

// POST   /api/survey/responses        — public: submit a survey response
// GET    /api/survey/responses        — admin: list all responses
// DELETE /api/survey/responses?id=N   — admin: delete a response (spam cleanup)
//
// Admin requests need `Authorization: Bearer <SURVEY_ADMIN_KEY>`.
// Set SURVEY_ADMIN_KEY as a secret in Cloudflare Pages → Settings → Variables.

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field.
  if (body.website) return Response.json({ ok: true });

  const answers = sanitizeAnswers(body.answers);

  const contact = {};
  for (const f of CONTACT_FIELDS) {
    const v = typeof body[f.id] === 'string' ? body[f.id].trim().slice(0, f.max) : '';
    contact[f.id] = v || null;
  }
  if (contact.callsign) contact.callsign = contact.callsign.toUpperCase();

  const hasContact = CONTACT_FIELDS.some(f => contact[f.id]);
  if (!Object.keys(answers).length && !hasContact) {
    return Response.json({ error: 'Please answer at least one question.' }, { status: 400 });
  }

  await env.db.prepare(
    `INSERT INTO survey_responses (name, callsign, email, phone, contact_ok, answers, created_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
  ).bind(
    contact.name,
    contact.callsign,
    contact.email,
    contact.phone,
    body.contact_ok && hasContact ? 1 : 0,
    JSON.stringify(answers)
  ).run();

  return Response.json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  const denied = await checkAdmin(request, env);
  if (denied) return denied;

  const { results } = await env.db.prepare(
    'SELECT id, name, callsign, email, phone, contact_ok, answers, created_at FROM survey_responses ORDER BY created_at DESC, id DESC'
  ).all();

  const rows = results.map(r => {
    let answers = {};
    try { answers = JSON.parse(r.answers); } catch {}
    return { ...r, answers };
  });

  return Response.json(rows, { headers: { 'Cache-Control': 'no-store' } });
}

export async function onRequestDelete({ request, env }) {
  const denied = await checkAdmin(request, env);
  if (denied) return denied;

  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: 'Invalid id' }, { status: 400 });
  }

  await env.db.prepare('DELETE FROM survey_responses WHERE id = ?').bind(id).run();
  return Response.json({ ok: true });
}

async function checkAdmin(request, env) {
  if (!env.SURVEY_ADMIN_KEY) {
    return Response.json({ error: 'Admin access is not configured (SURVEY_ADMIN_KEY missing).' }, { status: 503 });
  }
  const header = request.headers.get('Authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!(await safeEqual(given, env.SURVEY_ADMIN_KEY))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// Constant-time comparison; hashing first makes both sides the same length.
async function safeEqual(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}
