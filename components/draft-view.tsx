"use client";

import { useRef, useEffect, useState } from "react";
import type { DraftMode } from "@/lib/types";

export function DraftView({
  draft,
  streaming,
  mode = "draft",
  onDraftChange,
  onContinue,
  onRevert,
  onBack,
  onDownload,
}: {
  draft: string;
  streaming: boolean;
  mode?: DraftMode;
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
            ? mode === "polish" ? "Polishing..." : "Pressing..."
            : mode === "polish" ? "Polished" : "Pressed"
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
          className={`draft-text ${mode === "polish" ? "draft-polish" : "draft-press"} whitespace-pre-wrap py-4 min-h-[300px]`}
        >
          {draft}
          <span className="inline-block w-[2px] h-[1.1em] bg-accent animate-pulse-slow ml-0.5 align-text-bottom" />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          className={`draft-text ${mode === "polish" ? "draft-polish" : "draft-press"} draft-editable w-full bg-transparent py-4 min-h-[400px] resize-none overflow-hidden`}
        />
      )}
    </div>
  );
}
