"use client";

import { useEffect, useState } from "react";
import {
  Scale,
  Shield,
  Sparkles,
  FileText,
  Gavel,
  Search,
  FileStack,
  BookOpen,
  Briefcase,
  MapPin,
  Building,
  Building2,
  Rocket,
  Users,
  BarChart,
  Zap,
  Star,
  Lock,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { UserRole } from "@/lib/onboarding/types";
import {
  VALUE_SLIDES,
  ROLE_COLORS,
  JUDGE_PANEL_STEPS,
  LAWYER_PANEL_STEPS,
} from "@/lib/onboarding/constants";
import type { LucideIcon } from "lucide-react";

// ─── Icon map ───────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Shield,
  Sparkles,
  FileText,
  Gavel,
  Search,
  FileStack,
  BookOpen,
  Briefcase,
  MapPin,
  Building,
  Building2,
  Rocket,
  Users,
  BarChart,
  Zap,
  Star,
  Lock,
  Clock,
};

// ─── Shared props ───────────────────────────────────────────────────
interface ValueSlidePanelProps {
  role: UserRole | null;
  currentStep: number;
}

// ─── Judge Premium Panel (light purple gradient) ────────────────────
function JudgePremiumPanel({ currentStep }: { currentStep: number }) {
  const step = JUDGE_PANEL_STEPS[currentStep] ?? JUDGE_PANEL_STEPS[0];
  const MainIcon = ICON_MAP[step.icon] ?? Scale;
  const accentColor = "#A21CAF";

  return (
    <div className="hidden lg:flex lg:flex-col h-full bg-gradient-to-br from-[#faf7ff] to-[#f0e6ff] relative overflow-hidden">
      {/* Logo — top-left */}
      <div className="flex items-center gap-3 p-10 pb-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#A21CAF]/10">
          <Scale className="w-5 h-5 text-[#A21CAF]" />
        </div>
        <span className="font-serif text-xl font-semibold text-gray-900">
          QanoonAI
        </span>
      </div>

      {/* Center area — icon + heading + description + features */}
      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
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
              {step.heading}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
              className="mt-3 text-sm text-gray-500 text-center max-w-xs"
            >
              {step.description}
            </motion.p>

            {/* Feature chips */}
            <div className="flex items-center gap-2 mt-6">
              {step.features.map((feature, i) => {
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
        {JUDGE_PANEL_STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            animate={{
              width: i === currentStep ? 24 : 8,
              backgroundColor: i === currentStep ? accentColor : "#D1D5DB",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Lawyer Premium Panel (light blue gradient) ─────────────────────
function LawyerPremiumPanel({ currentStep }: { currentStep: number }) {
  const step = LAWYER_PANEL_STEPS[currentStep] ?? LAWYER_PANEL_STEPS[0];
  const MainIcon = ICON_MAP[step.icon] ?? Scale;
  const accentColor = "#2563EB";

  return (
    <div className="hidden lg:flex lg:flex-col h-full bg-gradient-to-br from-[#f5f8ff] to-[#e0ecff] relative overflow-hidden">
      {/* Logo — top-left */}
      <div className="flex items-center gap-3 p-10 pb-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#2563EB]/10">
          <Scale className="w-5 h-5 text-[#2563EB]" />
        </div>
        <span className="font-serif text-xl font-semibold text-gray-900">
          QanoonAI
        </span>
      </div>

      {/* Center area — icon + heading + description + features */}
      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
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
              {step.heading}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
              className="mt-3 text-sm text-gray-500 text-center max-w-xs"
            >
              {step.description}
            </motion.p>

            {/* Feature chips */}
            <div className="flex items-center gap-2 mt-6">
              {step.features.map((feature, i) => {
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
        {LAWYER_PANEL_STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            animate={{
              width: i === currentStep ? 24 : 8,
              backgroundColor: i === currentStep ? accentColor : "#D1D5DB",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Legacy Panel (all other roles) ─────────────────────────────────
function LegacySlidePanel({
  role,
  currentStep,
}: {
  role: UserRole | null;
  currentStep: number;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = role ? VALUE_SLIDES[role] : VALUE_SLIDES.lawyer;
  const colors = role ? ROLE_COLORS[role] : ROLE_COLORS.lawyer;

  useEffect(() => {
    const newIndex = currentStep % slides.length;
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setSlideIndex(newIndex);
      setIsTransitioning(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentStep, slides.length]);

  const currentSlide = slides[slideIndex];

  return (
    <div
      className={`hidden lg:flex lg:flex-col lg:justify-between h-full bg-gradient-to-br ${colors.gradient} text-white p-10 relative overflow-hidden`}
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 left-10 w-40 h-40 border border-white rounded-full" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 border border-white rounded-full" />
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-xl font-semibold">QanoonAI</span>
        </div>
      </div>

      {/* Value slide */}
      <div
        className={`relative z-10 space-y-6 transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 translate-y-2"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="inline-block px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm">
          <span className="text-sm font-semibold tracking-wide">
            {currentSlide.stat}
          </span>
        </div>
        <h2 className="text-3xl font-serif font-bold leading-tight">
          {currentSlide.title}
        </h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-sm">
          {currentSlide.description}
        </p>
      </div>

      {/* Slide indicators */}
      <div className="relative z-10 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slideIndex ? "w-8 bg-white" : "w-3 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Exported component ─────────────────────────────────────────────
export function ValueSlidePanel({ role, currentStep }: ValueSlidePanelProps) {
  if (role === "judge") {
    return <JudgePremiumPanel currentStep={currentStep} />;
  }
  if (role === "lawyer") {
    return <LawyerPremiumPanel currentStep={currentStep} />;
  }
  return <LegacySlidePanel role={role} currentStep={currentStep} />;
}
