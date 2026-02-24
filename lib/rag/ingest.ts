// Ingestion pipeline engine for QanoonAI RAG system
// Handles both bulk and incremental ingestion of court judgments

import { sql } from "@/lib/db";
import { generateEmbeddings } from "@/lib/ai/embeddings";
import { chunkJudgment } from "./chunking";
import { extractCitations, normalizeCitation } from "./citation-extractor";
import type { JudgmentRecord, ChunkRecord } from "./types";

// =============================================================================
// Rate limiting config
// =============================================================================

const EMBEDDING_BATCH_SIZE = 8;
const EMBEDDING_DELAY_MS = 200;
const DB_BATCH_SIZE = 50;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// Progress callback
// =============================================================================

export interface IngestProgress {
  phase: "upsert" | "chunk" | "cite" | "embed_doc" | "embed_chunk" | "done";
  processed: number;
  total: number;
  embedded: number;
  failed: number;
  currentRecord?: string;
}

export type ProgressCallback = (progress: IngestProgress) => void;

// =============================================================================
// Upsert judgments
// =============================================================================

async function upsertJudgment(record: JudgmentRecord): Promise<string> {
  // legal_areas, keywords, headnotes are text[] columns — pass JS arrays directly
  const legalAreas = record.legalAreas ?? [];
  const keywords = record.keywords ?? [];
  const headnotes = record.headnotes ?? [];
  // statutes_cited is JSONB — use JSON string
  const statutesCited = JSON.stringify(record.statutesCited ?? []);
  const metadata = JSON.stringify(record.metadata ?? {});

  // Build tsvector content for full-text search
  const tsContent = [
    record.caseName,
    record.citation,
    record.summary,
    record.ratio,
    ...(record.headnotes ?? []),
    ...(record.keywords ?? []),
    record.parties,
    record.judgeName,
  ]
    .filter(Boolean)
    .join(" ");

  const rows = await sql(
    `INSERT INTO precedents (
      case_name, citation, court, year, legal_areas, keywords, headnotes,
      summary, ratio, jurisdiction, court_tier, judge_name, judgment_date,
      parties, full_text, statutes_cited, source_url, metadata,
      token_count, chunk_strategy, search_vector, ingested_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5::text[], $6::text[], $7::text[],
      $8, $9, $10, $11, $12, $13::date,
      $14, $15, $16::jsonb, $17, $18::jsonb,
      $19, 'pending', to_tsvector('english', $20), now(), now()
    )
    ON CONFLICT (citation) DO UPDATE SET
      case_name = EXCLUDED.case_name,
      court = EXCLUDED.court,
      year = EXCLUDED.year,
      legal_areas = EXCLUDED.legal_areas,
      keywords = EXCLUDED.keywords,
      headnotes = EXCLUDED.headnotes,
      summary = EXCLUDED.summary,
      ratio = EXCLUDED.ratio,
      jurisdiction = EXCLUDED.jurisdiction,
      court_tier = EXCLUDED.court_tier,
      judge_name = EXCLUDED.judge_name,
      judgment_date = EXCLUDED.judgment_date,
      parties = EXCLUDED.parties,
      full_text = EXCLUDED.full_text,
      statutes_cited = EXCLUDED.statutes_cited,
      source_url = EXCLUDED.source_url,
      metadata = EXCLUDED.metadata,
      token_count = EXCLUDED.token_count,
      search_vector = to_tsvector('english', $20),
      updated_at = now()
    RETURNING id`,
    [
      record.caseName,
      record.citation,
      record.court,
      record.year,
      legalAreas,
      keywords,
      headnotes,
      record.summary ?? "",
      record.ratio ?? "",
      record.jurisdiction ?? "PK",
      record.courtTier ?? null,
      record.judgeName ?? null,
      record.judgmentDate ?? null,
      record.parties ?? null,
      record.fullText ?? null,
      statutesCited,
      record.sourceUrl ?? null,
      metadata,
      null, // token_count computed after chunking
      tsContent,
    ]
  );

  return rows[0].id;
}

// =============================================================================
// Insert chunks
// =============================================================================

