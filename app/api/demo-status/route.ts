import { NextRequest, NextResponse } from "next/server";
import { getDemoStatus } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const status = await getDemoStatus(ip);
  return NextResponse.json(status);
}
