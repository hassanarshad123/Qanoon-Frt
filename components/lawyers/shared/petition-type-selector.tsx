"use client";

import {
  FileText, Shield, AlertTriangle, RotateCcw, Eye,
  Heart, Unlock, MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PetitionType } from "@/lib/types/lawyer-portal";

const petitionTypes: { type: PetitionType; icon: React.ElementType; description: string }[] = [
  { type: "Writ", icon: FileText, description: "Constitutional writ petition" },
  { type: "Civil Suit", icon: Shield, description: "Civil court proceedings" },
  { type: "Criminal Complaint", icon: AlertTriangle, description: "Criminal complaint filing" },
  { type: "Appeal", icon: RotateCcw, description: "Appeal against judgment" },
  { type: "Review", icon: Eye, description: "Review petition" },
  { type: "Family", icon: Heart, description: "Family court matters" },
  { type: "Bail", icon: Unlock, description: "Bail application" },
  { type: "Miscellaneous", icon: MoreHorizontal, description: "Other applications" },
];

interface PetitionTypeSelectorProps {
  value?: PetitionType;
  onSelect: (type: PetitionType) => void;
}

export function PetitionTypeSelector({ value, onSelect }: PetitionTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {petitionTypes.map(({ type, icon: Icon, description }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
            value === type
              ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
              : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{type}</span>
          <span className="text-xs text-gray-400 line-clamp-1">{description}</span>
        </button>
      ))}
    </div>
  );
}
