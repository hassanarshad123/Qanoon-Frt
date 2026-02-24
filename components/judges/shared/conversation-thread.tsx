"use client";

import { Scale, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CitationBadge } from "./citation-badge";
import type { Citation } from "@/lib/types/portal";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
}

interface ConversationThreadProps {
  messages: Message[];
}

export function ConversationThread({ messages }: ConversationThreadProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="flex gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
              message.role === "assistant"
                ? "bg-[#A21CAF]"
                : "bg-gray-200"
            )}
          >
            {message.role === "assistant" ? (
              <Scale className="h-4 w-4 text-white" />
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium text-gray-900">
                {message.role === "assistant" ? "QanoonAI" : "You"}
              </span>
              <span className="text-xs text-gray-400">{message.timestamp}</span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
            {message.citations && message.citations.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Cited Cases</p>
                <div className="flex flex-wrap gap-1.5">
                  {message.citations.map((citation) => (
                    <CitationBadge key={citation.id} citation={citation} linkToResearch />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
