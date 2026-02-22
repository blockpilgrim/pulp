"use client";

export function RoundIndicator({
  probeCount,
  state,
}: {
  probeCount: number;
  state: string;
}) {
  const label = (() => {
    switch (state) {
      case "writing":
        return probeCount > 0 ? `provoked ${probeCount}x` : "write";
      case "probing":
        return "thinking...";
      case "polishing":
        return "polishing...";
      case "polish":
        return "polished";
      case "drafting":
        return "pressing...";
      case "draft":
        return "pressed";
      default:
        return "";
    }
  })();

  return (
    <div className="text-[0.6875rem] font-mono text-muted uppercase tracking-[0.08em]">
      {label}
    </div>
  );
}
