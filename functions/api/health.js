export async function onRequestGet({ env }) {
  try {
    await env.db.prepare("SELECT 1").first();
    return Response.json({ status: "ok", db: "ok", timestamp: new Date().toISOString() });
  } catch (err) {
    return Response.json(
      { status: "error", db: "error", message: err.message, timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}
