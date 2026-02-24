"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ConversationInputProps {
  onSend: (message: string) => void;
  promptSuggestions?: string[];
  placeholder?: string;
  disabled?: boolean;
}

export function ConversationInput({
  onSend,
  promptSuggestions = [],
  placeholder = "Ask a follow-up question...",
  disabled,
}: ConversationInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-3">
      {promptSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-xs h-8 hover:border-[#A21CAF] hover:text-[#A21CAF]"
              onClick={() => onSend(suggestion)}
              disabled={disabled}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[120px] resize-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="shrink-0 bg-[#A21CAF] hover:bg-[#86198F]"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
