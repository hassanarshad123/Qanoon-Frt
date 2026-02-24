// Smart legal document chunker for Pakistani/UK court judgments
// Hybrid multi-level strategy that preserves legal document structure

import type { ChunkRecord } from "./types";

// =============================================================================
// Section heading patterns
// =============================================================================

// Pakistani judgment headings
const PK_SECTION_PATTERNS = [
  /^(?:FACTS?|STATEMENT OF FACTS?)\s*[:\-.]?\s*$/im,
  /^(?:ISSUES?|QUESTIONS? (?:OF LAW|FOR DETERMINATION))\s*[:\-.]?\s*$/im,
  /^(?:ARGUMENTS?|SUBMISSIONS?|CONTENTIONS?)\s*[:\-.]?\s*$/im,
  /^(?:ARGUMENTS? (?:ON BEHALF|BY) (?:(?:THE )?PETITIONER|(?:THE )?APPELLANT))\s*[:\-.]?\s*$/im,
  /^(?:ARGUMENTS? (?:ON BEHALF|BY) (?:(?:THE )?RESPONDENT|(?:THE )?STATE))\s*[:\-.]?\s*$/im,
  /^(?:HOLDING|DECISION|JUDGMENT|FINDINGS?)\s*[:\-.]?\s*$/im,
  /^(?:RATIO DECIDENDI|RATIO)\s*[:\-.]?\s*$/im,
  /^(?:ORDER|SHORT ORDER|OPERATIVE ORDER)\s*[:\-.]?\s*$/im,
  /^(?:DISSENT(?:ING)?|MINORITY)(?: OPINION| VIEW| NOTE)?\s*[:\-.]?\s*$/im,
  /^(?:CONCURR(?:ING|ENCE))(?: OPINION| NOTE)?\s*[:\-.]?\s*$/im,
  /^(?:ANALYSIS|DISCUSSION|REASONING)\s*[:\-.]?\s*$/im,
  /^(?:RELIEF|PRAYER|DISPOSITION)\s*[:\-.]?\s*$/im,
  /^(?:PRELIMINARY|BACKGROUND|INTRODUCTION|PREAMBLE)\s*[:\-.]?\s*$/im,
  /^(?:APPLICABLE LAW|RELEVANT (?:LAW|PROVISIONS?|STATUT(?:E|ORY) PROVISIONS?))\s*[:\-.]?\s*$/im,
  /^(?:PRECEDENTS?|CASE LAW|AUTHORITIES?)\s*[:\-.]?\s*$/im,
];

// UK judgment headings
const UK_SECTION_PATTERNS = [
  /^(?:INTRODUCTION|BACKGROUND)\s*$/im,
  /^(?:THE FACTS?|FACTUAL BACKGROUND)\s*$/im,
  /^(?:THE (?:LEGAL |STATUTORY )?FRAMEWORK)\s*$/im,
  /^(?:THE ISSUES?|ISSUES? ARISING)\s*$/im,
  /^(?:(?:THE )?SUBMISSIONS?)\s*$/im,
  /^(?:DISCUSSION|ANALYSIS|REASONING)\s*$/im,
  /^(?:(?:THE )?JUDGMENT|DECISION|CONCLUSION)\s*$/im,
  /^(?:DISPOSITION|RESULT|ORDER)\s*$/im,
  /^(?:LORD|LADY)\s+\w+\s*$/im, // "Lord Reed", "Lady Hale" etc.
  /^(?:DISSENTING|CONCURRING)\s+(?:JUDGMENT|OPINION)\s*$/im,
];

const ALL_SECTION_PATTERNS = [...PK_SECTION_PATTERNS, ...UK_SECTION_PATTERNS];

// Numbered paragraph pattern common in both jurisdictions: "1.", "2.", "[1]", "[2]"
const NUMBERED_PARA = /^(?:\[?\d+\]?\.?\s)/;

// =============================================================================
// Token estimation (simple word-based approximation)
// =============================================================================

function estimateTokens(text: string): number {
  // ~1.3 tokens per word for English legal text
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

// =============================================================================
// Section detection
// =============================================================================

interface Section {
  label: string;
  content: string;
}

function detectSections(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentLabel = "Preamble";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      currentLines.push("");
      continue;
    }

    // Check if this line is a section heading
    let isHeading = false;
    let headingLabel = "";

    for (const pattern of ALL_SECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        isHeading = true;
        headingLabel = trimmed.replace(/[:\-.\s]+$/, "").trim();
        break;
      }
    }

    if (isHeading) {
      // Save previous section if it has content
      const content = currentLines.join("\n").trim();
      if (content) {
        sections.push({ label: currentLabel, content });
      }
      currentLabel = headingLabel;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Save the last section
  const content = currentLines.join("\n").trim();
  if (content) {
    sections.push({ label: currentLabel, content });
  }

  return sections;
}

