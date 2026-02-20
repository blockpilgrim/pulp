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
        <div className="text-muted animate-pulse-slow font-mono text-[0.8rem]">loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-24 pb-16">
      <header className="mb-16 text-center">
        <h1 className="text-[1.75rem] font-serif font-light tracking-tight leading-tight mb-2">
          Pulp
        </h1>
        <p className="text-muted text-[0.8rem] font-mono tracking-wide">
          You write raw. AI does the rest.
        </p>
      </header>

      <button
        onClick={handleNew}
        className="btn-primary mb-12"
      >
        Start writing
      </button>

      {sessions.length > 0 && (
        <>
          <div className="w-8 h-px bg-border mb-12" />
          <div className="w-full max-w-lg">
            <div className="text-[0.7rem] font-mono text-muted uppercase tracking-[0.08em] mb-4">
              Previous sessions
            </div>
            <div className="space-y-0.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center justify-between py-3.5 px-4 -mx-4 hover:bg-surface-hover cursor-pointer transition-colors duration-200"
                  onClick={() => router.push(`/write/${s.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.95rem] font-serif">
                      {s.title || truncate(s.braindump, 60) || "Untitled"}
                    </div>
                    <div className="text-[0.72rem] text-muted font-mono tracking-wide mt-0.5">
                      {new Date(s.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {s.state === "braindump" && "writing"}
                      {s.state === "explosion" && `round ${s.currentRound}`}
                      {s.state === "fill" && `round ${s.currentRound}`}
                      {s.state === "draft" && "draft"}
                      {s.state === "edit" && "editing"}
                      {s.state === "exploding" && "pulping..."}
                      {s.state === "drafting" && "pressing..."}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[0.72rem] font-mono text-muted-light hover:text-accent ml-4 transition-all duration-200 cursor-pointer"
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
