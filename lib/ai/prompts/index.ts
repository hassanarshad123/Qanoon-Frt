// Barrel re-export — keeps existing `import from "@/lib/ai/prompts"` working
export { buildAnalysisPrompt, buildGenerationPrompt, buildRegenerationPrompt, buildChatPrompt } from "./brief";
export { buildResearchSystemPrompt, buildResearchUserMessage, buildTitleGenerationPrompt } from "./research";
export { buildJudgmentGenerationPrompt, buildJudgmentRegenerationPrompt, buildJudgmentChatPrompt } from "./judgment";
export { buildPrecedentRankingPrompt } from "./precedent-ranking";
