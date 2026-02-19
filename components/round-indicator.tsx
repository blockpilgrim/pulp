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
        return "braindump";
      case "exploding":
        return "breaking apart...";
      case "explosion":
      case "fill":
        return `round ${current} of ${max}`;
      case "drafting":
        return "composing draft...";
      case "draft":
      case "edit":
        return "draft";
      default:
        return "";
    }
  })();

  return (
    <div className="text-xs font-mono text-muted uppercase tracking-widest">
      {label}
    </div>
  );
}
