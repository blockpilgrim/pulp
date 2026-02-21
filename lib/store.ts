"use client";

import { useState, useCallback, useEffect } from "react";
import type { Session, SessionState } from "./types";
import { generateId } from "./utils";

const STORAGE_KEY = "pulp_sessions";
const LEGACY_KEY = "jubel_sessions";

function migrateStorageKey() {
  if (typeof window === "undefined") return;
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, legacy);
    localStorage.removeItem(LEGACY_KEY);
  }
}

function migrateSession(s: Record<string, unknown>): Session {
  // Already new format
  if ("content" in s && typeof s.content === "string" && !("braindump" in s)) {
    const stateMap: Record<string, SessionState> = {
      writing: "writing",
      probing: "probing",
      polishing: "polishing",
      polish: "polish",
      drafting: "drafting",
      draft: "draft",
    };
    const state = stateMap[s.state as string] || "writing";
    const migrated = { ...s, state } as Session;
    // Ensure new fields exist on older sessions
    if (!("draftMode" in migrated)) (migrated as Record<string, unknown>).draftMode = null;
    if (!("rawContent" in migrated)) (migrated as Record<string, unknown>).rawContent = null;
    return migrated;
  }

  // Migrate from old format (has braindump + rounds)
  const old = s as Record<string, unknown>;
  const braindump = (old.braindump as string) || "";
  const rounds = (old.rounds as Array<{
    fragments: { text: string }[];
    provocations: { response: string }[];
    freeformAddition: string;
  }>) || [];

  // Extract all user text from old rounds
  const parts: string[] = [];
  for (const round of rounds) {
    for (const f of round.fragments) {
      parts.push(f.text);
    }
    for (const p of round.provocations) {
      if (p.response?.trim()) {
        parts.push(p.response);
      }
    }
    if (round.freeformAddition?.trim()) {
      parts.push(round.freeformAddition);
    }
  }
  const content = parts.length > 0 ? parts.join("\n\n") : braindump;

  // Map old states to new states
  const oldState = old.state as string;
  const stateMap: Record<string, SessionState> = {
    braindump: "writing",
    pulping: "writing", // reset mid-API states
    pulped: "writing",
    fill: "writing",
    exploding: "writing",
    explosion: "writing",
    drafting: "writing",
    draft: "draft",
    edit: "draft",
  };
  const state = stateMap[oldState] || "writing";
  const probeCount = (old.currentRound as number) || 0;
  const direction = typeof old.direction === "string" ? old.direction : "";

  return {
    id: old.id as string,
    title: old.title as string || "",
    direction,
    createdAt: old.createdAt as number || Date.now(),
    updatedAt: old.updatedAt as number || Date.now(),
    state,
    content,
    probeCount,
    draft: (old.draft as string) || null,
    draftMode: null,
    rawContent: null,
  };
}

function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    migrateStorageKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>[]).map(migrateSession) : [];
  } catch {
    return [];
  }
}

let _lsAvailable: boolean | null = null;
function isLocalStorageAvailable(): boolean {
  if (_lsAvailable !== null) return _lsAvailable;
  try {
    const test = "__pulp_test__";
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
    _lsAvailable = true;
  } catch {
    _lsAvailable = false;
  }
  return _lsAvailable;
}

function saveSessions(sessions: Session[]) {
  if (typeof window === "undefined" || !isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded — session data may not be saved");
    }
  }
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setLoaded(true);
  }, []);

  const createSession = useCallback((direction?: string): Session => {
    const session: Session = {
      id: generateId(),
      title: "",
      direction: direction || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      state: "writing",
      content: "",
      probeCount: 0,
      draft: null,
      draftMode: null,
      rawContent: null,
    };
    setSessions(prev => {
      const next = [session, ...prev];
      saveSessions(next);
      return next;
    });
    return session;
  }, []);

  const updateSession = useCallback(
    (id: string, updates: Partial<Session>) => {
      setSessions(prev => {
        const next = prev.map((s) =>
          s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
        );
        saveSessions(next);
        return next;
      });
    },
    []
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions(prev => {
        const next = prev.filter((s) => s.id !== id);
        saveSessions(next);
        return next;
      });
    },
    []
  );

  const getSession = useCallback(
    (id: string): Session | undefined => {
      return sessions.find((s) => s.id === id);
    },
    [sessions]
  );

  return { sessions, loaded, createSession, updateSession, deleteSession, getSession };
}

export function useSession(id: string) {
  const { sessions, loaded, updateSession, deleteSession } = useSessions();
  const session = sessions.find((s) => s.id === id);

  const update = useCallback(
    (updates: Partial<Session>) => updateSession(id, updates),
    [id, updateSession]
  );

  const setState = useCallback(
    (state: SessionState) => update({ state }),
    [update]
  );

  return {
    session,
    loaded,
    update,
    setState,
    deleteSession: () => deleteSession(id),
  };
}
