"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/store";
import { sanitizeFilename, downloadAsTxt } from "@/lib/utils";
import { getApiKey } from "@/lib/api-key";
import type { PulpResponse, DraftMode } from "@/lib/types";
import { Canvas } from "@/components/canvas";
import { DraftView } from "@/components/draft-view";
import { RoundIndicator } from "@/components/round-indicator";

export default function WritePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { session, loaded, update } = useSession(id);

  const [draftText, setDraftText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provocationsData, setProvocationsData] = useState<PulpResponse | null>(null);

  // Warn before closing during active API calls
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (streaming || session?.state === "probing" || session?.state === "polishing") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [streaming, session?.state]);

  // Sync draft from persisted session on load
  useEffect(() => {
    if (!session) return;
    if (session.draft) {
      setDraftText(session.draft);
    }
    // If user closed tab during API call, reset to usable state
    if (session.state === "probing" || session.state === "drafting" || session.state === "polishing") {
      update({ state: "writing" });
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Clean up debounce timer on unmount
  useEffect(() => () => clearTimeout(saveTimeoutRef.current), []);

  const handleContentChange = useCallback(
    (text: string) => {
      if (!session) return;
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        update({ content: text });
      }, 500);
    },
    [session, update]
  );

  const handleProbe = useCallback(
    async (text: string) => {
      if (!session) return;
      setError(null);

      const probeNumber = session.probeCount + 1;

      update({
        content: text,
        state: "probing",
        title: session.title || text.split(/[.\n]/)[0]?.trim().substring(0, 50) || "Untitled",
      });

      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const key = getApiKey();
        if (key) headers["x-api-key"] = key;

        const res = await fetch("/api/pulp", {
          method: "POST",
          headers,
          body: JSON.stringify({ text, roundNumber: probeNumber, direction: session.direction }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Something went wrong");
        }

        const data: PulpResponse = await res.json();
        setProvocationsData(data);
        update({ state: "writing", probeCount: probeNumber });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        update({ state: "writing" });
      }
    },
    [session, update]
  );

  const handleGenerate = useCallback(
    async (text: string, mode: DraftMode) => {
      if (!session) return;
      setError(null);

      const activeState = mode === "polish" ? "polishing" : "drafting";
      const doneState = mode === "polish" ? "polish" : "draft";

      update({ content: text, state: activeState, draftMode: mode, rawContent: text });
      setDraftText("");
      setStreaming(true);

      let fullDraft = "";
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const key = getApiKey();
        if (key) headers["x-api-key"] = key;

        const res = await fetch("/api/draft", {
          method: "POST",
          headers,
          body: JSON.stringify({ text, direction: session.direction, mode }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Generation failed");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullDraft += chunk;
            setDraftText(fullDraft);
          }
          const remaining = decoder.decode();
          if (remaining) {
            fullDraft += remaining;
            setDraftText(fullDraft);
          }
        }

        setStreaming(false);
        update({ state: doneState, draft: fullDraft });
      } catch (err) {
        setStreaming(false);
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        if (fullDraft.length > 0) {
          update({ state: doneState, draft: fullDraft });
        } else {
          update({ state: "writing" });
        }
      }
    },
    [session, update]
  );

  const handlePolish = useCallback(
    (text: string) => handleGenerate(text, "polish"),
    [handleGenerate]
  );

  const handleDraft = useCallback(
    (text: string) => handleGenerate(text, "draft"),
    [handleGenerate]
  );

  const handleContinue = useCallback(() => {
    if (!session) return;
    // Accept the current output as the new working text
    const outputText = draftText || session.draft || session.content;
    update({
      state: "writing",
      content: outputText,
      draft: null,
      draftMode: null,
      rawContent: null,
    });
    setDraftText("");
    setProvocationsData(null);
  }, [session, draftText, update]);

  const handleRevert = useCallback(() => {
    if (!session) return;
    const raw = session.rawContent || session.content;
    update({
      state: "writing",
      content: raw,
      draft: null,
      draftMode: null,
      rawContent: null,
    });
    setDraftText("");
    setProvocationsData(null);
  }, [session, update]);

  const handleDraftChange = useCallback(
    (v: string) => {
      setDraftText(v);
      if (!streaming) {
        update({ draft: v });
      }
    },
    [streaming, update]
  );

  const handleBack = useCallback(() => router.push("/"), [router]);

  const handleDownload = useCallback(() => {
    if (!session) return;
    const title = session.title || "pulp-draft";
    const date = new Date().toISOString().split("T")[0];
    downloadAsTxt(draftText, `${sanitizeFilename(title)}-${date}.txt`);
  }, [session, draftText]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted animate-pulse-slow font-mono text-[0.8125rem]">loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-muted font-mono text-[0.8125rem]">Session not found</div>
        <button
          onClick={() => router.push("/")}
          className="link-subtle text-[0.75rem] font-mono cursor-pointer"
        >
          go home
        </button>
      </div>
    );
  }

  const state = session.state;
  const showCanvas = state === "writing" || state === "probing";

  return (
    <div className="min-h-screen flex flex-col px-4 pt-10 pb-4">
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="icon-btn fixed top-3 left-3 z-10"
        aria-label="Back to home"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Error */}
      {error && (
        <div className="w-full max-w-2xl mx-auto mb-6 px-4 py-3 bg-accent-light border border-accent-highlight text-accent-dark text-[0.8125rem] font-mono rounded-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 underline cursor-pointer"
          >
            dismiss
          </button>
        </div>
      )}

      {/* Canvas: writing + probing */}
      {showCanvas && (
        <Canvas
          initialContent={session.content}
          onContentChange={handleContentChange}
          onProbe={handleProbe}
          onPolish={handlePolish}
          onDraft={handleDraft}
          probing={state === "probing"}
          direction={session.direction}
          provocationsData={provocationsData}
          probeCount={session.probeCount}
        />
      )}

      {/* Polish / Draft result */}
      {(state === "polishing" || state === "polish" || state === "drafting" || state === "draft") && (
        <DraftView
          draft={draftText}
          streaming={streaming}
          mode={session.draftMode || "draft"}
          onDraftChange={handleDraftChange}
          onContinue={handleContinue}
          onRevert={handleRevert}
          onBack={handleBack}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
