// @deprecated — This route is no longer used. Brief generation now goes through
// FastAPI via briefsApi.generate() in lib/api/briefs.ts. Kept for rollback only.
import { anthropic } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import { buildGenerationPrompt } from "@/lib/ai/prompts";
import { requireAuth } from "@/lib/auth/api";

export const maxDuration = 120;

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { extractedData, ragResults } = await request.json();

    if (!extractedData) {
      return new Response("Missing extractedData", { status: 400 });
    }

    const prompt = buildGenerationPrompt(extractedData, ragResults || []);

    const stream = anthropic.messages.stream({
      model: AI_MODELS.generate,
      max_tokens: 16384,
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
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
    console.error("Generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
