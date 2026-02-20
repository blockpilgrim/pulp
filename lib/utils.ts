export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max).trimEnd() + "...";
}

export function getAllUserText(session: {
  braindump: string;
  rounds: { fragments: { text: string }[]; provocations: { response: string }[]; freeformAddition: string }[];
}): string {
  const parts: string[] = [];

  for (const round of session.rounds) {
    for (const f of round.fragments) {
      parts.push(f.text);
    }
    for (const p of round.provocations) {
      if (p.response.trim()) {
        parts.push(p.response);
      }
    }
    if (round.freeformAddition.trim()) {
      parts.push(round.freeformAddition);
    }
  }

  if (parts.length === 0) {
    return session.braindump;
  }

  return parts.join("\n\n");
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substring(0, 50) || "pulp-draft";
}

export function downloadAsTxt(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
