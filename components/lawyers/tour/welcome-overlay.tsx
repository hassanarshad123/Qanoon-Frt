"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { TOUR_COLORS } from "./constants";

type Phase = "dissolve" | "icon" | "sequence" | "welcome";

const STATUS_LINES = [
  "Workspace ready",
  "AI tools configured",
  "Legal database connected",
];

interface WelcomeOverlayProps {
  onStart: () => void;
  onSkip: () => void;
}

export function WelcomeOverlay({ onStart, onSkip }: WelcomeOverlayProps) {
  const [phase, setPhase] = useState<Phase>("dissolve");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (mq.matches) {
      setPhase("welcome");
    } else {
      timers.push(setTimeout(() => setPhase("icon"), 500));
      timers.push(setTimeout(() => setPhase("sequence"), 1600));
      timers.push(setTimeout(() => setPhase("welcome"), 3000));
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  const blue = TOUR_COLORS.primary;

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {/* Phases 1-3: Icon + status lines */}
        {(phase === "dissolve" || phase === "icon" || phase === "sequence") && (
          <motion.div
            key="icon-group"
            className="flex flex-col items-center"
            animate={
              phase === "sequence"
                ? { y: -40, transition: { type: "spring", stiffness: 200, damping: 25 } }
                : { y: 0 }
            }
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {/* Scales of Justice SVG — blue theme */}
            <motion.svg
              viewBox="0 0 80 80"
              fill="none"
              className="w-16 h-16 sm:w-20 sm:h-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                phase !== "dissolve"
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.line
                x1="40" y1="12" x2="40" y2="68"
                stroke={blue} strokeWidth="2" strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              />
              <motion.line
                x1="16" y1="22" x2="64" y2="22"
                stroke={blue} strokeWidth="2" strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              />
              <motion.line
                x1="16" y1="22" x2="16" y2="40"
                stroke={blue} strokeWidth="1.5" strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
              />
              <motion.line
                x1="64" y1="22" x2="64" y2="40"
                stroke={blue} strokeWidth="1.5" strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
              />
              <motion.path
                d="M6 40 Q16 52 26 40"
                stroke={blue} strokeWidth="2" strokeLinecap="round" fill="none"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              />
              <motion.path
                d="M54 40 Q64 52 74 40"
                stroke={blue} strokeWidth="2" strokeLinecap="round" fill="none"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              />
              <motion.line
                x1="28" y1="68" x2="52" y2="68"
                stroke={blue} strokeWidth="2" strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.9 }}
              />
              <motion.circle
                cx="40" cy="12" r="3"
                stroke={blue} strokeWidth="2" fill="none"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
              />
            </motion.svg>

            {/* Blue accent line */}
            <motion.div
              className="h-px mt-6"
              style={{ backgroundColor: "rgba(37, 99, 235, 0.3)" }}
              initial={{ width: 0 }}
              animate={
                phase !== "dissolve"
                  ? { width: 120, transition: { duration: 0.8, ease: "easeOut", delay: 0.6 } }
                  : { width: 0 }
              }
            />

            {/* Status lines */}
            {phase === "sequence" && (
              <div className="mt-8 space-y-3">
                {STATUS_LINES.map((line, i) => (
                  <motion.div
                    key={line}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.35 }}
                  >
                    <motion.svg
                      viewBox="0 0 20 20"
                      className="w-5 h-5 flex-shrink-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                        delay: i * 0.35 + 0.15,
                      }}
                    >
                      <circle cx="10" cy="10" r="10" fill={blue} opacity="0.12" />
                      <motion.path
                        d="M6 10.5 L8.5 13 L14 7.5"
                        stroke={blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
                        pathLength={0}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.35 + 0.25 }}
                      />
                    </motion.svg>
                    <span className="text-sm sm:text-base text-gray-500">{line}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Phase 4: Welcome text + CTA */}
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            className="flex flex-col items-center text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Welcome to{" "}
              <span style={{ color: blue }}>Qanoon AI</span>
            </motion.h1>
            <motion.p
              className="mt-3 text-base sm:text-lg text-gray-500"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Your practice, reimagined with AI.
            </motion.p>

            <motion.div
              className="mt-8 flex items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={onStart}
                className="px-8 font-medium"
                style={{ backgroundColor: blue, color: "#fff" }}
              >
                Start Tour
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={onSkip}
                className="text-gray-400 hover:text-gray-600"
              >
                Skip
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
