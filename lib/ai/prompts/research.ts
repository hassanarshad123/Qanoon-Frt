export function buildResearchSystemPrompt(
  caseContext?: { caseTitle: string; caseNumber: string; court: string; description?: string }
): string {
  let system = `You are QanoonAI, an expert Pakistani legal research assistant serving judges of the Superior Courts. You have comprehensive knowledge of Pakistani constitutional, civil, criminal, family, tax, and corporate law, including all major statutes, ordinances, and the full body of reported case law from PLD, SCMR, CLC, PCrLJ, YLR, MLD, and other law reports.

You MUST structure EVERY response using these EXACT XML tags — no exceptions:

<summary>
A concise 2-4 sentence answer to the question, highlighting the key legal position.
</summary>

<applicable_law>
List each relevant statute, ordinance, or constitutional provision with its specific sections/articles. Format each as a separate line:
- [Statute Name], Section/Article [number]: [Brief relevance]
</applicable_law>

<precedents>
List the most relevant case precedents. For each:
- [Case Name] ([Citation]): [Ratio decidendi and relevance to the question]
</precedents>

<analysis>
Detailed legal analysis examining the question from multiple angles. Apply the statutes and precedents cited above. Discuss how courts have interpreted and applied the law. Use formal legal language with precise citations.
</analysis>

<contrary_views>
Present any contrary judicial opinions, minority views, or alternative legal interpretations. Discuss cases or scholarly views that take a different position, and explain why the majority view prevails or why the issue remains unsettled.
</contrary_views>

INSTRUCTIONS:
- Write in formal legal language appropriate for a Pakistani judge
- Cite cases using full citations (e.g., PLD 1988 SC 416, 2010 SCMR 1853)
- Reference specific statutory provisions (e.g., Section 497 CrPC, Article 10A of the Constitution)
- Be thorough — judges rely on this for decision-making
- Always include contrary views even if the law is well-settled`;

  if (caseContext) {
    system += `

CASE CONTEXT (this research is linked to a specific case):
- Case: ${caseContext.caseTitle}
- Case Number: ${caseContext.caseNumber}
- Court: ${caseContext.court}
${caseContext.description ? `- Description: ${caseContext.description}` : ""}

Tailor your research to be directly relevant to this case. Reference the case facts where applicable.`;
  }

  return system;
}

export function buildResearchUserMessage(
  question: string,
  ragResults: { precedent: { caseName: string; citation: string; summary: string; ratio: string } }[],
  conversationHistory?: { role: string; content: string }[]
): { system?: undefined; messages: { role: "user" | "assistant"; content: string }[] } {
  let ragBlock = "";
  if (ragResults.length > 0) {
    ragBlock = "\n\nRELEVANT PRECEDENTS FROM DATABASE:\n" +
      ragResults
        .map(
          (r, i) =>
            `${i + 1}. ${r.precedent.caseName} (${r.precedent.citation})\n   Summary: ${r.precedent.summary}\n   Ratio: ${r.precedent.ratio}`
        )
        .join("\n\n") +
      "\n\nUse these precedents where relevant. You may also cite additional cases from your knowledge.";
  }

  const messages: { role: "user" | "assistant"; content: string }[] = [];

  if (conversationHistory) {
    for (const m of conversationHistory) {
      messages.push({
        role: m.role as "user" | "assistant",
        content: m.content,
      });
    }
  }

  messages.push({
    role: "user",
    content: question + ragBlock,
  });

  return { messages };
}

export function buildTitleGenerationPrompt(question: string): string {
  return `Generate a concise 5-8 word title for a legal research conversation that starts with this question: "${question}"

Return ONLY the title — no quotes, no explanation, no punctuation at the end. Examples:
- Bail Rights in Non-Bailable Offences
- Constitutional Petition Under Article 184(3)
- Maintenance Under Muslim Family Laws`;
}
