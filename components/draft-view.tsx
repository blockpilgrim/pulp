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
        <div className="text-xs font-mono text-muted uppercase tracking-widest">
          {streaming ? "Drafting..." : "Your draft"}
        </div>
        {!streaming && (
          <button
            onClick={onBack}
            className="text-xs font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
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
          <span className="inline-block w-0.5 h-5 bg-accent animate-pulse-slow ml-0.5 align-text-bottom" />
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
