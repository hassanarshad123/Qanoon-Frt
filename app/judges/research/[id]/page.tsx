"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  User,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { SaveToNotesDialog } from "@/components/judges/shared/save-to-notes-dialog";
import { ConversationInput } from "@/components/judges/shared/conversation-input";
import { StructuredResponseRenderer } from "@/components/judges/shared/structured-response";
import { useResearchChat } from "@/hooks/use-research-chat";
import { getConversation, togglePin } from "@/lib/research/actions";
import type { ResearchMessageDB } from "@/lib/research/types";
import type { StructuredResearchResponse } from "@/lib/research/types";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

const followUpPrompts = [
  "Explain further",
  "Find more precedents",
  "What about contrary views?",
  "Summarize key findings",
];

// Individual message component
function MessageBubble({
  message,
  isStreaming,
  streamingParsed,
  streamingText,
  conversationId,
}: {
  message?: ResearchMessageDB;
  isStreaming?: boolean;
  streamingParsed?: Partial<StructuredResearchResponse> | null;
  streamingText?: string;
  conversationId?: string;
}) {
  const isAssistant = message ? message.role === "assistant" : true;
  const time = message
    ? new Date(message.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  // For streaming assistant message (no message yet)
  if (!message && isStreaming) {
    const parsed = streamingParsed || {};
    const hasSections = Object.keys(parsed).length > 0;

    return (
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-[#A21CAF] flex items-center justify-center shrink-0 mt-1">
          <Scale className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-900">
              QanoonAI
            </span>
          </div>
          <div className="rounded-lg px-4 py-3 bg-white border border-gray-100">
            {hasSections ? (
              <StructuredResponseRenderer
                response={parsed}
                isStreaming={true}
                conversationId={conversationId}
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#A21CAF]/40 animate-bounce [animation-delay:0ms]" />
                <div className="h-2 w-2 rounded-full bg-[#A21CAF]/40 animate-bounce [animation-delay:150ms]" />
                <div className="h-2 w-2 rounded-full bg-[#A21CAF]/40 animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="flex gap-3">
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
          isAssistant ? "bg-[#A21CAF]" : "bg-gray-200"
        )}
      >
        {isAssistant ? (
          <Scale className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-gray-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-900">
            {isAssistant ? "QanoonAI" : "You"}
          </span>
          {time && <span className="text-xs text-gray-400">{time}</span>}
        </div>

        <div
          className={cn(
            "rounded-lg px-4 py-3",
            isAssistant
              ? "bg-white border border-gray-100"
              : "bg-gray-50 border border-gray-100"
          )}
        >
          {isAssistant && message.structuredResponse ? (
            <StructuredResponseRenderer
              response={message.structuredResponse}
              citations={message.citations}
              conversationId={conversationId}
            />
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResearchConversationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    messages,
    isStreaming,
    streamingText,
    parsedSections,
    conversationId,
    conversationTitle,
    ragResults,
    error,
    sendQuery,
    sendFollowUp,
    loadConversation,
    setConversationId,
    setConversationTitle,
  } = useResearchChat();

  const [loading, setLoading] = useState(true);
  const [pinned, setPinned] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialQuerySent = useRef(false);

  // Handle "new" conversation or loading existing
  useEffect(() => {
    if (id === "new") {
      const q = searchParams.get("q");
      const caseId = searchParams.get("caseId");

      if (q && !initialQuerySent.current) {
        initialQuerySent.current = true;
        setLoading(false);

        sendQuery(q, { caseId: caseId || undefined });
      } else {
        setLoading(false);
      }
    } else {
      // Load existing conversation
      getConversation(id).then((conv) => {
        if (conv) {
          setPinned(conv.pinned);
          loadConversation(id, conv.title);
        }
        setLoading(false);
      });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Replace URL from "new" to real conversation ID
  useEffect(() => {
    if (id === "new" && conversationId) {
      router.replace(`/judges/research/${conversationId}`);
    }
  }, [id, conversationId, router]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, streamingText]);

  const handleSendMessage = (content: string) => {
    if (conversationId) {
      sendFollowUp(content);
    } else {
      sendQuery(content);
    }
  };

  const handleTogglePin = async () => {
    const realId = conversationId || id;
    if (!realId || realId === "new") return;
    const newPinned = await togglePin(realId);
    setPinned(newPinned);
    toast.success(newPinned ? "Pinned" : "Unpinned");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#A21CAF]/10 flex items-center justify-center mx-auto animate-pulse">
            <Scale className="h-5 w-5 text-[#A21CAF]" />
          </div>
          <p className="text-sm text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/judges/research">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {conversationTitle}
            </h1>
            <p className="text-xs text-gray-400">
              {messages.length}{" "}
              {messages.length === 1 ? "message" : "messages"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePin}
            className={cn(pinned && "text-[#A21CAF]")}
          >
            <Pin className={cn("h-4 w-4", pinned && "fill-[#A21CAF]")} />
          </Button>
          <ExportMenu title={conversationTitle} />
          <SaveToNotesDialog
            title="Save Research to Notes"
            sourceLabel={conversationTitle}
          />
        </div>
      </div>

      <Separator />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden mt-4">
        <ScrollArea className="h-full">
          <div className="space-y-6 pb-4 pr-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                conversationId={conversationId || id}
              />
            ))}
            {isStreaming && (
              <MessageBubble
                isStreaming={true}
                streamingParsed={parsedSections}
                streamingText={streamingText}
                conversationId={conversationId || id}
              />
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Error display */}
      {error && (
        <div className="shrink-0 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Sticky Input Area */}
      <div className="shrink-0 pt-4 border-t border-gray-100 mt-2 bg-white">
        <ConversationInput
          onSend={handleSendMessage}
          promptSuggestions={followUpPrompts}
          placeholder="Ask a follow-up question about this research..."
          disabled={isStreaming}
        />
      </div>
    </div>
  );
}
