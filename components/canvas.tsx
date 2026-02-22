"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { ProvocationExtension } from "@/lib/provocation-extension";
import { useEffect, useRef } from "react";
import type { PulpResponse } from "@/lib/types";
import type { JSONContent } from "@tiptap/core";

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
  onProbe,
  onPolish,
  onDraft,
  probing,
  direction,
  provocationsData,
  probeCount = 0,
}: {
  initialContent: string;
  onContentChange: (text: string) => void;
  onProbe: (text: string) => void;
  onPolish: (text: string) => void;
  onDraft: (text: string) => void;
  probing: boolean;
  direction: string;
  provocationsData: PulpResponse | null;
  probeCount?: number;
}) {
  const contentRef = useRef(initialContent);
  const provocationsAppliedRef = useRef<PulpResponse | null>(null);

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
    editable: !probing,
    onUpdate: ({ editor }) => {
      const text = extractUserText(editor);
      contentRef.current = text;
      onContentChange(text);
    },
  });

  // Sync editable state with probing
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!probing);
  }, [editor, probing]);

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
    if (editor && !probing) {
      // Small delay to let the editor render
      setTimeout(() => editor.commands.focus("end"), 50);
    }
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  const userText = editor ? extractUserText(editor) : contentRef.current;
  const canProbe = userText.trim().length > 20;
  const wordCount = userText.trim() ? userText.trim().split(/\s+/).length : 0;

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

      <div className="flex items-center justify-between py-4">
        <div className="text-[0.6875rem] font-mono text-muted-light tracking-[0.08em] flex items-center gap-3">
          {wordCount > 0 && <span>{wordCount} word{wordCount === 1 ? "" : "s"}</span>}
          {probeCount > 0 && <span>provoked {probeCount}x</span>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const text = editor ? extractUserText(editor) : contentRef.current;
              onProbe(text);
            }}
            disabled={!canProbe || probing}
            className="btn-primary"
          >
            {probing ? "Thinking..." : "Provoke"}
          </button>
          <button
            onClick={() => {
              const text = editor ? extractUserText(editor) : contentRef.current;
              onPolish(text);
            }}
            disabled={!canProbe || probing}
            className="btn-ghost"
          >
            Polish
          </button>
          <button
            onClick={() => {
              const text = editor ? extractUserText(editor) : contentRef.current;
              onDraft(text);
            }}
            disabled={!canProbe || probing}
            className="btn-ghost"
          >
            Press
          </button>
        </div>
      </div>
    </div>
  );
}
