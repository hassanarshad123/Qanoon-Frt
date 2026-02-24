"use client";

import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StatuteSection } from "@/lib/types/lawyer-portal";

interface StatuteSectionCardProps {
  section: StatuteSection;
  statuteId: string;
}

export function StatuteSectionCard({ section, statuteId }: StatuteSectionCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Section {section.number}: {section.title}
            </h4>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
              {section.content}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7 hover:border-[#2563EB] hover:text-[#2563EB]"
          asChild
        >
          <Link href={`/lawyers/statute-analyzer/new?statuteId=${statuteId}&section=${section.number}`}>
            <Sparkles className="h-3 w-3 mr-1" />
            Analyze with AI
          </Link>
        </Button>
      </div>
    </div>
  );
}
