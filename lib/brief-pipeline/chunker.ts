/**
 * Splits documents into chunks that fit within Claude's context window
 * and Vercel's request body limit.
 *
 * Limits per chunk:
 *   - ~25K tokens (~100K chars) — keeps each API call under the 30K token/min rate limit
 *   - ~600KB request body — headroom below Vercel's 4.5MB limit
 */

export interface DocumentInput {
  fileName: string;
  text: string;
}

export interface DocumentChunk {
  chunkIndex: number;
  totalChunks: number; // set after all chunks are created
  documents: DocumentInput[];
}

// Rough estimate: 1 token ≈ 4 characters
const MAX_CHARS_PER_CHUNK = 100_000; // ~25K tokens — fits under 30K token/min rate limit
const MAX_BYTES_PER_CHUNK = 600_000; // ~600KB

function estimateBytes(docs: DocumentInput[]): number {
  // JSON overhead per document: {"fileName":"...","text":"..."} + array comma
  return docs.reduce((sum, d) => sum + d.fileName.length + d.text.length + 40, 0);
}

function estimateChars(docs: DocumentInput[]): number {
  return docs.reduce((sum, d) => sum + d.text.length, 0);
}

/**
 * Truncate a single oversized document to fit within chunk limits.
 * Appends a note indicating truncation.
 */
function truncateDocument(doc: DocumentInput): DocumentInput {
  const maxTextLength = MAX_CHARS_PER_CHUNK - 200; // leave room for truncation note
  if (doc.text.length <= maxTextLength) return doc;
  return {
    fileName: doc.fileName,
    text:
      doc.text.slice(0, maxTextLength) +
      "\n\n[... DOCUMENT TRUNCATED — remaining text exceeded single-chunk limit ...]",
  };
}

export function chunkDocuments(documents: DocumentInput[]): DocumentChunk[] {
  if (documents.length === 0) return [];

  const chunks: DocumentChunk[] = [];
  let currentDocs: DocumentInput[] = [];

  for (const doc of documents) {
    const docToAdd =
      doc.text.length > MAX_CHARS_PER_CHUNK ? truncateDocument(doc) : doc;

    const projectedChars = estimateChars(currentDocs) + docToAdd.text.length;
    const projectedBytes = estimateBytes(currentDocs) + estimateBytes([docToAdd]);

    // Would exceed limits — flush current chunk and start new one
    if (
      currentDocs.length > 0 &&
      (projectedChars > MAX_CHARS_PER_CHUNK || projectedBytes > MAX_BYTES_PER_CHUNK)
    ) {
      chunks.push({ chunkIndex: chunks.length, totalChunks: 0, documents: currentDocs });
      currentDocs = [];
    }

    currentDocs.push(docToAdd);
  }

  // Flush remaining
  if (currentDocs.length > 0) {
    chunks.push({ chunkIndex: chunks.length, totalChunks: 0, documents: currentDocs });
  }

  // Stamp totalChunks
  for (const chunk of chunks) {
    chunk.totalChunks = chunks.length;
  }

  return chunks;
}
