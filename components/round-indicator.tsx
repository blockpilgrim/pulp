"use client";

export function RoundIndicator({
  current,
  max,
  state,
}: {
  current: number;
  max: number;
  state: string;
}) {
  const label = (() => {
    switch (state) {
      case "braindump":
        return "write";
      case "exploding":
        return "pulping...";
      case "explosion":
      case "fill":
        return `round ${current} of ${max}`;
      case "drafting":
        return "pressing...";
      case "draft":
      case "edit":
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
