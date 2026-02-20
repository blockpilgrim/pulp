import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { PULP_SYSTEM, PULP_USER } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key") || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    const { text, roundNumber, direction } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const provider = createAnthropic({ apiKey });

    const { text: response } = await generateText({
      model: provider("claude-sonnet-4-6"),
      system: PULP_SYSTEM,
      prompt: PULP_USER(text, roundNumber || 1, direction),
      temperature: 0.7,
      maxOutputTokens: 4096,
    });

    // Parse JSON from response — handle markdown code blocks
    let jsonStr = response.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!Array.isArray(parsed.fragments) || !Array.isArray(parsed.provocations)) {
      return NextResponse.json(
        { error: "Invalid response structure from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("401") || message.includes("authentication") || message.includes("invalid x-api-key")) {
      return NextResponse.json({ error: "Invalid API key", code: "auth_error" }, { status: 401 });
    }
    if (message.includes("429") || message.includes("rate")) {
      return NextResponse.json({ error: "Rate limited — try again in a moment", code: "rate_limit" }, { status: 429 });
    }
    if (message.includes("529") || message.includes("overloaded")) {
      return NextResponse.json({ error: "Anthropic is overloaded — try again shortly", code: "overloaded" }, { status: 529 });
    }
    console.error("Pulp API error");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
