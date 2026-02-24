import type { ExtractedCaseData } from "@/lib/brief-pipeline/types";
import type { RAGSearchResult } from "@/lib/rag/types";

export function buildAnalysisPrompt(
  documentTexts: { fileName: string; text: string }[],
  chunkIndex?: number,
  totalChunks?: number
): string {
  const docs = documentTexts
    .map((d, i) => `--- DOCUMENT ${i + 1}: ${d.fileName} ---\n${d.text}`)
    .join("\n\n");

  const chunkNote =
    totalChunks != null && totalChunks > 1
      ? `\n\nNOTE: This is batch ${(chunkIndex ?? 0) + 1} of ${totalChunks}. Extract all information from THESE documents only. Other batches are being analyzed separately and results will be merged.\n`
      : "";

  return `You are a senior Pakistani legal expert with deep expertise in constitutional, civil, criminal, family, tax, and corporate law. Analyze the following court documents thoroughly and extract structured data.

Be exhaustive — identify every party, every legal issue, every statute reference, every argument made by each side.${chunkNote}

DOCUMENTS:
${docs}

Return a JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):
{
  "courtInfo": {
    "courtName": "string — full name of the court",
    "caseNumber": "string — case/petition number",
    "caseType": "string — e.g. Constitutional Petition, Criminal Appeal, Civil Suit",
    "filingDate": "string or null — date if mentioned",
    "judge": "string or null — presiding judge if mentioned"
  },
  "parties": [
    {
      "name": "string — full name",
      "role": "petitioner | respondent | appellant | other",
      "counsel": "string or null — advocate name if mentioned"
    }
  ],
  "facts": [
    {
      "content": "string — one material fact",
      "date": "string or null",
      "order": number
    }
  ],
  "legalIssues": [
    {
      "content": "string — framed legal question/issue",
      "relatedStatutes": ["string — statute references"]
    }
  ],
  "statutes": [
    {
      "name": "string — statute/act name",
      "provisions": ["string — section/article numbers"],
      "context": "string — how it applies"
    }
  ],
  "arguments": [
    {
      "content": "string — argument summary",
      "side": "petitioner | respondent",
      "supportingCitations": ["string — case citations mentioned"]
    }
  ]
}`;
}

export function buildGenerationPrompt(
  extractedData: ExtractedCaseData,
  ragResults: RAGSearchResult[]
): string {
  const precedentContext = ragResults
    .map(
      (r) =>
        `- ${r.precedent.caseName} (${r.precedent.citation}): ${r.precedent.ratio} [Relevance: ${r.relevanceScore}%]`
    )
    .join("\n");

  return `You are a senior judicial clerk preparing a comprehensive case brief for a Pakistani High Court judge. Generate a thorough, well-structured case brief using the extracted case data and relevant precedents below.

EXTRACTED CASE DATA:
${JSON.stringify(extractedData, null, 2)}

RELEVANT PRECEDENTS:
${precedentContext || "No precedents found."}

Generate EXACTLY 10 sections using XML delimiters. Each section must be comprehensive with proper legal formatting and reasoning. Reference precedents by their full citation where relevant.

Use this EXACT format for each section (output ALL 10 sections):

<section id="case_header" title="Case Header">
[Court name, case number, case type, parties vs parties, date]
</section>

<section id="parties" title="Parties & Representation">
[Full details of each party, their role, and their counsel/advocate]
</section>

<section id="material_facts" title="Material Facts">
[Numbered list of material facts in chronological order. Each fact should be a complete sentence.]
</section>

<section id="legal_issues" title="Legal Issues">
[Numbered list of legal questions/issues that arise from the facts. Frame each as a question the court must determine.]
</section>

<section id="statutes" title="Applicable Statutes">
[List each applicable statute with section/article numbers and how they apply to this case]
</section>

<section id="petitioner_arguments" title="Petitioner's Arguments">
[Numbered list of arguments made by the petitioner/appellant with supporting citations]
</section>

<section id="respondent_arguments" title="Respondent's Arguments">
[Numbered list of arguments made by the respondent with supporting citations]
</section>

<section id="precedents" title="Relevant Precedents">
[For each precedent, format as: number. Case Name (Citation): Brief explanation of ratio and how it applies to this case]
</section>

<section id="comparative_matrix" title="Comparative Matrix">
[For each legal issue, compare the petitioner's and respondent's positions side by side with supporting precedents]
</section>

<section id="analysis" title="Preliminary Analysis">
[Comprehensive judicial analysis examining each legal issue, weighing arguments from both sides, applying precedents, and providing preliminary observations. This should be the most detailed section.]
</section>

IMPORTANT:
- Write in formal legal language appropriate for a Pakistani court
- Reference specific provisions (e.g., "Article 16 of the Constitution", "Section 144 CrPC")
- Cite precedents using their full citations (e.g., "PLD 1988 SC 416")
- Be thorough and analytical — this brief will aid a judge in decision-making

FORMATTING: Do NOT use markdown formatting. No **, no *, no ##, no \` marks. Write in plain text only. For lists use "1." numbering. For emphasis use ALL CAPS sparingly. No bold, no italic, no markup of any kind.`;
}

export function buildRegenerationPrompt(
  sectionTitle: string,
  currentContent: string,
  judgeNote: string,
  briefContext: string
): string {
  return `You are a senior judicial clerk. A judge has reviewed a section of a case brief and provided feedback requesting changes.

BRIEF CONTEXT:
${briefContext}

SECTION TITLE: ${sectionTitle}

CURRENT CONTENT:
${currentContent}

JUDGE'S FEEDBACK:
${judgeNote}

Rewrite the section incorporating the judge's instructions. Maintain formal legal language and proper formatting consistent with the original. Ensure all citations and references remain accurate. Output only the rewritten section content — no XML tags, no metadata, just the improved content.

FORMATTING: Do NOT use markdown formatting. No **, no *, no ##, no \` marks. Write in plain text only. For lists use "1." numbering. For emphasis use ALL CAPS sparingly. No bold, no italic, no markup of any kind.`;
}

export function buildChatPrompt(
  briefContext: string,
  conversationHistory: { role: string; content: string }[],
  userMessage: string
): { system: string; messages: { role: "user" | "assistant"; content: string }[] } {
  const system = `You are QanoonAI, a legal research assistant for Pakistani judges. You have deep expertise in Pakistani constitutional, civil, criminal, family, tax, and corporate law.

A judge is asking questions about a case brief. Answer precisely with proper legal citations. Reference specific cases, statutes, and provisions where relevant.

BRIEF CONTEXT:
${briefContext}

INSTRUCTIONS:
- Answer in formal but clear legal language
- Cite specific cases using full citations (e.g., PLD 1988 SC 416)
- Reference specific statutory provisions (e.g., Article 16 of the Constitution)
- If you identify relevant precedents, explain their ratio decidendi
- Be concise but thorough — judges value precision`;

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...conversationHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  return { system, messages };
}
