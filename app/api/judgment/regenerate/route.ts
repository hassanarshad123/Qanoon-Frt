import { anthropic } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import { buildJudgmentRegenerationPrompt } from "@/lib/ai/prompts";
import { requireAuth } from "@/lib/auth/api";

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { sectionTitle, currentContent, judgeNote, judgmentContext } =
      await request.json();

    if (!sectionTitle || !currentContent || !judgeNote) {
      return new Response("Missing required fields", { status: 400 });
    }

    const prompt = buildJudgmentRegenerationPrompt(
      sectionTitle,
      currentContent,
      judgeNote,
      judgmentContext || ""
    );

    const stream = anthropic.messages.stream({
      model: AI_MODELS.regenerate,
      max_tokens: 4096,
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
                encoder.encode(
                  `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                )
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
    console.error("Judgment regeneration error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
