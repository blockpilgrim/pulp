"use client";

import { useState, useEffect } from "react";
import { hasApiKey, removeApiKey } from "@/lib/api-key";

export function ApiKeyManager({ showEmptyState = false }: { showEmptyState?: boolean } = {}) {
  const [keySet, setKeySet] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setKeySet(hasApiKey());
    setChecked(true);
  }, []);

  if (!checked) return null;

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
    return (
      <div className="text-[0.625rem] font-mono text-muted-light">
        not set
      </div>
    );
  }

  return null;
}
