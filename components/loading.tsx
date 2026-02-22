"use client";

export function Loading({ message }: { message: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-24">
      <div className="flex gap-2 mb-6">
        <div className="loading-dot" style={{ animationDelay: "0ms" }} />
        <div className="loading-dot" style={{ animationDelay: "300ms" }} />
        <div className="loading-dot" style={{ animationDelay: "600ms" }} />
      </div>
      <div className="text-[0.8125rem] font-mono text-muted">
        {message}
      </div>
    </div>
  );
}
