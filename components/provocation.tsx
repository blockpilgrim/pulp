"use client";

import { useRef, useEffect } from "react";

export function Provocation({
  text,
  response,
  onResponseChange,
  fillMode,
}: {
  text: string;
  response: string;
  onResponseChange: (v: string) => void;
  fillMode: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize response
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, 40) + "px";
  }, [response]);

  return (
    <div className="my-3">
      <div className="provocation px-4 py-2.5 rounded-sm">
        {text}
      </div>

      {fillMode && (
        <div className="mt-2 ml-4">
          <textarea
            ref={ref}
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="respond here, or skip..."
            className="response-textarea w-full bg-transparent px-3 py-2 min-h-[40px] text-sm placeholder:text-muted/40"
          />
        </div>
      )}

      {!fillMode && response && (
        <div className="mt-2 ml-4 text-sm py-2 px-3 bg-surface rounded" style={{ fontFamily: "var(--font-serif)" }}>
          {response}
        </div>
      )}
    </div>
  );
}
