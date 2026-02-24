// @deprecated — This route is no longer used. Judgment generation now goes through
// FastAPI via judgmentsApi.generate() in lib/api/judgments.ts. Kept for rollback only.

import { anthropic } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import { buildJudgmentGenerationPrompt } from "@/lib/ai/prompts";
import { search, toRAGSearchResult } from "@/lib/rag";
import { requireAuth } from "@/lib/auth/api";
import { createJudgment } from "@/lib/actions/judgment";
import { getBrief } from "@/lib/actions/brief";
import { getOrCreateProfile } from "@/lib/actions/judge-profile";

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;
  const userId = session!.user.id;

  try {
    const { briefId, caseTitle, caseNumber, court, caseData } =
      await request.json();

    if (!caseTitle) {
      return new Response("Missing caseTitle", { status: 400 });
    }

    // Get brief content if starting from a brief
    let briefContent: string | null = null;
    let extractedData = caseData || {};
    if (briefId) {
      const brief = await getBrief(briefId, userId);
      if (brief) {
        briefContent = brief.sections
          .map((s) => `## ${s.title}\n${s.content}`)
          .join("\n\n");
        if (brief.extractedData) {
          extractedData = brief.extractedData;
        }
      }
    }

    // Unified RAG search for relevant precedents
    const searchQuery = [caseTitle, caseNumber, extractedData?.courtInfo?.caseType]
      .filter(Boolean)
      .join(" ");
    let ragResults: any[] = [];
    try {
      const results = await search({ query: searchQuery, limit: 8 });
      ragResults = results.map(toRAGSearchResult);
    } catch {
      // Non-critical
    }

    // Get judge profile for personalization
    const profile = await getOrCreateProfile(userId);

    // Build prompt
    const prompt = buildJudgmentGenerationPrompt(
      extractedData,
      briefContent,
      ragResults,
      profile
    );

    // Stream response
    const stream = anthropic.messages.stream({
      model: AI_MODELS.generate,
      max_tokens: 16384,
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let fullText = "";

          // Send meta event with RAG results
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                meta: {
                  ragResults: ragResults.map((r) => ({
                    precedent: r.precedent,
                    relevanceScore: r.relevanceScore,
                    matchedKeywords: r.matchedKeywords,
                    matchedAreas: r.matchedAreas,
                  })),
                },
              })}\n\n`
            )
          );

          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              fullText += event.delta.text;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                )
              );
            }
          }

          // Parse sections from XML
          const sections = parseSections(fullText);

          // Save to DB
          const judgmentId = await createJudgment(
            {
              caseTitle,
              caseNumber,
              court,
              briefId,
              caseData: extractedData,
              ragResults,
              sections,
            },
            userId
          );

          // Send complete event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ complete: { judgmentId } })}\n\n`
            )
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err.message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Judgment generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function parseSections(
  text: string
): { sectionKey: string; title: string; content: string }[] {
  const sectionRegex =
    /<section\s+id="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/section>/g;
  const sections: { sectionKey: string; title: string; content: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(text)) !== null) {
    sections.push({
      sectionKey: match[1],
      title: match[2],
      content: match[3].trim(),
    });
  }

  // Fallback: if no sections parsed, create a single section
  if (sections.length === 0) {
    sections.push({
      sectionKey: "full_judgment",
      title: "Judgment",
      content: text.trim(),
    });
  }

  return sections;
}
