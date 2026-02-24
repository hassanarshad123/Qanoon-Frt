// @deprecated — This route is no longer used. Research queries now go through
// FastAPI via researchApi.query() in lib/api/research.ts. Kept for rollback only.

import { anthropic } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import {
  buildResearchSystemPrompt,
  buildResearchUserMessage,
  buildTitleGenerationPrompt,
} from "@/lib/ai/prompts";
import { search, toRAGSearchResult } from "@/lib/rag";
import { requireAuth } from "@/lib/auth/api";
import {
  createConversation,
  saveMessage,
  updateTitle,
} from "@/lib/research/actions";

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;
  const userId = session!.user.id;

  try {
    const { question, conversationId, caseId, caseContext } =
      await request.json();

    if (!question) {
      return new Response("Missing question", { status: 400 });
    }

    // 1. Create conversation if needed
    let convId = conversationId;
    const isNew = !convId;
    if (!convId) {
      convId = await createConversation({
        title: "New Research",
        caseId: caseId || undefined,
        mode: caseId ? "case_linked" : "general",
      }, userId);
    }

    // 2. Save user message
    await saveMessage({
      conversationId: convId,
      role: "user",
      content: question,
    });

    // 3. Unified RAG search
    const searchResults = await search({
      query: question,
      includeChunks: true,
      groupByJudgment: true,
      limit: 8,
    });
    const ragResults = searchResults.map(toRAGSearchResult);

    // 4. Build prompts
    const systemPrompt = buildResearchSystemPrompt(caseContext || undefined);
    const { messages } = buildResearchUserMessage(question, ragResults);

    // 5. SSE stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send meta event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                meta: {
                  conversationId: convId,
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

          // Stream AI response
          const stream = anthropic.messages.stream({
            model: AI_MODELS.research,
            max_tokens: 8192,
            system: systemPrompt,
            messages,
          });

          let fullText = "";

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

          // 6. Parse structured response & extract citations
          const structured = parseStructuredXML(fullText);
          const citations = extractCitations(fullText);

          // 7. Save assistant message
          const msgId = await saveMessage({
            conversationId: convId,
            role: "assistant",
            content: fullText,
            structuredResponse: structured,
            citations,
            ragContext: ragResults,
          });

          // 8. Generate title for new conversations
          let title: string | undefined;
          if (isNew) {
            try {
              const titleMsg = await anthropic.messages.create({
                model: AI_MODELS.title_generation,
                max_tokens: 50,
                messages: [
                  {
                    role: "user",
                    content: buildTitleGenerationPrompt(question),
                  },
                ],
              });
              const tb = titleMsg.content.find((b) => b.type === "text");
              if (tb && tb.type === "text") {
                title = tb.text.trim();
                await updateTitle(convId, title);
              }
            } catch {
              // Non-critical — keep default title
            }
          }

          // 9. Send complete event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                complete: { messageId: msgId, title },
              })}\n\n`
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
    console.error("Research query error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function parseStructuredXML(text: string) {
  const sections = ["summary", "applicable_law", "precedents", "analysis", "contrary_views"] as const;
  const result: Record<string, string> = {};

  for (const section of sections) {
    const regex = new RegExp(`<${section}>([\\s\\S]*?)<\\/${section}>`, "i");
    const match = text.match(regex);
    if (match) {
      result[section] = match[1].trim();
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

function extractCitations(text: string) {
  const citationRegex =
    /([A-Z][a-zA-Z\s.]+(?:v\.?\s+[A-Z][a-zA-Z\s.]+)?)\s*\((\d{4}\s+(?:PLD|SCMR|CLC|PCrLJ|YLR|MLD|PLJ|NLR|ALD)\s+\w+\s+\d+)\)/g;
  const citations: any[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = citationRegex.exec(text)) !== null) {
    const citation = match[2].trim();
    if (seen.has(citation)) continue;
    seen.add(citation);

    citations.push({
      id: `cit-${citations.length + 1}`,
      caseName: match[1].trim(),
      citation,
      court: citation.includes("SC") ? "Supreme Court of Pakistan" : "High Court",
      year: citation.match(/\d{4}/)?.[0] || "",
      relevance: "",
      snippet: "",
    });
  }

  return citations;
}
