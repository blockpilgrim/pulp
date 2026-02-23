import lzString from "lz-string";
import type { PulpResponse } from "./types";

type ShareData = {
  v: 1;
  t: string;
  d: string;
  f: { i: string; x: string }[];
  p: { i: string; a: string; x: string }[];
};

export type DecodedShare = {
  title: string;
  direction: string;
  fragments: PulpResponse["fragments"];
  provocations: PulpResponse["provocations"];
};

const MAX_HASH_LENGTH = 8000;

export function encodeShareData(
  title: string,
  direction: string,
  data: PulpResponse
): string | null {
  const payload: ShareData = {
    v: 1,
    t: title,
    d: direction,
    f: data.fragments.map((f) => ({ i: f.id, x: f.text })),
    p: data.provocations.map((p) => ({ i: p.id, a: p.afterFragmentId, x: p.text })),
  };
  const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(payload));
  if (compressed.length > MAX_HASH_LENGTH) return null;
  return compressed;
}

export function decodeShareData(hash: string): DecodedShare | null {
  try {
    const json = lzString.decompressFromEncodedURIComponent(hash);
    if (!json) return null;
    const data = JSON.parse(json) as ShareData;
    if (data.v !== 1) return null;
    return {
      title: data.t,
      direction: data.d,
      fragments: data.f.map((f) => ({ id: f.i, text: f.x })),
      provocations: data.p.map((p) => ({ id: p.i, afterFragmentId: p.a, text: p.x })),
    };
  } catch {
    return null;
  }
}
