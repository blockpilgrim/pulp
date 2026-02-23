"use client";

import { useState, useSyncExternalStore, useRef, useCallback } from "react";
import Link from "next/link";
import html2canvas from "html2canvas-pro";
import { decodeShareData, type DecodedShare } from "@/lib/share";

let cachedHash: string | undefined;
let cachedData: DecodedShare | null = null;

function getShareData(): DecodedShare | null {
  const hash = window.location.hash.slice(1);
  if (hash === cachedHash) return cachedData;
  cachedHash = hash;
  cachedData = hash ? decodeShareData(hash) : null;
  return cachedData;
}

const subscribe = () => () => {};
function useHashData(): DecodedShare | null {
  return useSyncExternalStore(subscribe, getShareData, () => null);
}

export default function SharePage() {
  const data = useHashData();
  const [imageStatus, setImageStatus] = useState<string>("copy as image");
  const contentRef = useRef<HTMLDivElement>(null);

  const addWatermark = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    const text = "made with pulp";
    const fontSize = 11 * 2; // 11px at 2x pixel ratio
    ctx.font = `${fontSize}px "iA Writer Mono", monospace`;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted-light").trim();
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height - fontSize);
    return canvas;
  }, []);

  const captureImage = useCallback(async () => {
    if (!contentRef.current) return null;
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
    const source = await html2canvas(contentRef.current, {
      backgroundColor: bg,
      scale: 2,
    });
    // Add watermark below captured content
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height + 48;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0);
    addWatermark(canvas);
    return canvas.toDataURL("image/png");
  }, [addWatermark]);

  const handleCopyImage = useCallback(async () => {
    if (!contentRef.current) return;
    setImageStatus("capturing...");
    try {
      const dataUrl = await captureImage();
      if (!dataUrl) return;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setImageStatus("copied");
      setTimeout(() => setImageStatus("copy as image"), 2000);
    } catch {
      // Fallback: download the image
      try {
        const dataUrl = await captureImage();
        if (!dataUrl) return;
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "pulp-session.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setImageStatus("downloaded");
        setTimeout(() => setImageStatus("copy as image"), 2000);
      } catch {
        setImageStatus("failed");
        setTimeout(() => setImageStatus("copy as image"), 2000);
      }
    }
  }, [captureImage]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-muted font-mono text-[0.8125rem]">Nothing to show</div>
        <Link href="/" className="link-subtle text-[0.75rem] font-mono">go home</Link>
      </div>
    );
  }

  // Build provocation lookup by afterFragmentId
  const provMap = new Map<string, typeof data.provocations>();
  for (const p of data.provocations) {
    const list = provMap.get(p.afterFragmentId) || [];
    list.push(p);
    provMap.set(p.afterFragmentId, list);
  }

  return (
    <div className="min-h-screen flex flex-col px-4 pt-10 pb-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Capturable content area */}
        <div ref={contentRef} className="share-content pt-8 px-8 pb-4">
          {data.direction && (
            <div className="text-[0.75rem] font-mono text-muted-light italic mb-6">
              {data.direction}
            </div>
          )}

          {data.fragments.flatMap((frag) => {
            const nodes: React.ReactNode[] = [];
            frag.text.split(/\n\n+/).forEach((para, i) => {
              const trimmed = para.trim();
              if (trimmed) {
                nodes.push(
                  <p key={`${frag.id}-${i}`} className="share-paragraph">
                    {trimmed}
                  </p>
                );
              }
            });
            provMap.get(frag.id)?.forEach((prov) => {
              nodes.push(
                <p key={prov.id} className="share-provocation">
                  <span className="provocation-text">{prov.text}</span>
                </p>
              );
            });
            return nodes;
          })}
        </div>

        {/* Footer — outside capturable area */}
        <div className="mt-8 pt-4 border-t border-border-light">
          <div className="flex items-center justify-between">
            <Link href="/" className="link-subtle text-[0.6875rem] font-mono tracking-[0.04em]">
              made with pulp
            </Link>
            <button
              onClick={handleCopyImage}
              className="link-subtle text-[0.6875rem] font-mono cursor-pointer"
            >
              {imageStatus}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
