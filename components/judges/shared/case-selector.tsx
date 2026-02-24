"use client";

import { Scale } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CaseSelectorProps {
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function CaseSelector({
  value,
  onSelect,
  placeholder = "Enter case title or number...",
}: CaseSelectorProps) {
  return (
    <div className="relative">
      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value || ""}
        onChange={(e) => onSelect(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
