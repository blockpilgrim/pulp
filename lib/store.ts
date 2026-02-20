"use client";

import { useState, useCallback, useEffect } from "react";
import type { Session, SessionState, Round } from "./types";
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
  // Migrate old state names: exploding → pulping, explosion → pulped
  const stateMap: Record<string, SessionState> = {
    exploding: "pulping",
    explosion: "pulped",
  };
  const state = stateMap[s.state as string] || s.state;
  // Add direction field if missing (pre-v1 sessions)
  const direction = typeof s.direction === "string" ? s.direction : "";
  return { ...s, state, direction } as Session;
}

function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    migrateStorageKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session[]).map(migrateSession) : [];
  } catch {
    return [];
  }
}

function isLocalStorageAvailable(): boolean {
  try {
    const test = "__pulp_test__";
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
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

  const persist = useCallback((next: Session[]) => {
    setSessions(next);
    saveSessions(next);
  }, []);

  const createSession = useCallback((direction?: string): Session => {
    const session: Session = {
      id: generateId(),
      title: "",
      direction: direction || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      state: "braindump",
      braindump: "",
      rounds: [],
      currentRound: 0,
      maxRounds: 2,
      draft: null,
    };
    const next = [session, ...loadSessions()];
    persist(next);
    return session;
  }, [persist]);

  const updateSession = useCallback(
    (id: string, updates: Partial<Session>) => {
      const current = loadSessions();
      const next = current.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
      );
      persist(next);
      return next.find((s) => s.id === id)!;
    },
    [persist]
  );

  const deleteSession = useCallback(
    (id: string) => {
      const next = loadSessions().filter((s) => s.id !== id);
      persist(next);
    },
    [persist]
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

  const addRound = useCallback(
    (round: Round) => {
      if (!session) return;
      update({
        rounds: [...session.rounds, round],
        currentRound: round.number,
      });
    },
    [session, update]
  );

  const updateRound = useCallback(
    (roundNumber: number, updates: Partial<Round>) => {
      if (!session) return;
      const rounds = session.rounds.map((r) =>
        r.number === roundNumber ? { ...r, ...updates } : r
      );
      update({ rounds });
    },
    [session, update]
  );

  return {
    session,
    loaded,
    update,
    setState,
    addRound,
    updateRound,
    deleteSession: () => deleteSession(id),
  };
}
