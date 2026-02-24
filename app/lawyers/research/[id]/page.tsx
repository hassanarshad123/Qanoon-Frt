"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  User,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { ConversationInput } from "@/components/judges/shared/conversation-input";
import { CitationBadge } from "@/components/judges/shared/citation-badge";
import type {
  ResearchConversation,
  ResearchMessage,
  Citation,
} from "@/lib/types/lawyer-portal";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

// Simulated AI follow-up responses for demo purposes
const simulatedResponses: Record<
  string,
  { content: string; citations: Citation[] }
> = {
  "Explain further": {
    content:
      "To elaborate on the points discussed above, it is important to understand the historical evolution of this legal principle in Pakistani jurisprudence.\n\nThe courts have consistently held that the interpretation of constitutional provisions must be purposive rather than literal. This means that the Constitution should be read as a living document that adapts to the changing needs of society while preserving its fundamental structure.\n\nThe Supreme Court has reiterated this approach in multiple landmark decisions, emphasizing that constitutional interpretation must serve the objectives of justice, equality, and the rule of law as enshrined in the Preamble and the Objectives Resolution (now Article 2-A).\n\nFurthermore, the doctrine of constitutional supremacy requires that all legislation and executive actions must conform to the fundamental rights guaranteed under Part II, Chapter 1 of the Constitution. Any law inconsistent with these rights is void to the extent of such inconsistency under Article 8.",
    citations: [
      {
        id: "cit-sim-001",
        caseName: "Al-Jehad Trust v. Federation of Pakistan",
        citation: "PLD 1996 SC 324",
        court: "Supreme Court of Pakistan",
        year: "1996",
        relevance: "Constitutional interpretation principles",
        snippet:
          "The Constitution must be interpreted as a living document, giving effect to the purpose and intent of the framers while adapting to contemporary needs of society.",
      },
    ],
  },
  "Find more precedents": {
    content:
      'Here are additional relevant precedents that strengthen the legal position discussed:\n\n1. **Muhammad Nawaz Sharif v. President of Pakistan (PLD 1993 SC 473)**: The Supreme Court established important principles regarding the scope of judicial review and the separation of powers, holding that no organ of the State is above the Constitution.\n\n2. **Mian Muhammad Nawaz Sharif v. President of Pakistan (1998 SCMR 2442)**: This case further developed the doctrine of constitutional supremacy, holding that the President\'s powers under the Constitution must be exercised in accordance with the advice of the Prime Minister and the Cabinet.\n\n3. **Sindh High Court Bar Association v. Federation of Pakistan (PLD 2009 SC 879)**: A landmark judgment on the independence of the judiciary, establishing that judicial independence is a basic feature of the Constitution that cannot be abrogated even through constitutional amendments.\n\n4. **District Bar Association Rawalpindi v. Federation of Pakistan (PLD 2015 SC 401)**: The Court struck down the 21st Constitutional Amendment establishing military courts, reinforcing the principle that fundamental rights form the basic structure of the Constitution.',
    citations: [
      {
        id: "cit-sim-002",
        caseName:
          "Sindh High Court Bar Association v. Federation of Pakistan",
        citation: "PLD 2009 SC 879",
        court: "Supreme Court of Pakistan",
        year: "2009",
        relevance: "Independence of judiciary as basic feature",
        snippet:
          "Judicial independence is a basic feature of the Constitution and cannot be abrogated even through constitutional amendments under Article 239.",
      },
      {
        id: "cit-sim-003",
        caseName:
          "District Bar Association Rawalpindi v. Federation of Pakistan",
        citation: "PLD 2015 SC 401",
        court: "Supreme Court of Pakistan",
        year: "2015",
        relevance: "Basic structure doctrine and military courts",
        snippet:
          "Fundamental rights guaranteed under the Constitution form part of its basic structure, and any constitutional amendment that seeks to curtail these rights is subject to judicial review.",
      },
    ],
  },
  "What about contrary views?": {
    content:
      'It is important to consider the contrary judicial opinions and dissenting views on this matter:\n\n**Arguments Against the Broad Interpretation:**\n\n1. **Judicial Restraint School**: Several judges, including Justice Cornelius in earlier jurisprudence, have advocated for judicial restraint, arguing that courts should not expand the scope of their jurisdiction beyond the plain text of the Constitution. This view holds that policy matters should be left to the elected branches of government.\n\n2. **Separation of Powers Concerns**: In **Federation of Pakistan v. Muhammad Akram Sheikh (PLD 2002 SC 607)**, certain observations were made cautioning against the judiciary overstepping its constitutional boundaries. The argument is that an expansive interpretation of judicial review may encroach upon legislative and executive domains.\n\n3. **Textual Originalism**: Some scholars argue that the framers of the 1973 Constitution intended a more limited scope, and that progressive expansion through judicial interpretation amounts to judicial legislation.\n\n**The Counter-Arguments:**\n\nThe majority view, however, has consistently favoured the progressive interpretation, holding that the Constitution must be given a liberal construction to serve the ends of justice. The Court has noted that a restrictive interpretation would render fundamental rights illusory and defeat the constitutional purpose.',
    citations: [
      {
        id: "cit-sim-004",
        caseName: "Federation of Pakistan v. Muhammad Akram Sheikh",
        citation: "PLD 2002 SC 607",
        court: "Supreme Court of Pakistan",
        year: "2002",
        relevance: "Judicial restraint and separation of powers",
        snippet:
          "While the judiciary has the power of judicial review, it must exercise this power with restraint, respecting the boundaries of separation of powers and avoiding encroachment on legislative and executive domains.",
      },
    ],
  },
  "Summarize key findings": {
    content:
      '**Summary of Key Findings:**\n\nBased on the research conducted across the relevant case law and statutory provisions, the following key findings emerge:\n\n1. **Established Legal Position**: The law on this subject is well-settled through a consistent line of Supreme Court judgments spanning over three decades. The core principles have been repeatedly affirmed and refined.\n\n2. **Two-Pronged Test**: The courts apply a two-pronged test considering both (a) the substantive merits of the legal question and (b) the procedural requirements mandated by law. Both prongs must be satisfied.\n\n3. **Burden of Proof**: The burden of proof lies on the party asserting the right, and must be discharged on the balance of probabilities in civil matters and beyond reasonable doubt in criminal proceedings.\n\n4. **Judicial Discretion**: While the courts have discretion in applying these principles, such discretion must be exercised judicially, meaning it must be based on sound legal reasoning and supported by the evidence on record.\n\n5. **Constitutional Dimension**: The fundamental rights framework under Part II, Chapter 1 of the Constitution provides an overarching framework within which these principles operate.\n\n**Practical Implications**: For the matter at hand, the weight of authority supports the position that the legal requirements have been met, subject to the specific facts being established on record.',
    citations: [],
  },
};

