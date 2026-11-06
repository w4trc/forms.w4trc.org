export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const callsign = String(body.callsign || "").trim().toUpperCase();
  const numPeople = parseInt(body.num_people, 10);

  if (callsign && (callsign.length > 12 || !/^[A-Z0-9/]+$/.test(callsign))) {
    return Response.json({ error: "Invalid callsign" }, { status: 400 });
  }
  if (isNaN(numPeople) || numPeople < 1 || numPeople > 20) {
    return Response.json({ error: "Number of people must be between 1 and 20" }, { status: 400 });
  }

  await env.db.prepare(
    "INSERT INTO christmas_party_signups (callsign, num_people) VALUES (?, ?)"
  ).bind(callsign, numPeople).run();

  return Response.json({ ok: true });
}

// GET    /api/christmas-party/signups        — admin: list RSVPs
// DELETE /api/christmas-party/signups?id=N   — admin: remove an RSVP
// Admin requests need `Authorization: Bearer <CHRISTMAS_ADMIN_KEY>` (a Pages secret).

export async function onRequestGet({ request, env }) {
  const denied = await checkAdmin(request, env);
  if (denied) return denied;

  const { results } = await env.db.prepare(
    "SELECT id, callsign, num_people, created_at FROM christmas_party_signups ORDER BY created_at, id"
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
