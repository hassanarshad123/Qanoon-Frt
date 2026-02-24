"use client";

import { Clock, MapPin, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CalendarEvent } from "@/lib/types/lawyer-portal";

const typeColors: Record<string, string> = {
  Hearing: "bg-[#2563EB]/10 text-[#2563EB]",
  Deadline: "bg-red-100 text-red-700",
  Meeting: "bg-emerald-100 text-emerald-700",
  Reminder: "bg-amber-100 text-amber-700",
};

interface CalendarEventCardProps {
  event: CalendarEvent;
}

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex flex-col items-center shrink-0 w-12">
        <span className="text-xs text-gray-400">{event.startTime}</span>
        <div className="h-4 w-px bg-gray-200 my-0.5" />
        <span className="text-xs text-gray-400">{event.endTime}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
          <Badge className={`shrink-0 ${typeColors[event.type] || typeColors.Reminder}`}>
            {event.type}
          </Badge>
        </div>
        {event.caseTitle && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Scale className="h-3 w-3" />
            <span className="truncate">{event.caseTitle}</span>
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
