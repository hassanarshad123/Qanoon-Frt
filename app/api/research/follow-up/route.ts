// @deprecated — This route is no longer used. Research follow-ups now go through
// FastAPI via researchApi.followUp() in lib/api/research.ts. Kept for rollback only.

import { anthropic } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import {
  buildResearchSystemPrompt,
  buildResearchUserMessage,
} from "@/lib/ai/prompts";
import { search, toRAGSearchResult } from "@/lib/rag";
import { requireAuth } from "@/lib/auth/api";
import {
  getConversation,
  getMessages,
  saveMessage,
} from "@/lib/research/actions";

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;
  const userId = session!.user.id;

  try {
    const { conversationId, question, caseContext } = await request.json();

    if (!conversationId || !question) {
      return new Response("Missing conversationId or question", {
        status: 400,
      });
    }

    // 1. Fetch conversation + history
    const conversation = await getConversation(conversationId, userId);
    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    const existingMessages = await getMessages(conversationId);

    // 2. Save user message
    await saveMessage({
      conversationId,
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

    // 4. Build prompts with full history
    const systemPrompt = buildResearchSystemPrompt(caseContext || undefined);
    const history = existingMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const { messages } = buildResearchUserMessage(
      question,
      ragResults,
      history
    );

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
                  conversationId,
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

          // Parse and save
          const structured = parseStructuredXML(fullText);
          const citations = extractCitations(fullText);

          const msgId = await saveMessage({
            conversationId,
            role: "assistant",
            content: fullText,
            structuredResponse: structured,
            citations,
            ragContext: ragResults,
          });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                complete: { messageId: msgId },
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
    console.error("Research follow-up error:", error);
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