async function insertChunks(
  judgmentId: string,
  chunks: ChunkRecord[]
): Promise<void> {
  // Delete existing chunks for this judgment (re-ingestion)
  await sql(`DELETE FROM case_law_chunks WHERE case_law_id = $1`, [judgmentId]);

  for (const chunk of chunks) {
    await sql(
      `INSERT INTO case_law_chunks (case_law_id, chunk_type, section_label, content, chunk_index, token_count)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        judgmentId,
        chunk.chunkType,
        chunk.sectionLabel,
        chunk.content,
        chunk.chunkIndex,
        chunk.tokenCount,
      ]
    );
  }
}

// =============================================================================
// Insert citations
// =============================================================================

async function insertCitations(
  judgmentId: string,
  text: string
): Promise<void> {
  const citations = extractCitations(text);
  if (citations.length === 0) return;

  // Delete existing citations for this judgment (re-ingestion)
  await sql(`DELETE FROM citation_graph WHERE citing_case_law_id = $1`, [
    judgmentId,
  ]);

  for (const cite of citations) {
    // Try to resolve the cited case in our DB
    const match = await sql(
      `SELECT id FROM precedents WHERE lower(replace(citation, ' ', '')) = $1 LIMIT 1`,
      [cite.normalized.replace(/\s/g, "")]
    );
    const citedId = match.length > 0 ? match[0].id : null;

    await sql(
      `INSERT INTO citation_graph (citing_case_law_id, cited_case_law_id, cited_citation, citation_context)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [judgmentId, citedId, cite.rawCitation, cite.context]
    );
  }
}

// =============================================================================
// Batch embedding
// =============================================================================

async function embedDocuments(
  judgmentIds: string[]
): Promise<{ embedded: number; failed: number }> {
  let embedded = 0;
  let failed = 0;

  for (let i = 0; i < judgmentIds.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = judgmentIds.slice(i, i + EMBEDDING_BATCH_SIZE);

    // Fetch texts for this batch
    const placeholders = batch.map((_, j) => `$${j + 1}`).join(",");
    const rows = await sql(
      `SELECT id, case_name, citation, summary, ratio FROM precedents WHERE id IN (${placeholders})`,
      batch
    );

    const texts = rows.map(
      (r: any) =>
        `${r.case_name}\n${r.citation}\n${r.summary ?? ""}\n${r.ratio ?? ""}`
    );

    try {
      const embeddings = await generateEmbeddings(texts);

      for (let j = 0; j < rows.length; j++) {
        const emb = embeddings[j];
        if (emb) {
          await sql(
            `UPDATE precedents SET embedding = $1::vector WHERE id = $2`,
            [`[${emb.join(",")}]`, rows[j].id]
          );
          embedded++;
        } else {
          failed++;
        }
      }
    } catch (err) {
      console.error(`[ingest] Embedding batch failed:`, err);
      failed += batch.length;
    }

    if (i + EMBEDDING_BATCH_SIZE < judgmentIds.length) {
      await delay(EMBEDDING_DELAY_MS);
    }
  }

  return { embedded, failed };
}

async function embedChunks(
  judgmentIds: string[]
): Promise<{ embedded: number; failed: number }> {
  let embedded = 0;
  let failed = 0;

  // Fetch all chunks for these judgments
  const placeholders = judgmentIds.map((_, j) => `$${j + 1}`).join(",");
  const chunks = await sql(
    `SELECT id, content FROM case_law_chunks WHERE case_law_id IN (${placeholders}) AND embedding IS NULL`,
    judgmentIds
  );

  for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE);
    const texts = batch.map((c: any) => c.content);

    try {
      const embeddings = await generateEmbeddings(texts);

      for (let j = 0; j < batch.length; j++) {
        const emb = embeddings[j];
        if (emb) {
          await sql(
            `UPDATE case_law_chunks SET embedding = $1::vector WHERE id = $2`,
            [`[${emb.join(",")}]`, batch[j].id]
          );
          embedded++;
        } else {
          failed++;
        }
      }
    } catch (err) {
      console.error(`[ingest] Chunk embedding batch failed:`, err);
      failed += batch.length;
    }

    if (i + EMBEDDING_BATCH_SIZE < chunks.length) {
      await delay(EMBEDDING_DELAY_MS);
    }
  }

  return { embedded, failed };
}

// =============================================================================
// Main ingestion function
// =============================================================================

/**
 * Ingest a batch of judgment records into the RAG system.
 *
 * For each record:
 * 1. Upsert into `precedents` table (idempotent by citation)
 * 2. Generate tsvector for full-text search
 * 3. Run chunker → insert chunks into `case_law_chunks`
 * 4. Run citation extractor → insert into `citation_graph`
 * 5. Batch embed document-level + chunk-level embeddings
 * 6. Track progress in `ingestion_jobs` table
 */
