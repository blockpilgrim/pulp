"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessions } from "@/lib/store";
import { truncate } from "@/lib/utils";
import { ApiKeyManager } from "@/components/api-key-manager";

export default function Home() {
  const router = useRouter();
  const { sessions, loaded, createSession, deleteSession } = useSessions();
  const [direction, setDirection] = useState("");

  const handleNew = () => {
    const session = createSession(direction.trim() || undefined);
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
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 pb-20 sm:pt-24">
      <header className="mb-12 sm:mb-16 text-center max-w-md">
        <h1 className="text-[1.75rem] font-serif font-light tracking-tight leading-tight mb-3">
          Pulp
        </h1>
        <p className="text-muted text-[0.8rem] font-mono tracking-wide leading-relaxed">
          Write raw. AI provokes deeper thinking.
          <br />
          Then shapes it into a draft.
        </p>
      </header>

      {/* Flow line */}
      <div className="flex items-center gap-3 mb-10 text-[0.7rem] font-mono text-muted-light tracking-wide">
        <span>write raw</span>
        <span className="text-border">&#8594;</span>
        <span>probe</span>
        <span className="text-border">&#8594;</span>
        <span>polish or press</span>
      </div>

      {/* Direction + CTA */}
      <div className="w-full max-w-sm mb-12">
        <input
          type="text"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          placeholder="What's on your mind? (optional)"
          className="w-full bg-transparent border-b border-border-light px-0 py-2 font-serif text-[0.95rem] text-center focus:outline-none focus:border-accent transition-colors placeholder:text-muted-light placeholder:italic mb-6"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleNew();
          }}
        />
        <div className="flex justify-center">
          <button
            onClick={handleNew}
            className="btn-primary"
          >
            Start writing
          </button>
        </div>
      </div>

      {/* Previous sessions */}
      {sessions.length > 0 && (
        <>
          <div className="w-8 h-px bg-border mb-10" />
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
                      {s.title || truncate(s.content, 60) || "Untitled"}
                    </div>
                    <div className="text-[0.72rem] text-muted font-mono tracking-wide mt-0.5">
                      {new Date(s.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {s.state === "writing" && (s.probeCount > 0 ? `probed ${s.probeCount}x` : "writing")}
                      {s.state === "probing" && "thinking..."}
                      {s.state === "polishing" && "polishing..."}
                      {s.state === "polish" && "polished"}
                      {s.state === "drafting" && "pressing..."}
                      {s.state === "draft" && "pressed"}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this session?")) {
                        deleteSession(s.id);
                      }
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

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 flex flex-col items-center gap-2 py-4 bg-gradient-to-t from-background to-transparent">
        <div className="text-[0.65rem] font-mono text-muted-light text-center leading-relaxed">
          Your writing stays in your browser. Nothing is stored on a server.
        </div>
        <ApiKeyManager />
      </footer>
    </div>
  );
}
