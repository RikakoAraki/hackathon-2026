export type MeterKey =
  | "anxiety"
  | "trust"
  | "freedom"
  | "flow"
  | "risk"
  | "money"
  | "safety"
  | "alertness"
  | "awareness";

export type ActionKey =
  | "share"
  | "hold"
  | "factcheck"
  | "label"
  | "hide"
  | "apply"
  | "investigate"
  | "report"
  | "block"
  | "ignore";

export type EffectValues = Partial<Record<MeterKey, number>>;

export type CardEffect = {
  values: EffectValues;
};

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
  type?: CardType;
  title?: string;
  body?: string;
  description?: string;
  effects: Partial<Record<ActionKey, CardEffect>>;

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

  working_hours?: string;
  requirements?: string;
  benefits?: string;
  how_to_apply?: string;
  company_message?: string;
};

export type GameMode = {
  id?: string;
  title: string;
  description: string;
  meters: MeterDefinition[];
  actions: ActionDefinition[];
  cards: GameCard[];
  ending_comments?: {
    title: string;
    body: string;
  }[] | null;
};

export type MeterState = Partial<Record<MeterKey, number>>;

export type RumorCard = {
  id: string;
  body: string;
  author: string;
  is_verified: boolean;
  correct_action: ActionKey;
  partial_actions?: ActionKey[];
  reason: string;
};

export type RumorGameMode = {
  title: string;
  description: string;
  actions: ActionDefinition[];
  cards: RumorCard[];
};