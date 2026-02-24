"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface UseStreamingTextReturn {
  displayedText: string;
  isStreaming: boolean;
  start: () => void;
  skip: () => void;
  reset: () => void;
}

export function useStreamingText(
  fullText: string,
  speed: number = 15, // ms per chunk
  chunkSize: number = 3 // characters per chunk
): UseStreamingTextReturn {
  const [displayedText, setDisplayedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    cleanup();
    setDisplayedText("");
    setIsStreaming(true);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current += chunkSize;
      if (indexRef.current >= fullText.length) {
        setDisplayedText(fullText);
        setIsStreaming(false);
        cleanup();
      } else {
        setDisplayedText(fullText.slice(0, indexRef.current));
      }
    }, speed);
  }, [fullText, speed, chunkSize, cleanup]);

  const skip = useCallback(() => {
    cleanup();
    setDisplayedText(fullText);
    setIsStreaming(false);
  }, [fullText, cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setDisplayedText("");
    setIsStreaming(false);
    indexRef.current = 0;
  }, [cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { displayedText, isStreaming, start, skip, reset };
}
