"use client";

import { useState } from "react";
import { Check, Flag, Pencil, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { SectionReviewStatus } from "@/lib/brief-pipeline/types";

interface SectionReviewControlsProps {
  reviewStatus: SectionReviewStatus;
  flagNote?: string;
  onApprove: () => void;
  onFlag: (note: string) => void;
  onEdit: () => void;
  onRegenerate: () => void;
}

const statusConfig: Record<SectionReviewStatus, { label: string; className: string }> = {
  pending_review: {
    label: "Pending Review",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  flagged: {
    label: "Flagged",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
};

export function SectionReviewControls({
  reviewStatus,
  flagNote,
  onApprove,
  onFlag,
  onEdit,
  onRegenerate,
}: SectionReviewControlsProps) {
  const [flagNoteValue, setFlagNoteValue] = useState(flagNote || "");
  const [flagPopoverOpen, setFlagPopoverOpen] = useState(false);
  const config = statusConfig[reviewStatus];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge className={config.className}>{config.label}</Badge>

      {reviewStatus !== "approved" && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={onApprove}
        >
          <Check className="h-3 w-3" />
          Approve
        </Button>
      )}

      <Popover open={flagPopoverOpen} onOpenChange={setFlagPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1 border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            <Flag className="h-3 w-3" />
            Flag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" side="top">
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Add a note</p>
            <Textarea
              placeholder="What needs attention..."
              value={flagNoteValue}
              onChange={(e) => setFlagNoteValue(e.target.value)}
              className="min-h-[60px] text-xs"
            />
            <Button
              size="sm"
              className="w-full h-7 text-xs bg-amber-600 hover:bg-amber-700"
              onClick={() => {
                onFlag(flagNoteValue);
                setFlagPopoverOpen(false);
              }}
            >
              Flag Section
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1"
        onClick={onEdit}
      >
        <Pencil className="h-3 w-3" />
        Edit
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
        onClick={onRegenerate}
      >
        <RefreshCw className="h-3 w-3" />
        Regenerate
      </Button>

      {reviewStatus === "flagged" && flagNote && (
        <p className="text-xs text-amber-600 italic w-full mt-1">
          Note: {flagNote}
        </p>
      )}
    </div>
  );
}
