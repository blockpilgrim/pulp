export type SessionState =
  | "braindump"
  | "exploding"
  | "explosion"
  | "fill"
  | "drafting"
  | "draft"
  | "edit";

export type Fragment = {
  id: string;
  text: string;
  source: "braindump" | "fill";
  roundCreated: number;
};

export type Provocation = {
  id: string;
  text: string;
  afterFragmentId: string;
  response: string;
};

export type Round = {
  number: number;
  fragments: Fragment[];
  provocations: Provocation[];
  freeformAddition: string;
};

export type Session = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  state: SessionState;
  braindump: string;
  rounds: Round[];
  currentRound: number;
  maxRounds: number;
  draft: string | null;
};

export type ExplodeResponse = {
  fragments: { id: string; text: string }[];
  provocations: { id: string; afterFragmentId: string; text: string }[];
};
