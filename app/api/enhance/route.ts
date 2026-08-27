import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  apiKey: z.string().trim().min(20).max(256),
  markdown: z.string().min(1).max(100_000),
});

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Provide a valid API key and a document smaller than 100 KB." }, { status: 400 });
    const { apiKey, markdown } = parsed.data;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent", {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Improve this project document while preserving its headings and factual stack choices. Return Markdown only. Add concrete, testable detail. Do not invent benchmarks, compliance status, or guarantees." }] },
        contents: [{ role: "user", parts: [{ text: markdown }] }],
        generationConfig: { maxOutputTokens: 8192, temperature: 0.3 },
      }),
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message ?? `Gemini request failed (${response.status}).` }, { status: response.status });
    const enhanced = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim();
    if (!enhanced) return NextResponse.json({ error: "Gemini returned no text. A safety policy may have blocked the request." }, { status: 502 });
    return NextResponse.json({ markdown: enhanced }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "Gemini timed out after 60 seconds." : "The enhancement request could not be completed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
