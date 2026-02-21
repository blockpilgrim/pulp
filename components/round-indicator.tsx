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
        return probeCount > 0 ? `probed ${probeCount}x` : "write";
      case "probing":
        return "thinking...";
      case "drafting":
        return "drafting...";
      case "draft":
        return "draft";
      default:
        return "";
    }
  })();

  return (
    <div className="text-[0.7rem] font-mono text-muted uppercase tracking-[0.08em]">
      {label}
    </div>
  );
}
