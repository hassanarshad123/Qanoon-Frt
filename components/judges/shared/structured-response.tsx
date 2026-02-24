"use client";

import {
  PenTool,
  BookOpen,
  Scale,
  Brain,
  AlertTriangle,
  ScrollText,
} from "lucide-react";
import type { StructuredResearchResponse } from "@/lib/research/types";
import type { Citation } from "@/lib/types/portal";
import { CitationBadge } from "./citation-badge";
import { cn } from "@/lib/utils/cn";

interface StructuredResponseProps {
  response: Partial<StructuredResearchResponse>;
  citations?: Citation[];
  isStreaming?: boolean;
  conversationId?: string;
}

function StreamingCursor() {
  return (
    <span className="inline-block w-0.5 h-4 bg-gray-400 animate-blink ml-0.5 align-text-bottom" />
  );
}

function SectionBlock({
  icon: Icon,
  title,
  content,
  className,
  borderColor,
  isLast,
  isStreaming,
}: {
  icon: React.ElementType;
  title: string;
  content: string | undefined;
  className?: string;
  borderColor?: string;
  isLast?: boolean;
  isStreaming?: boolean;
}) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "rounded-lg p-4 border-l-2",
        className
      )}
      style={borderColor ? { borderLeftColor: borderColor } : undefined}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 shrink-0" style={borderColor ? { color: borderColor } : undefined} />
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
        <div className="whitespace-pre-wrap text-sm">
          {content}
          {isStreaming && isLast && <StreamingCursor />}
        </div>
      </div>
    </div>
  );
}

export function StructuredResponseRenderer({
  response,
  citations,
  isStreaming,
  conversationId,
}: StructuredResponseProps) {
  const sections = [
    {
      key: "summary" as const,
      icon: PenTool,
      title: "Summary",
      bg: "bg-[#A21CAF]/[0.03]",
      border: "#A21CAF",
    },
    {
      key: "applicable_law" as const,
      icon: BookOpen,
      title: "Applicable Law",
      bg: "bg-amber-50/50",
      border: "#84752F",
    },
    {
      key: "precedents" as const,
      icon: Scale,
      title: "Precedents",
      bg: "bg-blue-50/30",
      border: "#2563EB",
    },
    {
      key: "analysis" as const,
      icon: Brain,
      title: "Analysis",
      bg: "bg-gray-50/50",
      border: "#6B7280",
    },
    {
      key: "contrary_views" as const,
      icon: AlertTriangle,
      title: "Contrary Views",
      bg: "bg-amber-50/30",
      border: "#D97706",
    },
  ];

  // Find the last section that has content (for streaming cursor)
  const lastSectionWithContent = [...sections]
    .reverse()
    .find((s) => response[s.key]);

  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <SectionBlock
          key={s.key}
          icon={s.icon}
          title={s.title}
          content={response[s.key]}
          className={s.bg}
          borderColor={s.border}
          isLast={lastSectionWithContent?.key === s.key}
          isStreaming={isStreaming}
        />
      ))}

      {/* Citation badges */}
      {citations && citations.length > 0 && !isStreaming && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <ScrollText className="h-3.5 w-3.5 text-[#A21CAF]" />
            <span className="text-xs font-semibold text-gray-600">
              Cited Cases ({citations.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {citations.map((c) => (
              <CitationBadge
                key={c.id}
                citation={c}
                conversationId={conversationId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
