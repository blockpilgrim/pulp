"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "@/lib/store";
import { getAllUserText } from "@/lib/utils";
import type { Round, ExplodeResponse } from "@/lib/types";
import { Braindump } from "@/components/braindump";
import { ExplosionView } from "@/components/explosion-view";
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
    if (session.state === "exploding") {
      update({ state: session.currentRound > 0 ? "fill" : "braindump" });
    } else if (session.state === "drafting") {
      update({ state: "fill" });
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExplode = useCallback(async () => {
    if (!session) return;
    setError(null);

    const roundNumber = session.currentRound + 1;
    const textToExplode =
      roundNumber === 1
        ? braindumpText
        : getAllUserText({ braindump: braindumpText, rounds: session.rounds });

    update({
      braindump: braindumpText,
      state: "exploding",
      title: session.title || braindumpText.split(/[.\n]/)[0]?.trim().substring(0, 50) || "Untitled",
    });

    try {
      const res = await fetch("/api/explode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToExplode, roundNumber }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Explosion failed");
      }

      const data: ExplodeResponse = await res.json();

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
      update({ state: "explosion" });

      // Brief pause to let user see the explosion, then enable fill
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

  const handleReExplode = useCallback(() => {
    if (localRound) {
      updateRound(localRound.number, {
        provocations: localRound.provocations,
        freeformAddition: freeform,
      });
    }
    handleExplode();
  }, [localRound, freeform, updateRound, handleExplode]);

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

      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: allText }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Draft generation failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullDraft = "";

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
      setError(err instanceof Error ? err.message : "Something went wrong");
      update({ state: "fill" });
    }
  }, [session, braindumpText, localRound, freeform, update, updateRound]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted animate-pulse-slow font-mono text-sm">loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-muted font-mono text-sm">Session not found</div>
        <button
          onClick={() => router.push("/")}
          className="text-xs font-mono text-accent hover:underline cursor-pointer"
        >
          go home
        </button>
      </div>
    );
  }

  const state = session.state;
  const isFinalRound = session.currentRound >= session.maxRounds;

  return (
    <div className="min-h-screen flex flex-col px-4 pt-12 pb-16">
      {/* Header */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-xs font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          jubel
        </button>
        <RoundIndicator
          current={session.currentRound}
          max={session.maxRounds}
          state={state}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-2xl mx-auto mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-mono rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 underline cursor-pointer"
          >
            dismiss
          </button>
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
          onExplode={handleExplode}
          disabled={false}
        />
      )}

      {/* Loading: explosion */}
      {state === "exploding" && (
        <Loading message="breaking your thinking apart..." />
      )}

      {/* Explosion / Fill */}
      {(state === "explosion" || state === "fill") && localRound && (
        <ExplosionView
          round={localRound}
          fillMode={state === "fill"}
          freeformValue={freeform}
          onProvocationResponse={handleProvocationResponse}
          onFreeformChange={handleFreeformChange}
          onNext={isFinalRound ? handleDraft : handleReExplode}
          nextLabel={isFinalRound ? "Compose draft" : "Re-explode"}
          disabled={state === "explosion"}
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
        />
      )}
    </div>
  );
}
