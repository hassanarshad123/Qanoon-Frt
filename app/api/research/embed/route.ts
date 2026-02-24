// @deprecated — This route is no longer used. Embedding operations now go through
// FastAPI via caseLawApi.batchEmbeddings() in lib/api/case-law.ts. Kept for rollback only.

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateEmbeddings } from "@/lib/ai/embeddings";
import { requireAuth } from "@/lib/auth/api";

export async function POST() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    // Phase 1: Embed document-level precedents
    const rows = await sql(
      `SELECT id, case_name, citation, summary, ratio, headnotes, keywords FROM precedents WHERE embedding IS NULL`
    );

    let docEmbedded = 0;

    if (rows.length > 0) {
      const texts = rows.map((r: any) => {
        const headnotes =
          typeof r.headnotes === "string"
            ? JSON.parse(r.headnotes)
            : r.headnotes || [];
        const keywords =
          typeof r.keywords === "string"
            ? JSON.parse(r.keywords)
            : r.keywords || [];
        return [
          r.case_name,
          r.citation,
          r.summary,
          r.ratio,
          headnotes.join(". "),
          keywords.join(", "),
        ]
          .filter(Boolean)
          .join(" | ");
      });

      const BATCH = 8;
      for (let i = 0; i < texts.length; i += BATCH) {
        const batch = texts.slice(i, i + BATCH);
        const batchRows = rows.slice(i, i + BATCH);
        const embeddings = await generateEmbeddings(batch);

        for (let j = 0; j < batchRows.length; j++) {
          const emb = embeddings[j];
          if (emb) {
            await sql(
              `UPDATE precedents SET embedding = $1::vector WHERE id = $2`,
              [`[${emb.join(",")}]`, batchRows[j].id]
            );
            docEmbedded++;
          }
        }

        // Rate limit delay between batches
        if (i + BATCH < texts.length) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }

    // Phase 2: Embed chunks that are missing embeddings
    const chunkRows = await sql(
      `SELECT id, content FROM case_law_chunks WHERE embedding IS NULL LIMIT 500`
    );

    let chunkEmbedded = 0;

    if (chunkRows.length > 0) {
      const BATCH = 8;
      for (let i = 0; i < chunkRows.length; i += BATCH) {
        const batch = chunkRows.slice(i, i + BATCH);
        const texts = batch.map((r: any) => r.content);
        const embeddings = await generateEmbeddings(texts);

        for (let j = 0; j < batch.length; j++) {
          const emb = embeddings[j];
          if (emb) {
            await sql(
              `UPDATE case_law_chunks SET embedding = $1::vector WHERE id = $2`,
              [`[${emb.join(",")}]`, batch[j].id]
            );
            chunkEmbedded++;
          }
        }

        if (i + BATCH < chunkRows.length) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }

    return NextResponse.json({
      message: `Embedded ${docEmbedded} precedents and ${chunkEmbedded} chunks`,
      documents: { total: rows.length, embedded: docEmbedded },
      chunks: { total: chunkRows.length, embedded: chunkEmbedded },
    });
  } catch (error: any) {
    console.error("Embed error:", error);
    return NextResponse.json(
      { error: error.message || "Embedding failed" },
      { status: 500 }
    );
  }
}
