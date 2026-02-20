"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "@/lib/store";
import { getAllUserText, sanitizeFilename, downloadAsTxt } from "@/lib/utils";
import { getApiKey } from "@/lib/api-key";
import type { Round, PulpResponse } from "@/lib/types";
import { Braindump } from "@/components/braindump";
import { PulpView } from "@/components/pulp-view";
import { DraftView } from "@/components/draft-view";
import { RoundIndicator } from "@/components/round-indicator";
import { Loading } from "@/components/loading";

export default function WritePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { session, loaded, update, addRound, updateRound } = useSession(id);

  const [braindumpText, setBraindumpText] = useState("");
  const [localRound, setLocalRound] = useState<Round | null>(null);
  const [freeform, setFreeform] = useState("");
  const [draftText, setDraftText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Warn before closing during active API calls
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (streaming || session?.state === "pulping") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [streaming, session?.state]);

  // Sync from persisted session on load
  useEffect(() => {
    if (!session) return;
    setBraindumpText(session.braindump);
    if (session.rounds.length > 0) {
      const latest = session.rounds[session.rounds.length - 1];
      setLocalRound(latest);
      setFreeform(latest.freeformAddition);
    }
    if (session.draft) {
      setDraftText(session.draft);
    }
    // If user closed tab during API call, reset to usable state
    if (session.state === "pulping") {
      update({ state: session.currentRound > 0 ? "fill" : "braindump" });
    } else if (session.state === "drafting") {
      update({ state: "fill" });
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePulp = useCallback(async () => {
    if (!session) return;
    setError(null);

    const roundNumber = session.currentRound + 1;
    const textToPulp =
      roundNumber === 1
        ? braindumpText
        : getAllUserText({ braindump: braindumpText, rounds: session.rounds });

    update({
      braindump: braindumpText,
      state: "pulping",
      title: session.title || braindumpText.split(/[.\n]/)[0]?.trim().substring(0, 50) || "Untitled",
    });

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const key = getApiKey();
      if (key) headers["x-api-key"] = key;

      const res = await fetch("/api/pulp", {
        method: "POST",
        headers,
        body: JSON.stringify({ text: textToPulp, roundNumber, direction: session.direction }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Something went wrong");
      }

      const data: PulpResponse = await res.json();

      const round: Round = {
        number: roundNumber,
        fragments: data.fragments.map((f) => ({
          ...f,
          source: roundNumber === 1 ? ("braindump" as const) : ("fill" as const),
          roundCreated: roundNumber,
        })),
        provocations: data.provocations.map((p) => ({
          ...p,
          response: "",
        })),
        freeformAddition: "",
      };

      addRound(round);
      setLocalRound(round);
      setFreeform("");
      update({ state: "pulped" });

      // Brief pause to let user see the result, then enable fill
      setTimeout(() => {
        update({ state: "fill" });
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      update({ state: session.currentRound > 0 ? "fill" : "braindump" });
    }
  }, [session, braindumpText, update, addRound]);

  const handleProvocationResponse = useCallback(
    (provocationId: string, value: string) => {
      if (!localRound) return;
      const updated = {
        ...localRound,
        provocations: localRound.provocations.map((p) =>
          p.id === provocationId ? { ...p, response: value } : p
        ),
      };
      setLocalRound(updated);
      updateRound(localRound.number, { provocations: updated.provocations });
    },
    [localRound, updateRound]
  );

  const handleFreeformChange = useCallback(
    (value: string) => {
      setFreeform(value);
      if (localRound) {
        updateRound(localRound.number, { freeformAddition: value });
      }
    },
    [localRound, updateRound]
  );

  const handleRePulp = useCallback(() => {
    if (localRound) {
      updateRound(localRound.number, {
        provocations: localRound.provocations,
        freeformAddition: freeform,
      });
    }
    handlePulp();
  }, [localRound, freeform, updateRound, handlePulp]);

  const handleDraft = useCallback(async () => {
    if (!session) return;
    setError(null);

    // Save current fill state before drafting
    if (localRound) {
      updateRound(localRound.number, {
        provocations: localRound.provocations,
        freeformAddition: freeform,
      });
    }

    update({ state: "drafting" });
    setDraftText("");
    setStreaming(true);

    let fullDraft = "";
    try {
      // Use localRound for latest responses (session.rounds may be stale)
      const roundsForDraft = localRound
        ? [
            ...session.rounds.filter((r) => r.number !== localRound.number),
            { ...localRound, freeformAddition: freeform },
          ]
        : session.rounds;

      const allText = getAllUserText({
        braindump: braindumpText,
        rounds: roundsForDraft,
      });

      const draftHeaders: Record<string, string> = { "Content-Type": "application/json" };
      const draftKey = getApiKey();
      if (draftKey) draftHeaders["x-api-key"] = draftKey;

      const res = await fetch("/api/draft", {
        method: "POST",
        headers: draftHeaders,
        body: JSON.stringify({ text: allText, direction: session.direction }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Draft generation failed");
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
        // Flush any remaining buffered bytes
        const remaining = decoder.decode();
        if (remaining) {
          fullDraft += remaining;
          setDraftText(fullDraft);
        }
      }

      setStreaming(false);
      update({ state: "draft", draft: fullDraft });
    } catch (err) {
      setStreaming(false);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      // Save partial draft if we got any content
      if (fullDraft.length > 0) {
        update({ state: "draft", draft: fullDraft });
      } else {
        update({ state: "fill" });
      }
    }
  }, [session, braindumpText, localRound, freeform, update, updateRound]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted animate-pulse-slow font-mono text-[0.8rem]">loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-muted font-mono text-[0.8rem]">Session not found</div>
        <button
          onClick={() => router.push("/")}
          className="link-subtle text-[0.72rem] font-mono cursor-pointer"
        >
          go home
        </button>
      </div>
    );
  }

  const state = session.state;

  return (
    <div className="min-h-screen flex flex-col px-4 pt-12 pb-4">
      {/* Header */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/")}
          className="link-subtle text-[0.72rem] font-mono cursor-pointer"
        >
          pulp
        </button>
        <RoundIndicator
          current={session.currentRound}
          state={state}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-2xl mx-auto mb-6 px-4 py-3 bg-accent-light border border-accent-highlight text-accent-dark text-[0.82rem] font-mono rounded-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 underline cursor-pointer"
          >
            dismiss
          </button>
        </div>
      )}

      {/* Direction hint */}
      {state === "braindump" && session.direction && (
        <div className="w-full max-w-2xl mx-auto mb-2">
          <div className="text-[0.75rem] font-mono text-muted-light italic">
            {session.direction}
          </div>
        </div>
      )}

      {/* Braindump */}
      {state === "braindump" && (
        <Braindump
          value={braindumpText}
          onChange={(v) => {
            setBraindumpText(v);
            update({ braindump: v });
          }}
          onPulp={handlePulp}
          disabled={false}
        />
      )}

      {/* Loading: pulping */}
      {state === "pulping" && (
        <Loading message="thinking..." />
      )}

      {/* Pulped / Fill */}
      {(state === "pulped" || state === "fill") && localRound && (
        <PulpView
          round={localRound}
          fillMode={state === "fill"}
          freeformValue={freeform}
          onProvocationResponse={handleProvocationResponse}
          onFreeformChange={handleFreeformChange}
          onPulpAgain={handleRePulp}
          onPress={handleDraft}
          disabled={state === "pulped"}
        />
      )}

      {/* Draft: single instance across drafting/draft/edit to prevent remount flash */}
      {(state === "drafting" || state === "draft" || state === "edit") && (
        <DraftView
          draft={draftText}
          streaming={streaming}
          onDraftChange={(v) => {
            setDraftText(v);
            if (!streaming) {
              update({ draft: v });
            }
          }}
          onBack={() => router.push("/")}
          onDownload={() => {
            const title = session.title || "pulp-draft";
            const date = new Date().toISOString().split("T")[0];
            downloadAsTxt(draftText, `${sanitizeFilename(title)}-${date}.txt`);
          }}
        />
      )}
    </div>
  );
}
