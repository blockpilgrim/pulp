"use client";

import { ThemeProvider } from "next-themes";
import { ApiKeyGate } from "./api-key-gate";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      themes={["light", "dark"]}
    >
      <ApiKeyGate>{children}</ApiKeyGate>
    </ThemeProvider>
  );
}
