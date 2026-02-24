"use client";

import { useState, useCallback, useRef } from "react";

export interface AIStep {
  label: string;
  duration: number; // milliseconds
}

export interface UseAISimulationReturn {
  currentStepIndex: number;
  completedSteps: number[];
  isRunning: boolean;
  isComplete: boolean;
  start: () => void;
  reset: () => void;
}

export function useAISimulation(steps: AIStep[]): UseAISimulationReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const runStep = useCallback((index: number) => {
    if (index >= steps.length) {
      setIsRunning(false);
      setIsComplete(true);
      return;
    }
    setCurrentStepIndex(index);
    timeoutRef.current = setTimeout(() => {
      setCompletedSteps(prev => [...prev, index]);
      runStep(index + 1);
    }, steps[index].duration);
  }, [steps]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsComplete(false);
    setCompletedSteps([]);
    setCurrentStepIndex(-1);
    // Small initial delay before starting
    timeoutRef.current = setTimeout(() => runStep(0), 200);
  }, [runStep]);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentStepIndex(-1);
    setCompletedSteps([]);
    setIsRunning(false);
    setIsComplete(false);
  }, []);

  return { currentStepIndex, completedSteps, isRunning, isComplete, start, reset };
}
