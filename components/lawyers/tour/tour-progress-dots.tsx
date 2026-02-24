"use client";

import { motion } from "motion/react";
import { TOUR_COLORS } from "./constants";

interface TourProgressDotsProps {
  total: number;
  current: number;
}

export function TourProgressDots({ total, current }: TourProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === current ? 20 : 6,
            height: 6,
            backgroundColor:
              i === current
                ? TOUR_COLORS.primary
                : i < current
                  ? TOUR_COLORS.primaryRing
                  : "#D1D5DB",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      ))}
    </div>
  );
}
