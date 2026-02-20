"use client";

export function RoundIndicator({
  current,
  state,
}: {
  current: number;
  state: string;
}) {
  const label = (() => {
    switch (state) {
      case "braindump":
        return "write";
      case "pulping":
        return "thinking...";
      case "pulped":
      case "fill":
        return `round ${current}`;
      case "drafting":
        return "drafting...";
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
