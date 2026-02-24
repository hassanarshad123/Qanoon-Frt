import { NextResponse } from "next/server";
import { anthropic } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import { buildAnalysisPrompt } from "@/lib/ai/prompts";
import { requireAuth } from "@/lib/auth/api";

export const maxDuration = 120;

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { documents, chunkIndex, totalChunks } = await request.json();

    if (!documents || documents.length === 0) {
      return NextResponse.json(
        { error: "No documents provided" },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(documents, chunkIndex, totalChunks);

    const message = await anthropic.messages.create({
      model: AI_MODELS.analyze,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response, stripping any markdown fences
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const extractedData = JSON.parse(jsonText);

    // Add empty sources arrays to match ExtractedCaseData shape
    const formatted = {
      courtInfo: extractedData.courtInfo
        ? { ...extractedData.courtInfo, sources: [] }
        : null,
      parties: (extractedData.parties || []).map((p: any) => ({
        ...p,
        sources: [],
      })),
      facts: (extractedData.facts || []).map((f: any) => ({
        ...f,
        sources: [],
      })),
      legalIssues: (extractedData.legalIssues || []).map((i: any) => ({
        ...i,
        sources: [],
      })),
      statutes: (extractedData.statutes || []).map((s: any) => ({
        ...s,
        sources: [],
      })),
      arguments: (extractedData.arguments || []).map((a: any) => ({
        ...a,
        sources: [],
      })),
      rawDocuments: documents.map((d: any, idx: number) => ({
        id: `doc-chunk${chunkIndex ?? 0}-${idx}`,
        fileName: d.fileName,
        documentType: "Other" as const,
        totalPages: 0,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Chunk analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Chunk analysis failed" },
      { status: 500 }
    );
  }
}
