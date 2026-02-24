"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegenerateDialogProps {
  sectionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegenerate: (instructions?: string) => void;
}

export function RegenerateDialog({
  sectionTitle,
  open,
  onOpenChange,
  onRegenerate,
}: RegenerateDialogProps) {
  const [instructions, setInstructions] = useState("");

  const handleRegenerate = () => {
    onRegenerate(instructions || undefined);
    setInstructions("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="h-4 w-4 text-[#A21CAF]" />
            Regenerate Section
          </DialogTitle>
          <DialogDescription>
            Regenerate the &ldquo;{sectionTitle}&rdquo; section. Optionally provide
            instructions to guide the regeneration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            placeholder="Optional: e.g., 'Focus more on constitutional arguments' or 'Include dates for each fact'"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-[100px] text-sm"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-[#A21CAF] hover:bg-[#86198F] gap-1.5"
            onClick={handleRegenerate}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
