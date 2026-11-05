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
