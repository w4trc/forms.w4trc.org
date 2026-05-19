export async function onRequestPost({ request, env }) {
  const formData = await request.formData();

  const callsign = formData.get('callsign') || '—';
  const name     = formData.get('name')     || '—';
  const email    = formData.get('email')    || '—';
  const licensed = formData.get('licensed') || '—';
  const story    = formData.get('story')    || '—';
  const fun_fact = formData.get('fun_fact') || '—';
  const memorable = formData.get('memorable') || '—';
  const photo    = formData.get('photo');

  const embed = {
    title: `Member Spotlight — ${callsign}`,
    color: 0xf59e0b,
    fields: [
      { name: 'Name',           value: name,      inline: true },
      { name: 'Callsign',       value: callsign,  inline: true },
      { name: 'Email',          value: email },
      { name: 'Licensed Since', value: licensed },
      { name: 'Their Story',    value: story.slice(0, 1024) },
      { name: 'Fun Fact',       value: fun_fact.slice(0, 1024) },
      { name: 'Most Memorable Radio Experience', value: memorable.slice(0, 1024) },
    ],
  };

  const payload = { username: 'W4TRC Forms', embeds: [embed] };

  if (photo && photo.size > 0) {
    const discordForm = new FormData();
    discordForm.append('payload_json', JSON.stringify(payload));
    discordForm.append('files[0]', photo, photo.name || 'photo.jpg');

    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      body: discordForm,
    });
  } else {
    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  return Response.redirect(new URL('/thank-you.html', request.url), 303);
}
