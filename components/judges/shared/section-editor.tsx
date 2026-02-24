"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SectionEditorProps {
  content: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

export function SectionEditor({ content, onSave, onCancel }: SectionEditorProps) {
  const [value, setValue] = useState(content);

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-[200px] text-sm leading-relaxed font-mono"
      />
      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel} className="text-xs h-7">
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(value)}
          className="bg-[#A21CAF] hover:bg-[#86198F] text-xs h-7"
          disabled={value === content}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
