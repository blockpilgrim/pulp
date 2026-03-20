export type SessionState =
  | "writing"
  | "provoking"
  | "refining"
  | "refine"
  | "pressing"
  | "press";

export type DraftMode = "refine" | "soft" | "deep";

export type Session = {
  id: string;
  title: string;
  direction: string;
  createdAt: number;
  updatedAt: number;
  state: SessionState;
  content: string;
  provocationCount: number;
  draft: string | null;
  draftMode: DraftMode | null;
  rawContent: string | null;
};

export type PulpResponse = {
  fragments: { id: string; text: string }[];
  provocations: { id: string; afterFragmentId: string; text: string }[];
};
