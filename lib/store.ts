"use client";

import { useState, useCallback, useEffect } from "react";
import type { Session, SessionState, Round } from "./types";
import { generateId } from "./utils";

const STORAGE_KEY = "jubel_sessions";

function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
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

  const createSession = useCallback((): Session => {
    const session: Session = {
      id: generateId(),
      title: "",
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
