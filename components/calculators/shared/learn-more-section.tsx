"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LearnMoreSectionProps {
  title: string;
  children: React.ReactNode;
  sources?: { label: string; reference: string }[];
}

export function LearnMoreSection({
  title,
  children,
  sources,
}: LearnMoreSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-8">
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#059669] transition-colors group">
        <BookOpen className="h-4 w-4" />
        <span>Learn More: {title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-xl">
          <div className="prose prose-sm max-w-none font-serif text-gray-700 [&>h3]:font-sans [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:leading-relaxed">
            {children}
          </div>

          {sources && sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Sources & References
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                {sources.map((source, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{source.label}:</span>{" "}
                    {source.reference}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
