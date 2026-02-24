export const AI_MODELS = {
  analyze: "claude-sonnet-4-20250514",
  generate: "claude-sonnet-4-20250514",
  regenerate: "claude-sonnet-4-20250514",
  chat: "claude-sonnet-4-20250514",
  rank_precedents: "claude-haiku-4-5-20251001",
  research: "claude-sonnet-4-20250514",
  title_generation: "claude-haiku-4-5-20251001",
} as const;

export type AITask = keyof typeof AI_MODELS;
