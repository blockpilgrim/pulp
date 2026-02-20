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
    <div className="my-4">
      <p className="provocation">
        <span className="provocation-text">{text}</span>
      </p>

      {fillMode && (
        <div className="mt-2">
          <textarea
            ref={ref}
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="..."
            className="response-textarea w-full bg-transparent min-h-[40px]"
          />
        </div>
      )}

      {!fillMode && response && (
        <div className="mt-2 text-sm py-2 font-serif italic text-foreground-secondary">
          {response}
        </div>
      )}
    </div>
  );
}
