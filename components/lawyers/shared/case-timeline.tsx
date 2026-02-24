"use client";

import { cn } from "@/lib/utils/cn";
import type { TrackedCaseEvent } from "@/lib/types/lawyer-portal";

const typeColors: Record<string, string> = {
  Filed: "bg-[#2563EB]",
  Hearing: "bg-amber-500",
  Order: "bg-emerald-500",
  Adjourned: "bg-gray-400",
  Evidence: "bg-purple-500",
  Arguments: "bg-blue-400",
  Reserved: "bg-orange-500",
  Decided: "bg-emerald-600",
};

interface CaseTimelineProps {
  events: TrackedCaseEvent[];
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn("h-3 w-3 rounded-full shrink-0 mt-1.5", typeColors[event.type] || "bg-gray-400")} />
            {idx < events.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
          </div>
          <div className="pb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{event.type}</span>
              <span className="text-xs text-gray-400">{event.date}</span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
