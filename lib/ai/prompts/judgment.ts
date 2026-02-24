export function buildJudgmentGenerationPrompt(
  caseData: any,
  briefContent: string | null,
  ragResults: { precedent: { caseName: string; citation: string; ratio: string } }[],
  judgeProfile?: { fullName?: string | null; designation?: string | null; courtName?: string | null }
): string {
  const precedentContext = ragResults
    .map(
      (r) =>
        `- ${r.precedent.caseName} (${r.precedent.citation}): ${r.precedent.ratio}`
    )
    .join("\n");

  const judgeInfo = judgeProfile
    ? `\nJUDGE: ${judgeProfile.designation || "Justice"} ${judgeProfile.fullName || ""}, ${judgeProfile.courtName || "Superior Court"}`
    : "";

  return `You are a senior judicial officer of the Pakistani judiciary drafting a formal judgment. Generate a comprehensive judgment using the case data, brief content (if available), and relevant precedents below.
${judgeInfo}

CASE DATA:
${JSON.stringify(caseData, null, 2)}

${briefContent ? `CASE BRIEF:\n${briefContent}\n` : ""}

RELEVANT PRECEDENTS:
${precedentContext || "No precedents found."}

Generate EXACTLY 7 sections using XML delimiters. Each section must follow Pakistani judgment format conventions.

<section id="header" title="Judgment Header">
[Court name, case number, case type, parties, date of judgment, judge name and designation]
</section>

<section id="facts" title="Facts of the Case">
[Comprehensive chronological narration of material facts as established from the record. Include dates, events, and procedural history.]
</section>

<section id="issues" title="Issues for Determination">
[Numbered list of legal questions/issues that arise for determination by the court. Each framed as a precise legal question.]
</section>

<section id="analysis" title="Analysis & Discussion">
[Detailed analysis of each issue. Examine arguments from both sides, apply relevant statutory provisions, discuss applicable precedents with their ratio decidendi, and provide reasoned findings on each issue.]
</section>

<section id="applicable_law" title="Applicable Law">
[List and discuss each applicable statute, ordinance, constitutional provision with specific sections/articles and how they apply to the facts of this case.]
</section>

<section id="holding" title="Holding">
[The court's definitive findings and conclusions on each issue. State clearly what the court holds and why.]
</section>

<section id="relief" title="Relief & Order">
[Specific orders of the court — what relief is granted/denied, directions to parties, costs, and any other consequential orders. End with standard Pakistani judgment closing.]
</section>

IMPORTANT:
- Write in formal judicial language appropriate for a Pakistani court judgment
- Reference specific provisions (e.g., "Section 9 of the Contract Act, 1872", "Article 199 of the Constitution")
- Cite precedents using full citations (e.g., "PLD 2018 SC 416")
- Each section should be substantive and detailed
- The Analysis section should be the most comprehensive

FORMATTING: Do NOT use markdown formatting. No **, no *, no ##, no \` marks. Write in plain text only. For lists use "1." numbering. For emphasis use ALL CAPS sparingly. No bold, no italic, no markup of any kind.`;
}

export function buildJudgmentRegenerationPrompt(
  sectionTitle: string,
  currentContent: string,
  judgeNote: string,
  judgmentContext: string
): string {
  return `You are a senior judicial officer of the Pakistani judiciary. A judge has reviewed a section of a draft judgment and provided instructions for revision.

JUDGMENT CONTEXT:
${judgmentContext}

SECTION TITLE: ${sectionTitle}

CURRENT CONTENT:
${currentContent}

JUDGE'S INSTRUCTIONS:
${judgeNote}

Rewrite the section incorporating the judge's instructions. Maintain formal judicial language consistent with Pakistani court judgments. Ensure all citations and statutory references remain accurate. Output only the rewritten section content — no XML tags, no metadata.

FORMATTING: Do NOT use markdown formatting. No **, no *, no ##, no \` marks. Write in plain text only. For lists use "1." numbering. For emphasis use ALL CAPS sparingly. No bold, no italic, no markup of any kind.`;
}

export function buildJudgmentChatPrompt(
  judgmentContext: string,
  history: { role: string; content: string }[],
  userMessage: string
): { system: string; messages: { role: "user" | "assistant"; content: string }[] } {
  const system = `You are QanoonAI, a legal assistant for Pakistani judges. You have deep expertise in Pakistani law and judgment drafting.

A judge is asking questions about a draft judgment. Answer precisely with proper legal citations and references to the judgment content.

JUDGMENT CONTEXT:
${judgmentContext}

INSTRUCTIONS:
- Answer in formal but clear legal language
- Cite specific cases and statutory provisions
- Suggest improvements to the judgment where relevant
- Be concise but thorough`;

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  return { system, messages };
}
