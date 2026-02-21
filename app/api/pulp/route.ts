import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { PULP_SYSTEM, PULP_USER } from "@/lib/prompts";
import { errorResponse } from "@/lib/api-errors";

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
    console.error("Pulp API error");
    return errorResponse(err);
  }
}
