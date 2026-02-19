import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { EXPLODE_SYSTEM, EXPLODE_USER } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { text, roundNumber } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const { text: response } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: EXPLODE_SYSTEM,
      prompt: EXPLODE_USER(text, roundNumber || 1),
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
    console.error("Explode error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
