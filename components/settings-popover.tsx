"use client";

import { useEffect, type RefObject } from "react";
import { useTheme } from "next-themes";
import { ApiKeyManager } from "@/components/api-key-manager";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mb-4">
      <div className="theme-toggle">
        <button
          className={theme === "light" ? "active" : ""}
          onClick={() => setTheme("light")}
          aria-label="Light theme"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.7 3.7l1.4 1.4M10.9 10.9l1.4 1.4M3.7 12.3l1.4-1.4M10.9 5.1l1.4-1.4" />
          </svg>
        </button>
        <button
          className={theme === "system" ? "active" : ""}
          onClick={() => setTheme("system")}
          aria-label="System theme"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1.5" y="2" width="13" height="9" rx="1" />
            <path d="M5.5 14h5M8 11v3" />
          </svg>
        </button>
        <button
          className={theme === "dark" ? "active" : ""}
          onClick={() => setTheme("dark")}
          aria-label="Dark theme"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.5 8.5a5.5 5.5 0 1 1-7-7 4.5 4.5 0 0 0 7 7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SettingsPopover({ onClose, containerRef }: { onClose: () => void; containerRef: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, containerRef]);

  return (
    <div
      role="dialog"
      aria-label="Settings"
      className="popover-enter absolute top-[calc(100%+8px)] left-0 min-w-[220px] max-sm:min-w-[calc(100vw-2rem)] p-4 bg-surface rounded-[1px]"
      style={{ zIndex: 20, boxShadow: "var(--shadow-paper)" }}
    >
      <ThemeToggle />
      <div>
        <div className="text-[0.6875rem] font-mono text-muted uppercase tracking-[0.08em] mb-2">
          API key
        </div>
        <ApiKeyManager showEmptyState />
      </div>
    </div>
  );
}
