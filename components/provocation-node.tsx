"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

export function ProvocationNode({ node, deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper contentEditable={false} className="provocation-block">
      <div className="provocation-block-inner">
        <p className="provocation" style={{ margin: 0 }}>
          <span className="provocation-text">{node.attrs.text}</span>
        </p>
        <button
          className="provocation-dismiss"
          onClick={deleteNode}
          aria-label="Dismiss provocation"
        >
          &times;
        </button>
      </div>
    </NodeViewWrapper>
  );
}
