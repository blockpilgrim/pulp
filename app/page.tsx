"use client";

import { useRouter } from "next/navigation";
import { useSessions } from "@/lib/store";
import { truncate } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { sessions, loaded, createSession, deleteSession } = useSessions();

  const handleNew = () => {
    const session = createSession();
    router.push(`/write/${session.id}`);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted animate-pulse-slow font-mono text-sm">loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-24 pb-16">
      <header className="mb-16 text-center">
        <h1 className="text-2xl font-light tracking-tight mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          Jubel
        </h1>
        <p className="text-muted text-sm font-mono">
          You write first. AI provokes.
        </p>
      </header>

      <button
        onClick={handleNew}
        className="mb-16 px-6 py-3 bg-foreground text-background text-sm font-mono rounded-none hover:opacity-80 transition-opacity cursor-pointer"
      >
        Start writing
      </button>

      {sessions.length > 0 && (
        <div className="w-full max-w-lg">
          <div className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
            Previous sessions
          </div>
          <div className="space-y-1">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="group flex items-center justify-between py-3 px-3 hover:bg-surface rounded cursor-pointer transition-colors"
                onClick={() => router.push(`/write/${s.id}`)}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm" style={{ fontFamily: "var(--font-serif)" }}>
                    {s.title || truncate(s.braindump, 60) || "Untitled"}
                  </div>
                  <div className="text-xs text-muted font-mono mt-0.5">
                    {new Date(s.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {s.state === "braindump" && "braindump"}
                    {s.state === "explosion" && `round ${s.currentRound}`}
                    {s.state === "fill" && `filling round ${s.currentRound}`}
                    {s.state === "draft" && "draft"}
                    {s.state === "edit" && "editing"}
                    {s.state === "exploding" && "thinking..."}
                    {s.state === "drafting" && "drafting..."}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(s.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted hover:text-foreground text-xs font-mono ml-4 transition-opacity cursor-pointer"
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
