import { describe, it, expect } from "vitest";
import { encodeShareData, decodeShareData } from "@/lib/share";
import type { PulpResponse } from "@/lib/types";

const sampleData: PulpResponse = {
  fragments: [
    { id: "f1", text: "First fragment" },
    { id: "f2", text: "Second fragment" },
  ],
  provocations: [
    { id: "p1", afterFragmentId: "f1", text: "really?" },
  ],
};

describe("encodeShareData / decodeShareData", () => {
  it("round-trips title, direction, fragments, and provocations", () => {
    const encoded = encodeShareData("My Essay", "explore identity", sampleData);
    expect(encoded).toBeTypeOf("string");

    const decoded = decodeShareData(encoded!);
    expect(decoded).toEqual({
      title: "My Essay",
      direction: "explore identity",
      fragments: [
        { id: "f1", text: "First fragment" },
        { id: "f2", text: "Second fragment" },
      ],
      provocations: [
        { id: "p1", afterFragmentId: "f1", text: "really?" },
      ],
    });
  });

  it("returns null when compressed data exceeds MAX_HASH_LENGTH", () => {
    const huge: PulpResponse = {
      fragments: Array.from({ length: 500 }, (_, i) => ({
        id: `f${i}`,
        text: crypto.randomUUID().repeat(20),
      })),
      provocations: [],
    };
    const result = encodeShareData("big", "big", huge);
    expect(result).toBeNull();
  });

  it("returns null for garbage input", () => {
    expect(decodeShareData("not-valid-lz-data")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(decodeShareData("")).toBeNull();
  });
});