const followUpPrompts = [
  "Explain further",
  "Find more precedents",
  "What about contrary views?",
  "Summarize key findings",
];

// Collapsible cited cases section for each AI message
function CitedCasesSection({ citations }: { citations: Citation[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/80">
      {/* Toggle Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-gray-100/60 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Scale className="h-3.5 w-3.5 text-[#2563EB]" />
          <span className="text-xs font-semibold text-gray-700">
            Cited Cases ({citations.length})
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>

      {/* Expanded List */}
      {expanded && (
        <div className="px-4 pb-3 space-y-3">
          <Separator className="mb-1" />
          {citations.map((citation) => (
            <div
              key={citation.id}
              className="rounded-md border border-gray-200 bg-white p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">
                    {citation.caseName}
                  </p>
                  <p className="text-xs font-mono text-[#2563EB] mt-0.5">
                    {citation.citation}
                  </p>
                </div>
                <CitationBadge citation={citation} />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{citation.court}</span>
                <span className="text-gray-300">|</span>
                <span>{citation.year}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {citation.relevance}
              </p>
              {citation.snippet && (
                <p className="text-xs text-gray-500 italic border-l-2 border-[#2563EB]/20 pl-2 leading-relaxed">
                  {citation.snippet}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs hover:border-[#2563EB] hover:text-[#2563EB]"
                  onClick={() =>
                    toast.info("Full case view coming soon", {
                      description: citation.caseName,
                    })
                  }
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Full Case
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs hover:border-[#2563EB] hover:text-[#2563EB]"
                  onClick={() =>
                    toast.success("Saved to Library", {
                      description: citation.caseName,
                    })
                  }
                >
                  <BookmarkPlus className="h-3 w-3 mr-1" />
                  Save to Library
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Individual message component
function MessageBubble({ message }: { message: ResearchMessage }) {
  const isAssistant = message.role === "assistant";
  const formattedTime = new Date(message.timestamp).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          isAssistant ? "bg-[#2563EB]" : "bg-gray-200"
        )}
      >
        {isAssistant ? (
          <Scale className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-gray-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-gray-900">
            {isAssistant ? "QanoonAI" : "You"}
          </span>
          <span className="text-xs text-gray-400">{formattedTime}</span>
        </div>

        {/* Message Content */}
        <div
          className={cn(
            "rounded-lg px-4 py-3",
            isAssistant
              ? "bg-white border border-gray-100"
              : "bg-gray-50 border border-gray-100"
          )}
        >
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>

          {/* Inline Citation Badges */}
          {isAssistant &&
            message.citations &&
            message.citations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-1.5">
                  {message.citations.map((citation) => (
                    <CitationBadge
                      key={citation.id}
                      citation={citation}
                      linkToResearch
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Cited Cases Collapsible (only for assistant messages with citations) */}
        {isAssistant &&
          message.citations &&
          message.citations.length > 0 && (
            <CitedCasesSection citations={message.citations} />
          )}
      </div>
    </div>
  );
}

// Typing indicator
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
        <Scale className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-gray-900">QanoonAI</span>
        </div>
        <div className="rounded-lg px-4 py-3 bg-white border border-gray-100 inline-block">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#2563EB]/40 animate-bounce [animation-delay:0ms]" />
            <div className="h-2 w-2 rounded-full bg-[#2563EB]/40 animate-bounce [animation-delay:150ms]" />
            <div className="h-2 w-2 rounded-full bg-[#2563EB]/40 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LawyerResearchConversationPage() {
  const params = useParams();
  const id = params.id as string;

  const [conversation, setConversation] =
    useState<ResearchConversation | null>(null);
  const [messages, setMessages] = useState<ResearchMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages or typing
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ResearchMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response after a brief delay
    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      const simulated = simulatedResponses[content];
      const aiMessage: ResearchMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: simulated
          ? simulated.content
          : `Thank you for your follow-up question regarding "${content}". Based on the analysis of relevant case law and statutory provisions, the position can be summarized as follows:\n\nThe courts have consistently held that this matter must be examined in light of the constitutional framework and applicable precedents. The key consideration is whether the established legal tests have been satisfied on the facts of the case.\n\nI would recommend examining the following aspects in greater detail:\n\n1. The applicable statutory provisions and their judicial interpretation\n2. The relevant precedents from the Supreme Court and High Courts\n3. The specific factual matrix and how it aligns with established principles\n\nWould you like me to explore any of these aspects further?`,
        timestamp: new Date().toISOString(),
        citations: simulated ? simulated.citations : [],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, delay);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto animate-pulse">
            <Scale className="h-5 w-5 text-[#2563EB]" />
          </div>
          <p className="text-sm text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Conversation not found.</p>
          <Button variant="outline" asChild>
            <Link href="/lawyers/research">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Research
            </Link>
          </Button>
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
            <Link href="/lawyers/research">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {conversation.title}
            </h1>
            <p className="text-xs text-gray-400">
              {new Date(conversation.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              &middot; {messages.length}{" "}
              {messages.length === 1 ? "message" : "messages"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ExportMenu title={conversation.title} />
        </div>
      </div>

      <Separator />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden mt-4">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="space-y-6 pb-4 pr-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Sticky Input Area */}
      <div className="shrink-0 pt-4 border-t border-gray-100 mt-2 bg-white">
        <ConversationInput
          onSend={handleSendMessage}
          promptSuggestions={followUpPrompts}
          placeholder="Ask a follow-up question about this research..."
          disabled={isTyping}
        />
      </div>
    </div>
  );
}
