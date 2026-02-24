"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Shield,
  UserCheck,
  Zap,
  Search,
  FileText,
  BarChart3,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SIGNUP_PANEL_STEPS } from "@/lib/onboarding/constants";

const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Shield,
  UserCheck,
  Zap,
  Search,
  FileText,
  BarChart3,
  Clock,
};

interface SignupPremiumPanelProps {
  step: number;
  accentColor: string;
}

export function SignupPremiumPanel({ step, accentColor }: SignupPremiumPanelProps) {
  const data = SIGNUP_PANEL_STEPS[step] ?? SIGNUP_PANEL_STEPS[0];
  const MainIcon = ICON_MAP[data.icon] ?? Scale;

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#faf7ff] to-[#f0e6ff] relative overflow-hidden">
      {/* Logo — top-left */}
      <div className="flex items-center gap-3 p-10 pb-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#A21CAF]/10">
          <Scale className="w-5 h-5 text-[#A21CAF]" />
        </div>
        <span className="font-serif text-xl font-semibold text-gray-900">QanoonAI</span>
      </div>

      {/* Center area — icon + heading + description + features */}
      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Icon container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: accentColor + "1A" }}
            >
              <MainIcon className="w-7 h-7" style={{ color: accentColor }} strokeWidth={1.5} />
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              className="mt-6 text-2xl font-serif font-bold text-gray-900 text-center"
            >
              {data.heading}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
              className="mt-3 text-sm text-gray-500 text-center max-w-xs"
            >
              {data.description}
            </motion.p>

            {/* Feature chips */}
            <div className="flex items-center gap-2 mt-6">
              {data.features.map((feature, i) => {
                const FeatureIcon = ICON_MAP[feature.icon] ?? Scale;
                return (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                      delay: 0.2 + i * 0.05,
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm"
                  >
                    <FeatureIcon className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-gray-600">{feature.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step dots — bottom center */}
      <div className="flex justify-center gap-2 p-10 pt-0">
        {SIGNUP_PANEL_STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            animate={{
              width: i === step ? 24 : 8,
              backgroundColor: i === step ? accentColor : "#D1D5DB",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
