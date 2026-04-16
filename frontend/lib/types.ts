export type MeterKey =
  | "anxiety"
  | "trust"
  | "freedom"
  | "flow"
  | "risk"
  | "money"
  | "safety"
  | "alertness";

export type ActionKey =
  | "share"
  | "hold"
  | "factcheck"
  | "label"
  | "hide"
  | "apply"
  | "investigate"
  | "report"
  | "block";

export type Effect = Partial<Record<MeterKey, number>>;

export type MeterDefinition = {
  key: MeterKey;
  label: string;
  initial: number;
  min?: number;
  max?: number;
};

export type ActionDefinition = {
  key: ActionKey;
  label: string;
};

export type CardType = "rumor" | "job";

export type GameCard = {
  id: string;
  type: CardType;
  title?: string;
  body: string;
  effects: Record<ActionKey, Effect>;

  author?: string;
  handle?: string;
  timeLabel?: string;
  likes?: number;
  reposts?: number;
  verified?: boolean;

  company?: string;
  wage?: string;
  location?: string;
  shift?: string;
  tags?: string[];
  contact?: string;
};

export type GameMode = {
  id: string;
  title: string;
  description: string;
  meters: MeterDefinition[];
  actions: ActionDefinition[];
  cards: GameCard[];
};

export type MeterState = Partial<Record<MeterKey, number>>;