export async function ingestJudgments(
  records: JudgmentRecord[],
  jobId?: string,
  onProgress?: ProgressCallback
): Promise<{
  processed: number;
  embedded: number;
  chunksCreated: number;
  citationsFound: number;
  failed: number;
  errors: { citation: string; error: string }[];
}> {
  const errors: { citation: string; error: string }[] = [];
  const judgmentIds: string[] = [];
  let processed = 0;
  let chunksCreated = 0;
  let citationsFound = 0;

  // Phase 1: Upsert records + chunk + extract citations
  for (const record of records) {
    try {
      onProgress?.({
        phase: "upsert",
        processed,
        total: records.length,
        embedded: 0,
        failed: errors.length,
        currentRecord: record.citation,
      });

      // Upsert judgment
      const id = await upsertJudgment(record);
      judgmentIds.push(id);

      // Chunk
      const { chunks, strategy } = chunkJudgment(record);
      await insertChunks(id, chunks);
      chunksCreated += chunks.length;

      // Update chunk strategy
      await sql(
        `UPDATE precedents SET chunk_strategy = $1, token_count = $2 WHERE id = $3`,
        [
          strategy,
          chunks.reduce((sum, c) => sum + c.tokenCount, 0),
          id,
        ]
      );

      // Extract citations from full text + summary + ratio
      const citationText = [record.fullText, record.summary, record.ratio]
        .filter(Boolean)
        .join("\n\n");
      await insertCitations(id, citationText);
      const citations = extractCitations(citationText);
      citationsFound += citations.length;

      processed++;

      // Update job progress
      if (jobId) {
        await sql(
          `UPDATE ingestion_jobs SET processed = $1, last_processed_id = $2 WHERE id = $3`,
          [processed, id, jobId]
        );
      }
    } catch (err: any) {
      errors.push({
        citation: record.citation,
        error: err.message || "Unknown error",
      });
      console.error(`[ingest] Failed to process ${record.citation}:`, err);
    }
  }

  // Phase 2: Batch embed documents
  onProgress?.({
    phase: "embed_doc",
    processed,
    total: records.length,
    embedded: 0,
    failed: errors.length,
  });

  const docEmbed = await embedDocuments(judgmentIds);

  // Phase 3: Batch embed chunks
  onProgress?.({
    phase: "embed_chunk",
    processed,
    total: records.length,
    embedded: docEmbed.embedded,
    failed: errors.length,
  });

  const chunkEmbed = await embedChunks(judgmentIds);

  const totalEmbedded = docEmbed.embedded;
  const totalFailed = errors.length + docEmbed.failed + chunkEmbed.failed;

  // Update job final status
  if (jobId) {
    await sql(
      `UPDATE ingestion_jobs SET
        status = 'completed',
        processed = $1,
        embedded = $2,
        failed = $3,
        error_log = $4::jsonb,
        completed_at = now()
       WHERE id = $5`,
      [processed, totalEmbedded, totalFailed, JSON.stringify(errors), jobId]
    );
  }

  onProgress?.({
    phase: "done",
    processed,
    total: records.length,
    embedded: totalEmbedded,
    failed: totalFailed,
  });

  return {
    processed,
    embedded: totalEmbedded,
    chunksCreated,
    citationsFound,
    failed: totalFailed,
    errors,
  };
}

/**
 * Create a new ingestion job record.
 */
export async function createIngestionJob(
  jobType: "bulk" | "incremental",
  totalRecords: number,
  jurisdiction?: string
): Promise<string> {
  const rows = await sql(
    `INSERT INTO ingestion_jobs (job_type, status, jurisdiction, total_records, started_at)
     VALUES ($1, 'running', $2, $3, now())
     RETURNING id`,
    [jobType, jurisdiction ?? null, totalRecords]
  );
  return rows[0].id;
}

/**
 * Get the latest ingestion job status.
 */
export async function getIngestionJobStatus(jobId: string) {
  const rows = await sql(
    `SELECT * FROM ingestion_jobs WHERE id = $1`,
    [jobId]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    jobType: r.job_type,
    status: r.status,
    jurisdiction: r.jurisdiction,
    totalRecords: r.total_records,
    processed: r.processed,
    embedded: r.embedded,
    failed: r.failed,
    lastProcessedId: r.last_processed_id,
    errorLog: typeof r.error_log === "string" ? JSON.parse(r.error_log) : r.error_log,
    startedAt: r.started_at,
    completedAt: r.completed_at,
    createdAt: r.created_at,
  };
}
