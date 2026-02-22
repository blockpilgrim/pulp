"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Session } from "@/lib/types";
import { truncate } from "@/lib/utils";

type HistoryPanelProps = {
  onClose: () => void;
  sessions: Session[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

function stateLabel(s: Session): string {
  if (s.state === "writing") return s.probeCount > 0 ? `provoked ${s.probeCount}x` : "writing";
  if (s.state === "probing") return "thinking...";
  if (s.state === "polishing") return "polishing...";
  if (s.state === "polish") return "polished";
  if (s.state === "drafting") return "pressing...";
  if (s.state === "draft") return "pressed";
  return s.state;
}

export function HistoryPanel({ onClose, sessions, onSelect, onDelete }: HistoryPanelProps) {
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);

  const startClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 200);
  }, [closing, onClose]);

  // Focus trap + escape + scroll lock
  useEffect(() => {
    previousFocus.current = document.activeElement;
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        startClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus();
      }
    };
  }, [startClose]);

  return (
    <div className="fixed inset-0" style={{ zIndex: 50 }}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 slide-over-backdrop ${closing ? "closing" : ""}`}
        onClick={startClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Session history"
        tabIndex={-1}
        className={`absolute top-0 right-0 h-full w-full sm:w-80 bg-surface shadow-[-4px_0_16px_rgba(0,0,0,0.06)] flex flex-col slide-over-panel ${closing ? "closing" : ""}`}
        style={{ outline: "none" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <span className="text-[0.6875rem] font-mono text-muted uppercase tracking-[0.08em]">
            Sessions
          </span>
          <button
            onClick={startClose}
            className="icon-btn"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-[0.8125rem] font-mono text-muted-light italic">
                No sessions yet
              </span>
            </div>
          ) : (
            <div className="py-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  className="group flex items-center justify-between py-3.5 px-5 hover:bg-surface-hover cursor-pointer transition-colors duration-200"
                  onClick={() => onSelect(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(s.id);
                    }
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.9375rem] font-sans truncate">
                      {s.title || truncate(s.content, 60) || "Untitled"}
                    </div>
                    <div className="text-[0.6875rem] text-muted font-mono tracking-[0.08em] mt-0.5">
                      {new Date(s.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                      {" \u00b7 "}
                      {stateLabel(s)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this session?")) {
                        onDelete(s.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[0.75rem] font-mono text-muted-light hover:text-accent ml-4 transition-all duration-200 cursor-pointer"
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
