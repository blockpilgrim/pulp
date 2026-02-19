"use client";

import type { Round } from "@/lib/types";
import { Fragment } from "./fragment";
import { Provocation } from "./provocation";

export function ExplosionView({
  round,
  fillMode,
  freeformValue,
  onProvocationResponse,
  onFreeformChange,
  onNext,
  nextLabel,
  disabled,
}: {
  round: Round;
  fillMode: boolean;
  freeformValue: string;
  onProvocationResponse: (provocationId: string, value: string) => void;
  onFreeformChange: (v: string) => void;
  onNext: () => void;
  nextLabel: string;
  disabled: boolean;
}) {
  // Build interleaved list: fragment, then its provocations
  const items: { type: "fragment" | "provocation"; data: Round["fragments"][0] | Round["provocations"][0] }[] = [];

  for (const fragment of round.fragments) {
    items.push({ type: "fragment", data: fragment });
    const provs = round.provocations.filter((p) => p.afterFragmentId === fragment.id);
    for (const p of provs) {
      items.push({ type: "provocation", data: p });
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="stagger-children">
        {items.map((item) => {
          if (item.type === "fragment") {
            const f = item.data as Round["fragments"][0];
            return <Fragment key={f.id} text={f.text} />;
          }
          const p = item.data as Round["provocations"][0];
          return (
            <Provocation
              key={p.id}
              text={p.text}
              response={p.response}
              onResponseChange={(v) => onProvocationResponse(p.id, v)}
              fillMode={fillMode}
            />
          );
        })}
      </div>

      {fillMode && (
        <div className="mt-8 pt-6 border-t border-border">
          <label className="text-xs font-mono text-muted uppercase tracking-widest block mb-3">
            Anything else?
          </label>
          <textarea
            value={freeformValue}
            onChange={(e) => onFreeformChange(e.target.value)}
            placeholder="Add whatever else comes to mind..."
            className="response-textarea w-full bg-transparent px-3 py-2 min-h-[80px] placeholder:text-muted/40"
            style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}
          />
        </div>
      )}

      <div className="flex justify-end mt-8 mb-8">
        <button
          onClick={onNext}
          disabled={disabled}
          className="px-5 py-2.5 bg-foreground text-background text-sm font-mono disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition-opacity cursor-pointer"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
