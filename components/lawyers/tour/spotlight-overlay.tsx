"use client";

import { motion, AnimatePresence } from "motion/react";
import { TOUR_COLORS, SPOTLIGHT_PADDING, SPOTLIGHT_BORDER_RADIUS } from "./constants";
import type { ElementRect } from "./use-element-rect";

interface SpotlightOverlayProps {
  visible: boolean;
  rect: ElementRect | null;
  onClick?: () => void;
}

export function SpotlightOverlay({ visible, rect, onClick }: SpotlightOverlayProps) {
  const pad = SPOTLIGHT_PADDING;
  const radius = SPOTLIGHT_BORDER_RADIUS;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClick}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <mask id="tour-spotlight-mask">
                {/* White = visible, black = transparent */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {rect && (
                  <motion.rect
                    fill="black"
                    rx={radius}
                    ry={radius}
                    animate={{
                      x: rect.left - pad,
                      y: rect.top - pad,
                      width: rect.width + pad * 2,
                      height: rect.height + pad * 2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={TOUR_COLORS.overlay}
              mask="url(#tour-spotlight-mask)"
              style={{ pointerEvents: "auto" }}
            />
          </svg>

          {/* Highlight ring around the target */}
          {rect && (
            <motion.div
              className="absolute border-2 pointer-events-none"
              style={{
                borderColor: TOUR_COLORS.primary,
                borderRadius: radius,
                boxShadow: `0 0 0 4px ${TOUR_COLORS.primaryRing}`,
              }}
              animate={{
                top: rect.top - pad,
                left: rect.left - pad,
                width: rect.width + pad * 2,
                height: rect.height + pad * 2,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
