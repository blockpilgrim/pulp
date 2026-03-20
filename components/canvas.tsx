"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { ProvocationExtension } from "@/lib/provocation-extension";
import { useEffect, useRef, useState } from "react";
import type { PulpResponse } from "@/lib/types";
import type { JSONContent } from "@tiptap/core";
import { encodeShareData } from "@/lib/share";

function contentStringToDoc(text: string): JSONContent {
  const paragraphs = text.split(/\n\n+/);
  return {
    type: "doc",
    content: paragraphs.map((p) => ({
      type: "paragraph",
      content: p.trim() ? [{ type: "text", text: p }] : [],
    })),
  };
}

function extractUserText(editor: ReturnType<typeof useEditor>): string {
  if (!editor) return "";
  const parts: string[] = [];
  editor.state.doc.forEach((node) => {
    if (node.type.name === "paragraph") {
      parts.push(node.textContent);
    }
  });
  return parts.join("\n\n");
}

function buildDocWithProvocations(
  sourceText: string,
  fragments: PulpResponse["fragments"],
  provocations: PulpResponse["provocations"]
): JSONContent {
  const provMap = new Map<string, typeof provocations>();
  for (const p of provocations) {
    const list = provMap.get(p.afterFragmentId) || [];
    list.push(p);
    provMap.set(p.afterFragmentId, list);
  }

  const content: JSONContent[] = [];
  let lastIndex = 0;

  for (const frag of fragments) {
    const fragIndex = sourceText.indexOf(frag.text, lastIndex);

    // Add gap text before this fragment
    if (fragIndex > lastIndex) {
      const gap = sourceText.substring(lastIndex, fragIndex);
      for (const line of gap.split(/\n\n+/)) {
        if (line.trim()) {
          content.push({
            type: "paragraph",
            content: [{ type: "text", text: line }],
          });
        }
      }
    }

    // Add fragment paragraphs
    const fragParagraphs = frag.text.split(/\n\n+/);
    for (const p of fragParagraphs) {
      if (p.trim()) {
        content.push({
          type: "paragraph",
          content: [{ type: "text", text: p }],
        });
      }
    }

    // Add provocations after this fragment
    const fragProvs = provMap.get(frag.id);
    if (fragProvs) {
      for (const prov of fragProvs) {
        content.push({
          type: "provocation",
          attrs: { id: prov.id, text: prov.text },
        });
      }
    }

    lastIndex = fragIndex >= 0 ? fragIndex + frag.text.length : lastIndex + frag.text.length;
  }

  // Add trailing text
  if (lastIndex < sourceText.length) {
    const trailing = sourceText.substring(lastIndex);
    for (const line of trailing.split(/\n\n+/)) {
      if (line.trim()) {
        content.push({
          type: "paragraph",
          content: [{ type: "text", text: line }],
        });
      }
    }
  }

  // Ensure at least one paragraph
  if (content.length === 0) {
    content.push({ type: "paragraph" });
  }

  return { type: "doc", content };
}

