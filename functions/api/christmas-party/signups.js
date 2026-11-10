// GET    /api/christmas-party/signups        — public list: who's coming and what they're bringing
//                                              (with admin key: full rows incl. id and timestamp)
// POST   /api/christmas-party/signups        — add an RSVP
// DELETE /api/christmas-party/signups?id=N   — admin: remove an RSVP
// Admin requests need `Authorization: Bearer <CHRISTMAS_ADMIN_KEY>` (a Pages secret).

// Older RSVPs only had a callsign, so fall back to it when name is empty.
const DISPLAY_NAME = "COALESCE(NULLIF(name, ''), callsign)";

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const bringing = String(body.bringing_item || "").trim();
  const numPeople = parseInt(body.num_people, 10);

  if (!name) {
    return Response.json({ error: "Name or callsign is required" }, { status: 400 });
  }
  if (name.length > 80) {
    return Response.json({ error: "Name is too long" }, { status: 400 });
  }
  if (bringing.length > 300) {
    return Response.json({ error: "\"What are you bringing\" is too long" }, { status: 400 });
  }
  if (isNaN(numPeople) || numPeople < 1 || numPeople > 20) {
    return Response.json({ error: "Number of people must be between 1 and 20" }, { status: 400 });
  }

  await env.db.prepare(
    "INSERT INTO christmas_party_signups (name, callsign, num_people, bringing_item) VALUES (?, '', ?, ?)"
  ).bind(name, numPeople, bringing).run();

  return Response.json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  if (request.headers.has("Authorization")) {
    const denied = await checkAdmin(request, env);
    if (denied) return denied;

    const { results } = await env.db.prepare(
      `SELECT id, ${DISPLAY_NAME} AS name, num_people, bringing_item, created_at
       FROM christmas_party_signups ORDER BY created_at, id`
    ).all();
    return Response.json(results, { headers: { "Cache-Control": "no-store" } });
  }

  const { results } = await env.db.prepare(
    `SELECT ${DISPLAY_NAME} AS name, num_people, bringing_item
     FROM christmas_party_signups ORDER BY created_at, id`
  ).all();
  return Response.json(results, { headers: { "Cache-Control": "no-store" } });
}

export async function onRequestDelete({ request, env }) {
  const denied = await checkAdmin(request, env);
  if (denied) return denied;

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  await env.db.prepare("DELETE FROM christmas_party_signups WHERE id = ?").bind(id).run();
  return Response.json({ ok: true });
}

async function checkAdmin(request, env) {
  if (!env.CHRISTMAS_ADMIN_KEY) {
    return Response.json({ error: "Admin access is not configured (CHRISTMAS_ADMIN_KEY missing)." }, { status: 503 });
  }
  const header = request.headers.get("Authorization") || "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!(await safeEqual(given, env.CHRISTMAS_ADMIN_KEY))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// Constant-time comparison; hashing first makes both sides the same length.
async function safeEqual(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}
