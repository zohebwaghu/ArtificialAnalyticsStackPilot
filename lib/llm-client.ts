export async function enhanceMarkdown(apiKey: string, markdown: string) {
  const response = await fetch("/api/enhance", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ apiKey, markdown }),
  });
  const data = await response.json() as { markdown?: string; error?: string };
  if (!response.ok) throw new Error(data.error ?? `Enhancement failed (${response.status}).`);
  if (!data.markdown) throw new Error("Gemini returned no text.");
  return data.markdown;
}
