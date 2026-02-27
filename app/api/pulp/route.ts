import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { PULP_SYSTEM, PULP_USER } from "@/lib/prompts";
import { errorResponse } from "@/lib/api-errors";
import { checkDemoLimit } from "@/lib/rate-limit";

const DEMO_TEXT_LIMIT = 5000;

export async function POST(req: NextRequest) {
  try {
    const clientKey = req.headers.get("x-api-key");
    const apiKey = clientKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    const isDemo = !clientKey;
    let demoRemaining: number | undefined;

    if (isDemo) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const limit = await checkDemoLimit(ip);
      demoRemaining = limit.remaining;
      if (!limit.allowed) {
        return NextResponse.json(
          { error: "Demo limit reached — enter your own API key to continue", code: "demo_limit" },
          { status: 429, headers: { "X-Demo-Remaining": "0" } }
        );
      }
    }

    const { text, roundNumber, direction } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (isDemo && text.length > DEMO_TEXT_LIMIT) {
      return NextResponse.json(
        { error: `Demo mode limits text to ${DEMO_TEXT_LIMIT} characters` },
        { status: 400 }
      );
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

    const headers: Record<string, string> = {};
    if (isDemo && demoRemaining !== undefined) {
      headers["X-Demo-Remaining"] = String(demoRemaining);
    }

    return NextResponse.json(parsed, { headers });
  } catch (err) {
    console.error("Pulp API error");
    return errorResponse(err);
  }
}
