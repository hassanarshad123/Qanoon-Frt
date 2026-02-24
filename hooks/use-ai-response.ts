"use client";

import { useState, useCallback, useEffect } from "react";
import { useAISimulation, type AIStep } from "./use-ai-simulation";
import { useStreamingText } from "./use-streaming-text";

export type AIResponsePhase = "idle" | "progress" | "streaming" | "complete";

export interface UseAIResponseReturn {
  phase: AIResponsePhase;
  currentStepIndex: number;
  completedSteps: number[];
  displayedText: string;
  isStreaming: boolean;
  start: () => void;
  skipStreaming: () => void;
  reset: () => void;
}

export function useAIResponse(
  steps: AIStep[],
  responseText: string,
  streamSpeed: number = 15,
  chunkSize: number = 3
): UseAIResponseReturn {
  const [phase, setPhase] = useState<AIResponsePhase>("idle");
  const simulation = useAISimulation(steps);
  const streaming = useStreamingText(responseText, streamSpeed, chunkSize);

  // Transition from progress to streaming when simulation completes
  useEffect(() => {
    if (simulation.isComplete && phase === "progress") {
      setPhase("streaming");
      streaming.start();
    }
  }, [simulation.isComplete, phase]);

  // Transition from streaming to complete
  useEffect(() => {
    if (!streaming.isStreaming && streaming.displayedText === responseText && phase === "streaming") {
      setPhase("complete");
    }
  }, [streaming.isStreaming, streaming.displayedText, responseText, phase]);

  const start = useCallback(() => {
    setPhase("progress");
    simulation.start();
  }, [simulation]);

  const skipStreaming = useCallback(() => {
    streaming.skip();
  }, [streaming]);

  const reset = useCallback(() => {
    setPhase("idle");
    simulation.reset();
    streaming.reset();
  }, [simulation, streaming]);

  return {
    phase,
    currentStepIndex: simulation.currentStepIndex,
    completedSteps: simulation.completedSteps,
    displayedText: streaming.displayedText,
    isStreaming: streaming.isStreaming,
    start,
    skipStreaming,
    reset,
  };
}
