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
        placeholder="Write freely. No structure needed. Just think out loud..."
        className="braindump-textarea w-full bg-transparent px-0 py-4 min-h-[300px]"
      />

      <div className="flex justify-end mt-6 mb-8">
        <button
          onClick={onExplode}
          disabled={!canExplode || disabled}
          className="btn-primary"
        >
          Pulp
        </button>
      </div>
    </div>
  );
}
