"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { UserRole } from "@/lib/onboarding/types";

type Phase = "dissolve" | "icon" | "sequence" | "welcome" | "exit";

const ROLE_SUBTITLES: Record<string, string> = {
  judge: "Your Honor, your bench awaits.",
  lawyer: "Your practice, reimagined.",
  law_student: "Your journey in law begins here.",
  common_person: "Justice, accessible to all.",
};

const STATUS_LINES = [
  "Profile verified",
  "Workspace configured",
  "AI assistant ready",
];

interface OnboardingCompleteProps {
  role: UserRole;
  displayName: string;
  onComplete: () => void;
}

export function OnboardingComplete({
  role,
  displayName,
  onComplete,
}: OnboardingCompleteProps) {
  const [phase, setPhase] = useState<Phase>("dissolve");
  const calledRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (mq.matches) {
      // Reduced-motion: skip to welcome phase, brief 1.5s display, then complete
      setPhase("welcome");
      timers.push(
        setTimeout(() => {
          if (!calledRef.current) {
            calledRef.current = true;
            onComplete();
          }
        }, 1500)
      );
    } else {
      timers.push(setTimeout(() => setPhase("icon"), 600));
      timers.push(setTimeout(() => setPhase("sequence"), 1800));
      timers.push(setTimeout(() => setPhase("welcome"), 3200));
      timers.push(setTimeout(() => setPhase("exit"), 4800));
      timers.push(
        setTimeout(() => {
          if (!calledRef.current) {
            calledRef.current = true;
            onComplete();
          }
        }, 5300)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const subtitle = ROLE_SUBTITLES[role] || "Welcome aboard.";
  const firstName = displayName?.split(" ")[0] || "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {/* Phase 1 & 2: Icon draw */}
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
            {/* Scales of Justice SVG — stroke-draw animation */}
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
              {/* Center pillar */}
              <motion.line
                x1="40" y1="12" x2="40" y2="68"
                stroke="#A21CAF"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              />
              {/* Top beam */}
              <motion.line
                x1="16" y1="22" x2="64" y2="22"
                stroke="#A21CAF"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              />
              {/* Left chain */}
              <motion.line
                x1="16" y1="22" x2="16" y2="40"
                stroke="#A21CAF"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
              />
              {/* Right chain */}
              <motion.line
                x1="64" y1="22" x2="64" y2="40"
                stroke="#A21CAF"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
              />
              {/* Left bowl */}
              <motion.path
                d="M6 40 Q16 52 26 40"
                stroke="#A21CAF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              />
              {/* Right bowl */}
              <motion.path
                d="M54 40 Q64 52 74 40"
                stroke="#A21CAF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              />
              {/* Base */}
              <motion.line
                x1="28" y1="68" x2="52" y2="68"
                stroke="#A21CAF"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.9 }}
              />
              {/* Top finial */}
              <motion.circle
                cx="40" cy="12"
                r="3"
                stroke="#A21CAF"
                strokeWidth="2"
                fill="none"
                pathLength={0}
                animate={phase !== "dissolve" ? { pathLength: 1 } : {}}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
              />
            </motion.svg>

            {/* Horizontal accent line */}
            <motion.div
              className="h-px bg-purple-300 mt-6"
              initial={{ width: 0 }}
              animate={
                phase !== "dissolve"
                  ? { width: 120, transition: { duration: 0.8, ease: "easeOut", delay: 0.6 } }
                  : { width: 0 }
              }
            />

            {/* Phase 3: Status lines */}
            {phase === "sequence" && (
              <div className="mt-8 space-y-3">
                {STATUS_LINES.map((line, i) => (
                  <motion.div
                    key={line}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: i * 0.35,
                    }}
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
                      <circle cx="10" cy="10" r="10" fill="#A21CAF" opacity="0.12" />
                      <motion.path
                        d="M6 10.5 L8.5 13 L14 7.5"
                        stroke="#A21CAF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        pathLength={0}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                          delay: i * 0.35 + 0.25,
                        }}
                      />
                    </motion.svg>
                    <span className="text-sm sm:text-base text-gray-500">
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Phase 4: Welcome text */}
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            className="flex flex-col items-center text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.5 } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              Welcome to Qanoon AI
              {firstName ? `, ${firstName}` : ""}
            </motion.h1>
            <motion.p
              className="mt-4 text-base sm:text-lg text-gray-500 font-light"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>
        )}

        {/* Phase 5: Exit zoom */}
        {phase === "exit" && (
          <motion.div
            key="exit"
            className="flex flex-col items-center text-center px-6"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900">
              Welcome to Qanoon AI
              {firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-500 font-light">
              {subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
