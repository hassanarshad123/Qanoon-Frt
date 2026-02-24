"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions {
  onSave: (value: string) => Promise<{ updatedAt: string }>;
  delay?: number;
}

export function useAutoSave(
  value: string,
  { onSave, delay = 1000 }: UseAutoSaveOptions
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialValueRef = useRef(value);
  const isMountedRef = useRef(true);
  const isFirstRender = useRef(true);

  // Track mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced save effect
  useEffect(() => {
    // Skip first render (initial load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if value hasn't changed from initial
    if (value === initialValueRef.current) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show saving status immediately
    setSaveStatus("saving");

    // Debounce the actual save
    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await onSave(value);
        if (isMountedRef.current) {
          setSaveStatus("saved");
          setLastSaved(new Date(result.updatedAt));
          initialValueRef.current = value;

          // Reset to idle after showing "Saved"
          setTimeout(() => {
            if (isMountedRef.current) {
              setSaveStatus("idle");
            }
          }, 2000);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setSaveStatus("error");
          console.error("Auto-save failed:", error);
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, onSave]);

  // Force immediate save (for navigation)
  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (value !== initialValueRef.current) {
      try {
        await onSave(value);
        initialValueRef.current = value;
      } catch (error) {
        console.error("Force save failed:", error);
      }
    }
  }, [value, onSave]);

  return { saveStatus, lastSaved, forceSave };
}
