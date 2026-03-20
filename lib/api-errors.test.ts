import { describe, it, expect } from "vitest";
import { errorResponse } from "@/lib/api-errors";

async function parseResponse(res: Response) {
  return { status: res.status, body: await res.json() };
}

describe("errorResponse", () => {
  it("returns 401 for authentication errors", async () => {
    const cases = [
      new Error("401 Unauthorized"),
      new Error("authentication failed"),
      new Error("invalid x-api-key"),
    ];
    for (const err of cases) {
      const { status, body } = await parseResponse(errorResponse(err));
      expect(status).toBe(401);
      expect(body.code).toBe("auth_error");
    }
  });

  it("returns 429 for rate limit errors", async () => {
    const cases = [
      new Error("429 Too Many Requests"),
      new Error("rate limit exceeded"),
    ];
    for (const err of cases) {
      const { status, body } = await parseResponse(errorResponse(err));
      expect(status).toBe(429);
      expect(body.code).toBe("rate_limit");
    }
  });

  it("returns 529 for overloaded errors", async () => {
    const cases = [
      new Error("529 overloaded"),
      new Error("API is overloaded"),
    ];
    for (const err of cases) {
      const { status, body } = await parseResponse(errorResponse(err));
      expect(status).toBe(529);
      expect(body.code).toBe("overloaded");
    }
  });

  it("returns 500 with message for unknown errors", async () => {
    const { status, body } = await parseResponse(
      errorResponse(new Error("something broke"))
    );
    expect(status).toBe(500);
    expect(body.error).toBe("something broke");
  });

  it("handles non-Error values gracefully", async () => {
    const { status, body } = await parseResponse(errorResponse("a string"));
    expect(status).toBe(500);
    expect(body.error).toBe("Unknown error");
  });
});
