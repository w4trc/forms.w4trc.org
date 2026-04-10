export async function onRequestGet({ env }) {
  const result = await env.db.prepare(
    "SELECT id, name, callsign, suggested_datetime, comments, created_at FROM net_suggestions ORDER BY created_at DESC"
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

  const { name, callsign, suggested_datetime, comments } = body;

  if (!name && !callsign) {
    return Response.json({ error: "Please provide at least a name or call sign" }, { status: 400 });
  }

  if (!suggested_datetime) {
    return Response.json({ error: "Suggested date and time is required" }, { status: 400 });
  }

  await env.db.prepare(
    "INSERT INTO net_suggestions (name, callsign, suggested_datetime, comments) VALUES (?, ?, ?, ?)"
  ).bind(
    name ? name.trim() : null,
    callsign ? callsign.trim().toUpperCase() : null,
    suggested_datetime,
    comments ? comments.trim() : null
  ).run();

  return Response.json({ ok: true });
}
