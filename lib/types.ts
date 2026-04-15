export type MeterKey = "anxiety" | "trust" | "freedom" | "flow";

export type ActionKey =
  | "share"
  | "hold"
  | "factcheck"
  | "label"
  | "hide";

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

export type RumorTruthType = "true" | "false" | "half_true" | "misleading";

export type GameCard = {
  id: string;
  author: string;
  handle: string;
  body: string;
  timeLabel: string;
  likes: number;
  reposts: number;
  verified?: boolean;
  truthType: RumorTruthType;
  effects: Record<ActionKey, Effect>;
};

export type GameMode = {
  id: string;
  title: string;
  description: string;
  meters: MeterDefinition[];
  actions: ActionDefinition[];
  cards: GameCard[];
};

export type MeterState = Record<MeterKey, number>;