export async function onRequestPost({ request, env }) {
  const formData = await request.formData();

  const fields = Object.fromEntries(formData);

  const content = {
    username: "W4TRC Forms",
    embeds: [
      {
        title: "Silent Key Submission",
        color: 0x2b6cb0,
        fields: [
          { name: "Submitted By", value: `${fields.submitter_name} (${fields.submitter_email})` },
          { name: "Name", value: fields.sk_name },
          { name: "Callsign", value: fields.callsign || "—", inline: true },
          { name: "Born", value: fields.year_born || "—", inline: true },
          { name: "Passed", value: fields.year_passed || "—", inline: true },
          { name: "Description", value: fields.description || "—" },
          { name: "Obituary", value: fields.obituary_url || "—" }
        ]
      }
    ]
  };

  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content)
  });

  return new Response(
    "<h1>Thank you</h1><p>Your submission has been received.</p>",
    { headers: { "Content-Type": "text/html" } }
  );
}
