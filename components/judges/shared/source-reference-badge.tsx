"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { SourceReference } from "@/lib/brief-pipeline/types";

interface SourceReferenceBadgeProps {
  source: SourceReference;
  compact?: boolean;
}

export function SourceReferenceBadge({ source, compact }: SourceReferenceBadgeProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge
          variant="outline"
          className="cursor-pointer text-[11px] font-medium border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 gap-1 py-1 px-2"
        >
          <FileText className="h-2.5 w-2.5" />
          {compact ? `p.${source.pageNumber}` : `Page ${source.pageNumber}`}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 text-sm" side="top">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#A21CAF] shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate text-xs">{source.documentName}</p>
              <p className="text-[11px] text-gray-500">{source.documentType} — Page {source.pageNumber}</p>
            </div>
          </div>
          {source.snippet && (
            <div className="bg-gray-50 rounded-md p-2 border border-gray-100">
              <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-3">
                &ldquo;{source.snippet}&rdquo;
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
