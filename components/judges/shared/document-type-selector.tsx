"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UploadDocumentType } from "@/lib/brief-pipeline/types";

const DOCUMENT_TYPES: UploadDocumentType[] = [
  "Petition",
  "Written Arguments",
  "Evidence",
  "Affidavit",
  "Court Order",
  "Previous Judgment",
  "FIR",
  "Statutory Extract",
  "Contract",
  "Spreadsheet",
  "Other",
];

interface DocumentTypeSelectorProps {
  value: UploadDocumentType;
  onChange: (value: UploadDocumentType) => void;
}

export function DocumentTypeSelector({ value, onChange }: DocumentTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as UploadDocumentType)}>
      <SelectTrigger className="h-7 text-xs w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DOCUMENT_TYPES.map((type) => (
          <SelectItem key={type} value={type} className="text-xs">
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
