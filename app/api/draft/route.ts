import { NextRequest } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { DRAFT_SYSTEM, DRAFT_USER, POLISH_SYSTEM, POLISH_USER } from "@/lib/prompts";
import { errorResponse } from "@/lib/api-errors";
import { checkDemoLimit } from "@/lib/rate-limit";
import type { DraftMode } from "@/lib/types";
import { CLAUDE_MODEL, DEMO_TEXT_LIMIT } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const clientKey = req.headers.get("x-api-key");
    const apiKey = clientKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isDemo = !clientKey;
    let demoRemaining: number | undefined;

    if (isDemo) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const limit = await checkDemoLimit(ip);
      demoRemaining = limit.remaining;
      if (!limit.allowed) {
        return new Response(
          JSON.stringify({ error: "Demo limit reached — enter your own API key to continue", code: "demo_limit" }),
          { status: 429, headers: { "Content-Type": "application/json", "X-Demo-Remaining": "0" } }
        );
      }
    }

    const { text, direction, mode = "draft" } = await req.json();
    const draftMode = mode as DraftMode;

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (isDemo && text.length > DEMO_TEXT_LIMIT) {
      return new Response(
        JSON.stringify({ error: `Demo mode limits text to ${DEMO_TEXT_LIMIT} characters` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const isPolish = draftMode === "polish";
    const provider = createAnthropic({ apiKey });

    const result = streamText({
      model: provider(CLAUDE_MODEL),
      system: isPolish ? POLISH_SYSTEM : DRAFT_SYSTEM,
      prompt: isPolish ? POLISH_USER(text, direction) : DRAFT_USER(text, direction),
      temperature: isPolish ? 0.3 : 0.6,
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

    const headers: Record<string, string> = { "Content-Type": "text/plain; charset=utf-8" };
    if (isDemo && demoRemaining !== undefined) {
      headers["X-Demo-Remaining"] = String(demoRemaining);
    }

    return new Response(stream, { headers });
  } catch (err) {
    console.error("Draft API error");
    return errorResponse(err);
  }
}
