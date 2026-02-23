"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasApiKey, setApiKey } from "@/lib/api-key";

export function ApiKeyGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [keySet, setKeySet] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setKeySet(hasApiKey());
  }, []);

  // Share page doesn't need an API key
  if (pathname.startsWith("/share")) {
    return <>{children}</>;
  }

  if (keySet === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted animate-pulse-slow font-mono text-[0.8125rem]">loading...</div>
      </div>
    );
  }

  if (keySet) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setError("Key should start with sk-ant-");
      return;
    }
    if (trimmed.length < 20) {
      setError("Key seems too short");
      return;
    }
    setApiKey(trimmed);
    setKeySet(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-[1.75rem] font-sans font-light tracking-[-0.02em] leading-[1.15] mb-2 text-center">
          Pulp
        </h1>
        <p className="text-muted text-[0.8125rem] font-mono tracking-wide text-center mb-12">
          Bring your own Anthropic API key
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder="sk-ant-..."
              className="w-full bg-transparent border-b border-border px-0 py-3 font-mono text-[0.8125rem] focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
            {error && (
              <div className="text-accent-dark text-[0.75rem] font-mono mt-2">{error}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="btn-primary w-full"
          >
            Save key
          </button>
        </form>

        <p className="text-muted-light text-[0.625rem] font-mono text-center mt-8 leading-relaxed">
          Your key is stored locally in your browser.
          <br />
          It&apos;s sent directly to Anthropic&apos;s API — never stored on a server.
          <br />
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="link-subtle"
          >
            Get a key from Anthropic
          </a>
        </p>
      </div>
    </div>
  );
}
