"use client";

import { useState, useEffect } from "react";
import { hasApiKey, removeApiKey } from "@/lib/api-key";

export function ApiKeyManager() {
  const [keySet, setKeySet] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setKeySet(hasApiKey());
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (keySet) {
    return (
      <div className="text-[0.7rem] font-mono text-muted-light">
        API key saved{" "}
        <button
          onClick={() => {
            removeApiKey();
            setKeySet(false);
            window.location.reload();
          }}
          className="link-subtle cursor-pointer"
        >
          remove
        </button>
      </div>
    );
  }

  return null;
}
