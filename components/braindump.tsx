"use client";

import { useRef, useEffect } from "react";

export function Braindump({
  value,
  onChange,
  onExplode,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onExplode: () => void;
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

  const canExplode = value.trim().length > 20;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Write freely. No structure needed. Just think out loud about your topic..."
        className="braindump-textarea w-full bg-transparent px-0 py-4 min-h-[300px] placeholder:text-muted/50"
      />

      <div className="flex justify-end mt-6 mb-8">
        <button
          onClick={onExplode}
          disabled={!canExplode || disabled}
          className="px-5 py-2.5 bg-foreground text-background text-sm font-mono disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition-opacity cursor-pointer"
        >
          Explode
        </button>
      </div>
    </div>
  );
}
