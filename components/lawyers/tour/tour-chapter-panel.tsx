"use client";

import { motion } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Play, RotateCcw } from "lucide-react";
import { TOUR_CHAPTERS } from "./chapters";
import { TOUR_COLORS } from "./constants";
import { useTour } from "./use-tour";
import type { LawyerTourState } from "./types";

export function TourChapterPanel() {
  const {
    mode,
    tourState,
    completedCount,
    totalChapters,
    closeChapterPanel,
    startChapter,
    resetAll,
  } = useTour();

  const isOpen = mode === "chapter-panel";

  const handleStartChapter = (chapterId: string) => {
    closeChapterPanel();
    // Small delay so sheet closes before spotlight appears
    setTimeout(() => startChapter(chapterId), 300);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeChapterPanel()}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-lg font-semibold text-gray-900">
            Tour Guide
          </SheetTitle>
          <p className="text-sm text-gray-500 mt-1">
            {completedCount} of {totalChapters} chapters completed
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: TOUR_COLORS.primary }}
              animate={{ width: `${(completedCount / totalChapters) * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
          <div className="p-4 space-y-2">
            {TOUR_CHAPTERS.map((chapter, i) => {
              const completed =
                tourState[chapter.id as keyof LawyerTourState] === true;

              return (
                <motion.div
                  key={chapter.id}
                  className="group rounded-xl border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Status icon */}
                      {completed ? (
                        <CheckCircle2
                          className="h-5 w-5 shrink-0 mt-0.5"
                          style={{ color: TOUR_COLORS.primary }}
                        />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 mt-0.5 text-gray-300" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3
                            className="text-sm font-medium"
                            style={{
                              color: completed ? TOUR_COLORS.primary : "#111827",
                            }}
                          >
                            {chapter.title}
                          </h3>
                          <span className="text-xs text-gray-400 ml-2">
                            {chapter.steps.length} steps
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {chapter.description}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartChapter(chapter.id)}
                          className="mt-2 h-7 px-2 text-xs gap-1"
                          style={{ color: TOUR_COLORS.primary }}
                        >
                          <Play className="h-3 w-3" />
                          {completed ? "Replay" : "Start"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAll}
            className="w-full text-xs text-gray-400 hover:text-gray-600 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Progress
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
