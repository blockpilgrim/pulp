import { NextRequest } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { DRAFT_SYSTEM, DRAFT_USER } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key") || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { text, direction } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const provider = createAnthropic({ apiKey });

    const result = streamText({
      model: provider("claude-sonnet-4-6"),
      system: DRAFT_SYSTEM,
      prompt: DRAFT_USER(text, direction),
      temperature: 0.6,
      maxOutputTokens: 4096,
    });

    // Explicitly construct a plain text stream from textStream
    // to avoid any protocol framing ambiguity
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.textStream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("401") || message.includes("authentication") || message.includes("invalid x-api-key")) {
      return new Response(JSON.stringify({ error: "Invalid API key", code: "auth_error" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (message.includes("429") || message.includes("rate")) {
      return new Response(JSON.stringify({ error: "Rate limited — try again in a moment", code: "rate_limit" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (message.includes("529") || message.includes("overloaded")) {
      return new Response(JSON.stringify({ error: "Anthropic is overloaded — try again shortly", code: "overloaded" }), {
        status: 529,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Draft API error");
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
