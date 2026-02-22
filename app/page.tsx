"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessions } from "@/lib/store";
import { HistoryPanel } from "@/components/history-panel";
import { SettingsPopover } from "@/components/settings-popover";

export default function Home() {
  const router = useRouter();
  const { sessions, loaded, createSession, deleteSession } = useSessions();
  const [direction, setDirection] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNew = () => {
    const session = createSession(direction.trim() || undefined);
    router.push(`/write/${session.id}`);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted animate-pulse-slow font-mono text-[0.8125rem]">loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3">
        {/* Settings */}
        <div className="relative">
          <button
            className="icon-btn"
            onClick={() => setSettingsOpen((v) => !v)}
            aria-label="Settings"
            aria-expanded={settingsOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          {settingsOpen && (
            <SettingsPopover onClose={() => setSettingsOpen(false)} />
          )}
        </div>

        {/* History */}
        {sessions.length > 0 && (
          <button
            className="icon-btn"
            onClick={() => setHistoryOpen(true)}
            aria-label="Session history"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <polyline points="10,5 10,10 13.5,12" />
            </svg>
          </button>
        )}
      </div>

      {/* Hero — vertically centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <h1 className="hero-enter stagger-0 text-[4rem] font-sans font-light tracking-[-0.03em] leading-[1] mb-3">
          Pulp
        </h1>

        <div className="hero-enter stagger-1 mb-10 text-[0.8125rem] font-sans text-muted italic">
          Your raw thinking, fully expressed.
        </div>

        {/* Direction + CTA */}
        <div className="hero-enter stagger-2 w-full max-w-sm">
          <input
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="What's on your mind? (optional)"
            className="w-full bg-transparent border-b border-border-light px-0 py-2 font-sans text-[0.9375rem] text-center focus:outline-none focus:border-accent transition-colors placeholder:text-muted-light placeholder:italic mb-6"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNew();
            }}
          />
          <div className="hero-enter stagger-3 flex justify-center">
            <button onClick={handleNew} className="btn-primary">
              Start writing
            </button>
          </div>
        </div>
      </main>

      {/* Privacy footer */}
      <footer className="pb-4 text-center">
        <div className="text-[0.625rem] font-mono text-muted-light leading-relaxed">
          Your writing stays in your browser. Nothing is stored on a server.
        </div>
      </footer>

      {/* History slide-over */}
      {historyOpen && (
        <HistoryPanel
          onClose={() => setHistoryOpen(false)}
          sessions={sessions}
          onSelect={(id) => {
            setHistoryOpen(false);
            router.push(`/write/${id}`);
          }}
          onDelete={deleteSession}
        />
      )}
    </div>
  );
}
