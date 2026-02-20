"use client";

import { useRef, useEffect } from "react";

export function Braindump({
  value,
  onChange,
  onPulp,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onPulp: () => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  // Auto-resize
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, 300) + "px";
  }, [value]);

  const canPulp = value.trim().length > 20;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Write freely. No structure needed. Just think out loud..."
        className="braindump-textarea w-full bg-transparent px-0 py-4 min-h-[300px]"
      />

      <div className="flex items-center justify-between mt-6 mb-8">
        <div className="text-[0.7rem] font-mono text-muted-light">
          {wordCount > 0 && `${wordCount} word${wordCount === 1 ? "" : "s"}`}
        </div>
        <button
          onClick={onPulp}
          disabled={!canPulp || disabled}
          className="btn-primary"
        >
          Probe
        </button>
      </div>
    </div>
  );
}
