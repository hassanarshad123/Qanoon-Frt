"use client";

import { MapPin, Phone, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourtEntry } from "@/lib/types/lawyer-portal";

const levelColors: Record<string, string> = {
  "Supreme Court": "bg-[#2563EB]/10 text-[#2563EB]",
  "High Court": "bg-purple-100 text-purple-700",
  "District Court": "bg-emerald-100 text-emerald-700",
  "Tribunal": "bg-amber-100 text-amber-700",
  "Special Court": "bg-rose-100 text-rose-700",
};

interface CourtCardProps {
  court: CourtEntry;
}

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <Scale className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{court.name}</h3>
              <Badge className={`mt-1 ${levelColors[court.level] || "bg-gray-100 text-gray-600"}`}>
                {court.level}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>{court.location}, {court.province}</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-3.5 w-3.5" />
            <span>{court.chiefJustice}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>{court.contact}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">{court.jurisdictionNotes}</p>
      </CardContent>
    </Card>
  );
}
