export type SessionState =
  | "writing"
  | "probing"
  | "drafting"
  | "draft";

export type Session = {
  id: string;
  title: string;
  direction: string;
  createdAt: number;
  updatedAt: number;
  state: SessionState;
  content: string;
  probeCount: number;
  draft: string | null;
};

export type PulpResponse = {
  fragments: { id: string; text: string }[];
  provocations: { id: string; afterFragmentId: string; text: string }[];
};
