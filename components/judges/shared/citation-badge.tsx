"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Scale } from "lucide-react";
import type { Citation } from "@/lib/types/portal";

interface CitationBadgeProps {
  citation: Citation;
  linkToResearch?: boolean;
  conversationId?: string;
}

export function CitationBadge({ citation, linkToResearch, conversationId }: CitationBadgeProps) {
  const badge = (
    <Badge
      variant="outline"
      className="cursor-pointer border-[#A21CAF]/30 text-[#A21CAF] hover:bg-[#A21CAF]/5 font-mono text-xs"
    >
      {citation.citation}
    </Badge>
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {linkToResearch ? (
          <Link href={`/judges/research/${conversationId || "conv-001"}`}>{badge}</Link>
        ) : (
          badge
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Scale className="h-4 w-4 text-[#A21CAF] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{citation.caseName}</p>
              <p className="text-xs font-mono text-gray-500">{citation.citation}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">{citation.court} &middot; {citation.year}</p>
          <p className="text-xs text-gray-600">{citation.relevance}</p>
          {citation.snippet && (
            <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
              {citation.snippet}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
