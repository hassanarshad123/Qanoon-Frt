// Citation graph builder for Pakistani and UK court judgments
// Extracts inter-judgment citations from judgment text

export interface ExtractedCitation {
  rawCitation: string;      // Original citation string as found in text
  normalized: string;       // Normalized for matching
  context: string;          // ~200 chars surrounding the citation
}

// =============================================================================
// Pakistani citation patterns
// =============================================================================

// Pakistani law reports: PLD, SCMR, CLC, PCrLJ, YLR, MLD, PLJ, NLR, ALD, PSC
// Format: "PLD 1988 SC 416" or "1995 SCMR 1345" or "2020 CLC 1245 Lah"
const PK_CITATION_REGEX = new RegExp(
  "(?:" +
    // PLD year court page: "PLD 1988 SC 416"
    "PLD\\s+\\d{4}\\s+(?:SC|Lah|Kar|Pesh|Quetta|Isb|FSC|AJK)\\s+\\d+" +
    "|" +
    // Year REPORT page: "1995 SCMR 1345"
    "\\d{4}\\s+(?:SCMR|CLC|PCrLJ|YLR|MLD|PLJ|NLR|ALD|PSC|PLC|GBLR|PTD|FTR|TTR)\\s+\\d+" +
    "|" +
    // Year CLC page court: "2020 CLC 1245 Lah"
    "\\d{4}\\s+(?:CLC|PCrLJ|YLR|MLD|PLJ)\\s+\\d+\\s+(?:Lah|Kar|Pesh|Quetta|Isb|Bal)" +
  ")",
  "gi"
);

// =============================================================================
// UK citation patterns
// =============================================================================

// Neutral citations: [2020] UKSC 42, [2019] EWCA Civ 123
// Law reports: [1932] AC 562, [2010] 1 WLR 123
const UK_CITATION_REGEX = new RegExp(
  "(?:" +
    // Neutral citation: [2020] UKSC 42
    "\\[\\d{4}\\]\\s+(?:UKSC|UKHL|UKPC|EWCA\\s+(?:Civ|Crim)|EWHC(?:\\s+\\d+)?(?:\\s*\\((?:QB|Ch|Fam|Admin|Comm|Pat|TCC|IPEC)\\))?)\\s+\\d+" +
    "|" +
    // Law reports: [1932] AC 562, [2010] 1 WLR 123
    "\\[\\d{4}\\]\\s+(?:\\d+\\s+)?(?:AC|QB|WLR|All\\s*ER|Ch|Fam|ICR|IRLR|Lloyd'?s\\s*Rep)\\s+\\d+" +
  ")",
  "gi"
);

// =============================================================================
// Normalization
// =============================================================================

/**
 * Normalize a citation string for matching/deduplication.
 * Lowercases, strips extra whitespace, removes brackets.
 */
export function normalizeCitation(citation: string): string {
  return citation
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[\[\]]/g, "")
    .toLowerCase();
}

// =============================================================================
// Extraction
// =============================================================================

/**
 * Extract all citations from judgment text with surrounding context.
 */
export function extractCitations(text: string): ExtractedCitation[] {
  if (!text?.trim()) return [];

  const citations: ExtractedCitation[] = [];
  const seen = new Set<string>();

  // Extract Pakistani citations
  for (const match of Array.from(text.matchAll(PK_CITATION_REGEX))) {
    const raw = match[0].trim();
    const norm = normalizeCitation(raw);
    if (seen.has(norm)) continue;
    seen.add(norm);

    const start = Math.max(0, match.index! - 100);
    const end = Math.min(text.length, match.index! + raw.length + 100);
    const context = text.slice(start, end).replace(/\s+/g, " ").trim();

    citations.push({ rawCitation: raw, normalized: norm, context });
  }

  // Extract UK citations
  for (const match of Array.from(text.matchAll(UK_CITATION_REGEX))) {
    const raw = match[0].trim();
    const norm = normalizeCitation(raw);
    if (seen.has(norm)) continue;
    seen.add(norm);

    const start = Math.max(0, match.index! - 100);
    const end = Math.min(text.length, match.index! + raw.length + 100);
    const context = text.slice(start, end).replace(/\s+/g, " ").trim();

    citations.push({ rawCitation: raw, normalized: norm, context });
  }

  return citations;
}

/**
 * Check if a citation string is a Pakistani citation.
 */
export function isPakistaniCitation(citation: string): boolean {
  return PK_CITATION_REGEX.test(citation);
}

/**
 * Check if a citation string is a UK citation.
 */
export function isUKCitation(citation: string): boolean {
  return UK_CITATION_REGEX.test(citation);
}
