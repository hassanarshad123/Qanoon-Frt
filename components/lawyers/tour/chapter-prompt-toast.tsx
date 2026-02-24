"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { TOUR_COLORS, CHAPTER_PROMPT_DURATION } from "./constants";
import type { TourChapter } from "./types";

interface ChapterPromptToastProps {
  chapter: TourChapter;
  onAccept: () => void;
  onDismiss: () => void;
}

export function ChapterPromptToast({
  chapter,
  onAccept,
  onDismiss,
}: ChapterPromptToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(onDismiss, CHAPTER_PROMPT_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-[9997] max-w-sm"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Depletion bar */}
          <motion.div
            className="h-0.5"
            style={{ backgroundColor: TOUR_COLORS.primary }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: CHAPTER_PROMPT_DURATION / 1000, ease: "linear" }}
          />

          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: TOUR_COLORS.primaryLight }}
              >
                <Sparkles className="h-4 w-4" style={{ color: TOUR_COLORS.primary }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {chapter.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Want a quick tour? ({chapter.steps.length} steps)
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={onAccept}
                    className="h-7 px-3 text-xs font-medium"
                    style={{ backgroundColor: TOUR_COLORS.primary, color: "#fff" }}
                  >
                    Quick Tour
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                    className="h-7 px-2 text-xs text-gray-400"
                  >
                    Not now
                  </Button>
                </div>
              </div>

              <button
                onClick={onDismiss}
                className="text-gray-300 hover:text-gray-500 transition-colors p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
