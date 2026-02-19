"use client";

export function Loading({ message }: { message: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-24">
      <div className="flex gap-1.5 mb-6">
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-slow" style={{ animationDelay: "0ms" }} />
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-slow" style={{ animationDelay: "300ms" }} />
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-slow" style={{ animationDelay: "600ms" }} />
      </div>
      <div className="text-sm font-mono text-muted">
        {message}
      </div>
    </div>
  );
}
