"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pin, MessageSquare, Clock } from "lucide-react";
import type { ResearchConversationDB } from "@/lib/research/types";

interface ResearchConversationCardProps {
  conversation: ResearchConversationDB;
}

export function ResearchConversationCard({
  conversation,
}: ResearchConversationCardProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Link href={`/judges/research/${conversation.id}`}>
      <Card className="hover:shadow-md hover:border-[#A21CAF]/20 transition-all cursor-pointer h-full relative">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {/* Pin indicator */}
            {conversation.pinned && (
              <Pin className="h-3.5 w-3.5 text-[#A21CAF] absolute top-3 right-3 fill-[#A21CAF]" />
            )}

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug pr-6">
              {conversation.title}
            </h3>

            {/* Mode badge */}
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="outline"
                className={
                  conversation.mode === "case_linked"
                    ? "text-xs border-blue-200 text-blue-700 bg-blue-50/50"
                    : "text-xs border-gray-200 text-gray-600"
                }
              >
                {conversation.mode === "case_linked"
                  ? conversation.caseId || "Case Research"
                  : "General"}
              </Badge>
              {conversation.legalAreas.slice(0, 2).map((area) => (
                <Badge
                  key={area}
                  variant="outline"
                  className="text-xs border-[#A21CAF]/20 text-[#A21CAF]/70"
                >
                  {area}
                </Badge>
              ))}
            </div>

            {/* First message preview */}
            {conversation.lastMessagePreview && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {conversation.lastMessagePreview}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatDate(conversation.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MessageSquare className="h-3 w-3" />
                <span>
                  {conversation.messageCount}{" "}
                  {conversation.messageCount === 1 ? "message" : "messages"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
