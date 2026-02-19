"use client";

export function Fragment({ text }: { text: string }) {
  return (
    <div className="fragment-text py-3 whitespace-pre-wrap">
      {text}
    </div>
  );
}
