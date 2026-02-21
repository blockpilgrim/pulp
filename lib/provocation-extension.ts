import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ProvocationNode } from "@/components/provocation-node";

export const ProvocationExtension = Node.create({
  name: "provocation",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      id: { default: null },
      text: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-provocation]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-provocation": "" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ProvocationNode);
  },
});