// =============================================================================
// Paragraph splitting with overlap
// =============================================================================

function splitIntoParagraphChunks(
  text: string,
  maxTokens: number,
  overlapTokens: number
): string[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentTokens = 0;

  for (const para of paragraphs) {
    const paraTokens = estimateTokens(para);

    if (currentTokens + paraTokens > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join("\n\n"));

      // Keep overlap paragraphs
      const overlapChunk: string[] = [];
      let overlapCount = 0;
      for (let i = currentChunk.length - 1; i >= 0; i--) {
        const t = estimateTokens(currentChunk[i]);
        if (overlapCount + t > overlapTokens) break;
        overlapChunk.unshift(currentChunk[i]);
        overlapCount += t;
      }
      currentChunk = overlapChunk;
      currentTokens = overlapCount;
    }

    currentChunk.push(para);
    currentTokens += paraTokens;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join("\n\n"));
  }

  return chunks;
}

// =============================================================================
// Main chunking function
// =============================================================================

const MAX_SECTION_TOKENS = 1500;
const OVERLAP_TOKENS = 150;
const MIN_SECTIONS_FOR_STRUCTURED = 3;

export interface ChunkingResult {
  chunks: ChunkRecord[];
  strategy: string; // 'document_only' | 'document_and_sections' | 'document_and_paragraphs'
}

/**
 * Chunk a legal judgment using a hybrid multi-level strategy.
 *
 * 1. Always creates a document-level summary chunk
 * 2. Detects sections using regex patterns for PK/UK judgment headings
 * 3. If 3+ sections → per-section chunks (with paragraph sub-splits for long sections)
 * 4. If <3 sections → paragraph-level overlapping chunks
 */
export function chunkJudgment(record: {
  caseName: string;
  citation: string;
  summary?: string;
  ratio?: string;
  headnotes?: string[];
  keywords?: string[];
  fullText?: string;
}): ChunkingResult {
  const chunks: ChunkRecord[] = [];
  let chunkIndex = 0;

  // 1. Always create document-level summary chunk
  const summaryParts = [
    record.caseName,
    record.citation,
    record.summary,
    record.ratio,
    ...(record.headnotes ?? []),
    (record.keywords ?? []).join(", "),
  ].filter(Boolean);

  const summaryText = summaryParts.join("\n\n");
  chunks.push({
    chunkType: "summary",
    sectionLabel: null,
    content: summaryText,
    chunkIndex: chunkIndex++,
    tokenCount: estimateTokens(summaryText),
  });

  // If no full text, return document-only
  if (!record.fullText?.trim()) {
    return { chunks, strategy: "document_only" };
  }

  // 2. Detect sections
  const sections = detectSections(record.fullText);

  if (sections.length >= MIN_SECTIONS_FOR_STRUCTURED) {
    // 3. Per-section chunks
    for (const section of sections) {
      const sectionTokens = estimateTokens(section.content);

      if (sectionTokens <= MAX_SECTION_TOKENS) {
        // Section fits in one chunk
        chunks.push({
          chunkType: "section",
          sectionLabel: section.label,
          content: section.content,
          chunkIndex: chunkIndex++,
          tokenCount: sectionTokens,
        });
      } else {
        // Split long section into paragraph chunks
        const paragraphChunks = splitIntoParagraphChunks(
          section.content,
          MAX_SECTION_TOKENS,
          OVERLAP_TOKENS
        );
        for (const pc of paragraphChunks) {
          chunks.push({
            chunkType: "paragraph",
            sectionLabel: section.label,
            content: pc,
            chunkIndex: chunkIndex++,
            tokenCount: estimateTokens(pc),
          });
        }
      }
    }
    return { chunks, strategy: "document_and_sections" };
  }

  // 4. Fallback: paragraph-level overlapping chunks
  const paragraphChunks = splitIntoParagraphChunks(
    record.fullText,
    MAX_SECTION_TOKENS,
    OVERLAP_TOKENS
  );
  for (const pc of paragraphChunks) {
    chunks.push({
      chunkType: "paragraph",
      sectionLabel: null,
      content: pc,
      chunkIndex: chunkIndex++,
      tokenCount: estimateTokens(pc),
    });
  }

  return { chunks, strategy: "document_and_paragraphs" };
}
