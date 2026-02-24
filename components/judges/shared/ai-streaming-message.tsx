"use client";

import { Scale } from "lucide-react";

interface AIStreamingMessageProps {
  text: string;
  isStreaming: boolean;
  onSkip?: () => void;
}

export function AIStreamingMessage({ text, isStreaming, onSkip }: AIStreamingMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-full bg-[#A21CAF] flex items-center justify-center shrink-0">
        <Scale className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="prose prose-sm max-w-none text-gray-700">
          <div className="whitespace-pre-wrap">{text}</div>
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-gray-400 animate-blink ml-0.5 align-middle" />
          )}
        </div>
        {isStreaming && onSkip && (
          <button
            onClick={onSkip}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip to end
          </button>
        )}
      </div>
    </div>
  );
}
