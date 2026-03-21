"use client";

import { useRef, useEffect, useState } from "react";
import type { DraftMode } from "@/lib/types";

export function DraftView({
  draft,
  streaming,
  mode = "deep",
  rawWordCount = 0,
  onDraftChange,
  onContinue,
  onRevert,
  onBack,
  onDownload,
}: {
  draft: string;
  streaming: boolean;
  mode?: DraftMode;
  rawWordCount?: number;
  onDraftChange: (v: string) => void;
  onContinue?: () => void;
  onRevert?: () => void;
  onBack: () => void;
  onDownload?: () => void;
}) {
  const streamRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  // Scroll to bottom during streaming
  useEffect(() => {
    if (streaming && streamRef.current) {
      window.scrollTo({ top: document.body.scrollHeight });
    }
  }, [draft, streaming]);

  // Auto-resize textarea when draft changes (including initial load)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || streaming) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [draft, streaming]);

  const draftWordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const pctYours = rawWordCount > 0 && draftWordCount > 0
    ? Math.min(100, Math.round((rawWordCount / draftWordCount) * 100))
    : null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[0.6875rem] font-mono text-muted uppercase tracking-[0.08em]">
          {streaming
            ? mode === "refine" ? "Refining..." : "Pressing..."
            : mode === "refine" ? "Refined" : mode === "soft" ? "Soft pressed" : "Deep pressed"
          }
        </div>
        {!streaming && (
          <div className="flex items-center gap-4">
            {onContinue && (
              <button
                onClick={onContinue}
                className="link-subtle text-[0.75rem] font-mono cursor-pointer"
              >
                continue with this
              </button>
            )}
            {onRevert && (
              <button
                onClick={onRevert}
                className="link-subtle text-[0.75rem] font-mono cursor-pointer"
              >
                revert
              </button>
            )}
            <button
              onClick={handleCopy}
              className="link-subtle text-[0.75rem] font-mono cursor-pointer"
            >
              {copied ? "copied" : "copy"}
            </button>
            {onDownload && (
              <button
                onClick={onDownload}
                className="link-subtle text-[0.75rem] font-mono cursor-pointer"
              >
                download .txt
              </button>
            )}
            <button
              onClick={onBack}
              className="link-subtle text-[0.75rem] font-mono cursor-pointer"
            >
              back to home
            </button>
          </div>
        )}
      </div>

      {streaming ? (
        <div
          ref={streamRef}
          className={`draft-text ${mode === "refine" ? "draft-refine" : mode === "soft" ? "draft-soft" : "draft-deep"} whitespace-pre-wrap py-4 min-h-[300px]`}
        >
          {draft}
          {draft.length > 0 && (
            <span className="inline-block w-[2px] h-[1.1em] bg-accent animate-pulse-slow ml-0.5 align-text-bottom" />
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          className={`draft-text ${mode === "refine" ? "draft-refine" : mode === "soft" ? "draft-soft" : "draft-deep"} draft-editable w-full bg-transparent py-4 min-h-[400px] resize-none overflow-hidden`}
        />
      )}

      {draftWordCount > 0 && (
        <div className="mt-8 text-center text-[0.6875rem] font-mono text-muted-light tracking-[0.08em]">
          {draftWordCount} word{draftWordCount === 1 ? "" : "s"}{pctYours !== null && <> · {pctYours}% yours</>}
        </div>
      )}
    </div>
  );
}