export function Canvas({
  initialContent,
  onContentChange,
  onProvoke,
  onRefine,
  onPress,
  provoking,
  title,
  direction,
  provocationsData,
  provocationCount = 0,
}: {
  initialContent: string;
  onContentChange: (text: string) => void;
  onProvoke: (text: string) => void;
  onRefine: (text: string) => void;
  onPress: (text: string, intensity: "soft" | "deep") => void;
  provoking: boolean;
  title: string;
  direction: string;
  provocationsData: PulpResponse | null;
  provocationCount?: number;
}) {
  const contentRef = useRef(initialContent);
  const provocationsAppliedRef = useRef<PulpResponse | null>(null);
  const [shareLabel, setShareLabel] = useState("share");
  const [pressOpen, setPressOpen] = useState(false);
  const pressMenuRef = useRef<HTMLDivElement>(null);

  // Focus first menu item on open, close on Escape
  useEffect(() => {
    if (!pressOpen) return;
    const menu = pressMenuRef.current;
    const firstItem = menu?.querySelector<HTMLButtonElement>("[role=menuitem]");
    firstItem?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPressOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pressOpen]);

  const handleShare = () => {
    if (!provocationsData) return;
    const encoded = encodeShareData(title, direction, provocationsData);
    if (!encoded) {
      setShareLabel("too long");
      setTimeout(() => setShareLabel("share"), 2000);
      return;
    }
    const url = `${window.location.origin}/share#${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareLabel("link copied");
      setTimeout(() => setShareLabel("share"), 2000);
    });
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Write freely. No structure needed. Just think out loud...",
      }),
      ProvocationExtension,
    ],
    content: initialContent ? contentStringToDoc(initialContent) : undefined,
    editable: !provoking,
    onUpdate: ({ editor }) => {
      const text = extractUserText(editor);
      contentRef.current = text;
      onContentChange(text);
    },
  });

  // Sync editable state with provoking
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!provoking);
  }, [editor, provoking]);

  // Insert provocations when data arrives
  useEffect(() => {
    if (!editor || !provocationsData || provocationsData === provocationsAppliedRef.current) return;
    provocationsAppliedRef.current = provocationsData;

    const userText = contentRef.current;
    const doc = buildDocWithProvocations(
      userText,
      provocationsData.fragments,
      provocationsData.provocations
    );
    editor.commands.setContent(doc);
  }, [editor, provocationsData]);

  // Focus editor on mount
  useEffect(() => {
    if (editor && !provoking) {
      // Small delay to let the editor render
      setTimeout(() => editor.commands.focus("end"), 50);
    }
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  const userText = editor ? extractUserText(editor) : contentRef.current;
  const canProvoke = userText.trim().length > 20;
  const wordCount = userText.trim() ? userText.trim().split(/\s+/).length : 0;
  const hasStats = wordCount > 0 || provocationCount > 0 || !!provocationsData;

  return (
    <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
      {direction && (
        <div className="mb-2">
          <div className="text-[0.75rem] font-mono text-muted-light italic">
            {direction}
          </div>
        </div>
      )}

      <div className="tiptap-editor-wrapper flex-1">
        <EditorContent editor={editor} />
      </div>

      <div className="stats-hover-zone flex flex-col items-center pt-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const text = editor ? extractUserText(editor) : contentRef.current;
              onProvoke(text);
            }}
            disabled={!canProvoke || provoking}
            className="btn-ghost"
          >
            {provoking ? "Thinking..." : "Provoke"}
          </button>
          <button
            onClick={() => {
              const text = editor ? extractUserText(editor) : contentRef.current;
              onRefine(text);
            }}
            disabled={!canProvoke || provoking}
            className="btn-ghost"
          >
            Refine
          </button>
          <div className="relative">
            <button
              onClick={() => setPressOpen(!pressOpen)}
              disabled={!canProvoke || provoking}
              className="btn-ghost"
              aria-expanded={pressOpen}
              aria-haspopup="true"
            >
              Press <span className="ml-1 text-[0.625rem] opacity-50">▾</span>
            </button>
            {pressOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPressOpen(false)}
                />
                <div ref={pressMenuRef} className="press-dropdown absolute bottom-full right-0 mb-2 z-20 min-w-[10rem]" role="menu">
                  <button
                    role="menuitem"
                    onClick={() => {
                      setPressOpen(false);
                      const text = editor ? extractUserText(editor) : contentRef.current;
                      onPress(text, "soft");
                    }}
                  >
                    <div>Soft</div>
                    <div className="text-[0.625rem] text-muted-light mt-0.5">stays close to your words</div>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setPressOpen(false);
                      const text = editor ? extractUserText(editor) : contentRef.current;
                      onPress(text, "deep");
                    }}
                  >
                    <div>Deep</div>
                    <div className="text-[0.625rem] text-muted-light mt-0.5">full creative latitude</div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {hasStats && (
          <div className="stats-reveal mt-4 text-[0.6875rem] font-mono text-muted-light tracking-[0.08em] flex items-center gap-3">
            {wordCount > 0 && <span>{wordCount} word{wordCount === 1 ? "" : "s"}</span>}
            {provocationCount > 0 && <span>provoked {provocationCount}x</span>}
            {provocationsData && (
              <button
                onClick={handleShare}
                className="link-subtle cursor-pointer"
              >
                {shareLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
