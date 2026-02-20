"use client";

import { ApiKeyGate } from "./api-key-gate";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApiKeyGate>{children}</ApiKeyGate>;
}
