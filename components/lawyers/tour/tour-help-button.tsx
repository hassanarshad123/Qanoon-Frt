"use client";

import { motion } from "motion/react";
import { HelpCircle } from "lucide-react";
import { useTour } from "./use-tour";
import { TOUR_COLORS } from "./constants";

export function TourHelpButton() {
  const { mode, completedCount, totalChapters, openChapterPanel } = useTour();

  // Hide during active touring or welcome
  if (mode === "touring" || mode === "welcome") return null;

  const uncompleted = totalChapters - completedCount;

  return (
    <motion.button
      onClick={openChapterPanel}
      className="fixed bottom-6 right-6 z-[9996] h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-shadow hover:shadow-xl"
      style={{ backgroundColor: TOUR_COLORS.primary }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <HelpCircle className="h-5 w-5 text-white" />

      {/* Badge for uncompleted chapters */}
      {uncompleted > 0 && (
        <span
          className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full text-[10px] font-bold flex items-center justify-center px-1"
          style={{
            backgroundColor: "#EF4444",
            color: "#fff",
          }}
        >
          {uncompleted}
        </span>
      )}
    </motion.button>
  );
}
