export async function onRequestGet({ env }) {
  const result = await env.db.prepare(
    "SELECT id, name, callsign, num_people, potluck_item, created_at FROM field_day_signups ORDER BY created_at"
  ).all();

  return Response.json(result.results);
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, callsign, num_people, potluck_item } = body;

  if (!name || !callsign || !num_people) {
    return Response.json({ error: "Name, callsign, and number of people are required" }, { status: 400 });
  }

  const numPeople = parseInt(num_people, 10);
  if (isNaN(numPeople) || numPeople < 1 || numPeople > 20) {
    return Response.json({ error: "Number of people must be between 1 and 20" }, { status: 400 });
  }

  await env.db.prepare(
    "INSERT INTO field_day_signups (name, callsign, num_people, potluck_item, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
  ).bind(
    name.trim(),
    callsign.trim().toUpperCase(),
    numPeople,
    (potluck_item || '').trim()
  ).run();

  return Response.json({ ok: true });
}
