export async function onRequestGet({ env }) {
  const result = await env.db.prepare(
    "SELECT id, time_slot, name, callsign, created_at FROM w1aw_signups ORDER BY time_slot, created_at"
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

  const { time_slot, name, callsign, email } = body;

  if (!time_slot || !name || !callsign || !email) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const validSlots = ["12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
  if (!validSlots.includes(time_slot)) {
    return Response.json({ error: "Invalid time slot" }, { status: 400 });
  }

  const { results: existing } = await env.db.prepare(
    "SELECT COUNT(*) AS count FROM w1aw_signups WHERE time_slot = ?"
  ).bind(time_slot).all();

  if (existing[0].count >= 3) {
    return Response.json({ error: "This time slot is full" }, { status: 409 });
  }

  await env.db.prepare(
    "INSERT INTO w1aw_signups (time_slot, name, callsign, email) VALUES (?, ?, ?, ?)"
  ).bind(time_slot, name.trim(), callsign.trim().toUpperCase(), email.trim()).run();

  return Response.json({ ok: true });
}
