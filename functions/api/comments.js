export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!message || !message.trim()) {
    return Response.json({ error: 'Message is required' }, { status: 400 });
  }

  const lines = [];
  if (name) lines.push(`From: ${name}${email ? ` <${email}>` : ''}`);
  else if (email) lines.push(`Email: ${email}`);
  else lines.push('Submitted anonymously');
  lines.push('', message.trim());

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'W4TRC Forms <noreply@w4trc.org>',
      to: ['contact@w4trc.org'],
      reply_to: email || undefined,
      subject: 'Comments & Suggestions — W4TRC',
      text: lines.join('\n'),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Resend error:', err);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
