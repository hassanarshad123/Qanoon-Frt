"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { TourProgressDots } from "./tour-progress-dots";
import { TOUR_COLORS, POPOVER_GAP, SPOTLIGHT_PADDING } from "./constants";
import type { ElementRect } from "./use-element-rect";
import type { TourStep } from "./types";

interface TourStepPopoverProps {
  visible: boolean;
  step: TourStep | null;
  stepIndex: number;
  totalSteps: number;
  chapterTitle: string;
  targetRect: ElementRect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

function computePosition(
  rect: ElementRect | null,
  placement: TourStep["placement"]
): { top: number; left: number; transformOrigin: string } {
  if (!rect) return { top: 0, left: 0, transformOrigin: "top left" };

  const pad = SPOTLIGHT_PADDING;
  const gap = POPOVER_GAP;
  const popoverWidth = 340;
  const popoverHeight = 200;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top: number;
  let left: number;
  let origin = "top left";

  switch (placement) {
    case "top":
      top = rect.top - pad - gap - popoverHeight;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      origin = "bottom center";
      break;
    case "left":
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.left - pad - gap - popoverWidth;
      origin = "right center";
      break;
    case "right":
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.right + pad + gap;
      origin = "left center";
      break;
    case "bottom":
    default:
      top = rect.bottom + pad + gap;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      origin = "top center";
      break;
  }

  // Clamp to viewport
  if (left < 12) left = 12;
  if (left + popoverWidth > vw - 12) left = vw - popoverWidth - 12;
  if (top < 12) top = 12;
  if (top + popoverHeight > vh - 12) top = vh - popoverHeight - 12;

  return { top, left, transformOrigin: origin };
}

export function TourStepPopover({
  visible,
  step,
  stepIndex,
  totalSteps,
  chapterTitle,
  targetRect,
  onNext,
  onPrev,
  onSkip,
}: TourStepPopoverProps) {
  const [pos, setPos] = useState({ top: 0, left: 0, transformOrigin: "top left" });

  const updatePos = useCallback(() => {
    if (step && targetRect) {
      setPos(computePosition(targetRect, step.placement));
    }
  }, [step, targetRect]);

  useEffect(() => {
    updatePos();
  }, [updatePos]);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <AnimatePresence mode="wait">
      {visible && step && (
        <motion.div
          key={step.id}
          className="fixed z-[9999]"
          style={{
            top: pos.top,
            left: pos.left,
            width: 340,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <Card className="shadow-2xl border-0 overflow-hidden">
            {/* Blue top accent */}
            <div
              className="h-1"
              style={{ backgroundColor: TOUR_COLORS.primary }}
            />
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-1">
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: TOUR_COLORS.primary }}
                >
                  {chapterTitle}
                </p>
                <button
                  onClick={onSkip}
                  className="text-gray-400 hover:text-gray-600 transition-colors -mt-0.5 -mr-1 p-0.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-gray-900 mt-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {step.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <TourProgressDots total={totalSteps} current={stepIndex} />

                <div className="flex items-center gap-1.5">
                  {!isFirst && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onPrev}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={onNext}
                    className="h-8 px-3 text-xs font-medium"
                    style={{
                      backgroundColor: TOUR_COLORS.primary,
                      color: TOUR_COLORS.white,
                    }}
                  >
                    {isLast ? "Finish" : "Next"}
                    {!isLast && <ChevronRight className="h-3.5 w-3.5 ml-0.5" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
