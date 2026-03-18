"use client";

import { useState, useEffect } from "react";
import { hasApiKey, setApiKey, removeApiKey, clearDemoMode } from "@/lib/api-key";

export function ApiKeyManager({ showEmptyState = false }: { showEmptyState?: boolean } = {}) {
  const [keySet, setKeySet] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setKeySet(hasApiKey());
  }, []);

  if (keySet === null) return null;

  if (keySet) {
    return (
      <div className="flex items-center justify-between text-[0.625rem] font-mono">
        <span className="text-muted flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 8.5l4 4 7-8" />
          </svg>
          saved
        </span>
        <button
          onClick={() => {
            removeApiKey();
            setKeySet(false);
            window.location.reload();
          }}
          className="link-subtle text-muted-light cursor-pointer"
        >
          remove
        </button>
      </div>
    );
  }

  if (showEmptyState) {
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
      clearDemoMode();
      setApiKey(trimmed);
      setKeySet(true);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="sk-ant-..."
          className="w-full bg-transparent border-b border-border px-0 py-1.5 font-mono text-[0.75rem] focus:outline-none focus:border-accent transition-colors"
        />
        {error && (
          <div className="text-accent-dark text-[0.625rem] font-mono">{error}</div>
        )}
        <button
          type="submit"
          disabled={!input.trim()}
          className="btn-primary w-full disabled:opacity-15"
        >
          Save key
        </button>
      </form>
    );
  }

  return null;
}
