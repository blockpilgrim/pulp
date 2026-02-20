"use client";

import { useRef, useEffect } from "react";

export function DraftView({
  draft,
  streaming,
  onDraftChange,
  onBack,
}: {
  draft: string;
  streaming: boolean;
  onDraftChange: (v: string) => void;
  onBack: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll to bottom during streaming
  useEffect(() => {
    if (streaming && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [draft, streaming]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[0.7rem] font-mono text-muted uppercase tracking-[0.08em]">
          {streaming ? "Pressing..." : "Your draft"}
        </div>
        {!streaming && (
          <button
            onClick={onBack}
            className="link-subtle text-[0.72rem] font-mono cursor-pointer"
          >
            back to home
          </button>
        )}
      </div>

      {streaming ? (
        <div
          ref={ref}
          className="draft-text whitespace-pre-wrap py-4 min-h-[300px]"
        >
          {draft}
          <span className="inline-block w-[2px] h-[1.1em] bg-accent animate-pulse-slow ml-0.5 align-text-bottom" />
        </div>
      ) : (
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          className="draft-text draft-editable w-full bg-transparent py-4 min-h-[400px] resize-none"
          style={{ height: "auto" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />
      )}
    </div>
  );
}
