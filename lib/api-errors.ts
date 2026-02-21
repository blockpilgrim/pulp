import { NextResponse } from "next/server";

export function errorResponse(err: unknown) {
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
  return NextResponse.json({ error: message }, { status: 500 });
}
