import { describe, it, expect } from "vitest";
import { generateId, truncate, sanitizeFilename } from "@/lib/utils";

describe("generateId", () => {
  it("returns an 8-character alphanumeric string", () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]{8}$/);
  });

  it("returns unique values on successive calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("truncate", () => {
  it("returns text unchanged when under max", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns text unchanged when exactly at max", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates and adds ellipsis when over max", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });

  it("trims trailing whitespace before ellipsis", () => {
    expect(truncate("hello world", 6)).toBe("hello...");
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });
});

describe("sanitizeFilename", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(sanitizeFilename("My Draft")).toBe("my-draft");
  });

  it("strips special characters", () => {
    expect(sanitizeFilename("draft @#$ 2!")).toBe("draft-2");
  });

  it("collapses multiple spaces into one hyphen", () => {
    expect(sanitizeFilename("a   b")).toBe("a-b");
  });

  it("truncates to 50 characters", () => {
    const long = "a".repeat(60);
    expect(sanitizeFilename(long).length).toBe(50);
  });

  it("falls back to 'pulp-draft' for empty result", () => {
    expect(sanitizeFilename("!!!")).toBe("pulp-draft");
  });
});
