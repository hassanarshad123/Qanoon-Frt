"use client";

import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { TOUR_CHAPTERS } from "./chapters";
import { CHAPTER_ROUTE_TRIGGERS } from "./constants";
import { SpotlightOverlay } from "./spotlight-overlay";
import { TourStepPopover } from "./tour-step-popover";
import { useElementRect } from "./use-element-rect";
import type { TourChapter, TourMode, LawyerTourState } from "./types";
import { profilesApi } from "@/lib/api/profiles";

export interface TourContextValue {
  mode: TourMode;
  tourState: LawyerTourState;
  activeChapter: TourChapter | null;
  stepIndex: number;
  completedCount: number;
  totalChapters: number;
  /** Start touring a specific chapter */
  startChapter: (chapterId: string) => void;
  /** Open the chapter panel */
  openChapterPanel: () => void;
  /** Close the chapter panel */
  closeChapterPanel: () => void;
  /** Show the welcome screen */
  showWelcome: () => void;
  /** Dismiss the current prompt toast */
  dismissPrompt: () => void;
  /** Reset all tour progress */
  resetAll: () => Promise<void>;
  /** The chapter being prompted (for toast) */
  promptedChapter: TourChapter | null;
}

export const TourContext = createContext<TourContextValue | null>(null);

interface LawyerTourProviderProps {
  children: ReactNode;
}

export function LawyerTourProvider({ children }: LawyerTourProviderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = session?.user?.id;

  const [mode, setMode] = useState<TourMode>("idle");
  const [tourState, setTourState] = useState<LawyerTourState>({});
  const [loaded, setLoaded] = useState(false);
  const [activeChapter, setActiveChapter] = useState<TourChapter | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [promptedChapter, setPromptedChapter] = useState<TourChapter | null>(null);
  const promptDismissedRef = useRef<Set<string>>(new Set());
  const prevPathnameRef = useRef(pathname);

  // Current step target for measuring
  const currentStep = activeChapter?.steps[stepIndex] ?? null;
  const targetRect = useElementRect(
    mode === "touring" ? currentStep?.target ?? null : null
  );

  // Load tour state on mount
  useEffect(() => {
    if (!userId) return;
    profilesApi.getLawyerTourState().then((state) => {
      setTourState(state as LawyerTourState);
      setLoaded(true);
    });
  }, [userId]);

  // Auto-show welcome on first login
  useEffect(() => {
    if (!loaded || !userId) return;
    if (!tourState.welcomeShown && !tourState["ch-1"]) {
      setMode("welcome");
    }
  }, [loaded, userId, tourState]);

  // Route-based chapter prompts
  useEffect(() => {
    if (!loaded || !userId || mode !== "idle") return;
    if (pathname === prevPathnameRef.current) return;
    prevPathnameRef.current = pathname;

    // Record the visit
    profilesApi.recordLawyerSectionVisit(pathname);

    // Check if any chapter should be prompted
    for (const [chapterId, routes] of Object.entries(CHAPTER_ROUTE_TRIGGERS)) {
      if (!routes.includes(pathname)) continue;
      // Already completed or already prompted this session
      if (tourState[chapterId as keyof LawyerTourState]) continue;
      if (promptDismissedRef.current.has(chapterId)) continue;

      const chapter = TOUR_CHAPTERS.find((c) => c.id === chapterId);
      if (chapter) {
        setPromptedChapter(chapter);
        setMode("chapter-prompt");
        break;
      }
    }
  }, [pathname, loaded, userId, mode, tourState]);

  // Expand sidebar accordion for steps that need it
  const expandAccordionGroup = useCallback((groupId: string) => {
    const trigger = document.querySelector(
      `[data-tour-group="${groupId}"]`
    ) as HTMLElement | null;
    if (trigger && trigger.dataset.state !== "open") {
      trigger.click();
    }
  }, []);

  // Scroll target into view
  const scrollToTarget = useCallback((target: string) => {
    const el = document.querySelector(`[data-tour="${target}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Prepare a step (expand accordion, scroll, wait for DOM)
  const prepareStep = useCallback(
    async (step: { target: string; expandGroup?: string }) => {
      if (step.expandGroup) {
        expandAccordionGroup(step.expandGroup);
        // Wait for accordion animation
        await new Promise((r) => setTimeout(r, 350));
      }
      scrollToTarget(step.target);
      // Wait for scroll
      await new Promise((r) => setTimeout(r, 200));
    },
    [expandAccordionGroup, scrollToTarget]
  );

  const startChapter = useCallback(
    async (chapterId: string) => {
      const chapter = TOUR_CHAPTERS.find((c) => c.id === chapterId);
      if (!chapter || chapter.steps.length === 0) return;

      setActiveChapter(chapter);
      setStepIndex(0);
      setPromptedChapter(null);
      setMode("touring");

      await prepareStep(chapter.steps[0]);
    },
    [prepareStep]
  );

  const handleNext = useCallback(async () => {
    if (!activeChapter || !userId) return;

    const nextIndex = stepIndex + 1;
    if (nextIndex >= activeChapter.steps.length) {
      // Chapter complete
      const newState = await profilesApi.completeLawyerTourChapter(activeChapter.id) as LawyerTourState;
      setTourState(newState);

      // If just finished ch-1, auto-start ch-2
      if (activeChapter.id === "ch-1" && !newState["ch-2"]) {
        const ch2 = TOUR_CHAPTERS.find((c) => c.id === "ch-2");
        if (ch2 && ch2.steps.length > 0) {
          setActiveChapter(ch2);
          setStepIndex(0);
          await prepareStep(ch2.steps[0]);
          return;
        }
      }

      // Done
      setMode("idle");
      setActiveChapter(null);
      setStepIndex(0);
      return;
    }

    setStepIndex(nextIndex);
    await prepareStep(activeChapter.steps[nextIndex]);
  }, [activeChapter, stepIndex, userId, prepareStep]);

  const handlePrev = useCallback(async () => {
    if (!activeChapter || stepIndex <= 0) return;
    const prevIndex = stepIndex - 1;
    setStepIndex(prevIndex);
    await prepareStep(activeChapter.steps[prevIndex]);
  }, [activeChapter, stepIndex, prepareStep]);

  const handleSkip = useCallback(async () => {
    if (activeChapter && userId) {
      const newState = await profilesApi.completeLawyerTourChapter(activeChapter.id) as LawyerTourState;
      setTourState(newState);
    }
    setMode("idle");
    setActiveChapter(null);
    setStepIndex(0);
  }, [activeChapter, userId]);

  const showWelcome = useCallback(() => {
    setMode("welcome");
  }, []);

  const openChapterPanel = useCallback(() => {
    setMode("chapter-panel");
    setPromptedChapter(null);
  }, []);

  const closeChapterPanel = useCallback(() => {
    setMode("idle");
  }, []);

  const dismissPrompt = useCallback(() => {
    if (promptedChapter) {
      promptDismissedRef.current.add(promptedChapter.id);
    }
    setPromptedChapter(null);
    setMode("idle");
  }, [promptedChapter]);

  const handleWelcomeStart = useCallback(async () => {
    if (userId) {
      const newState = await profilesApi.markLawyerWelcomeShown() as LawyerTourState;
      setTourState(newState);
    }
    startChapter("ch-1");
  }, [userId, startChapter]);

  const handleWelcomeSkip = useCallback(async () => {
    if (userId) {
      const newState = await profilesApi.markLawyerWelcomeShown() as LawyerTourState;
      setTourState(newState);
    }
    setMode("idle");
  }, [userId]);

  const resetAll = useCallback(async () => {
    if (!userId) return;
    const newState = await profilesApi.resetLawyerTour() as LawyerTourState;
    setTourState(newState);
    promptDismissedRef.current.clear();
    setMode("idle");
    setActiveChapter(null);
    setStepIndex(0);
  }, [userId]);

  const completedCount = TOUR_CHAPTERS.filter(
    (ch) => tourState[ch.id as keyof LawyerTourState] === true
  ).length;

  const value: TourContextValue = {
    mode,
    tourState,
    activeChapter,
    stepIndex,
    completedCount,
    totalChapters: TOUR_CHAPTERS.length,
    startChapter,
    openChapterPanel,
    closeChapterPanel,
    showWelcome,
    dismissPrompt,
    resetAll,
    promptedChapter,
  };

  return (
    <TourContext.Provider value={value}>
      {children}

      {/* Spotlight overlay - only during touring */}
      <SpotlightOverlay
        visible={mode === "touring"}
        rect={targetRect}
        onClick={handleSkip}
      />

      {/* Step popover */}
      <TourStepPopover
        visible={mode === "touring" && !!currentStep}
        step={currentStep}
        stepIndex={stepIndex}
        totalSteps={activeChapter?.steps.length ?? 0}
        chapterTitle={activeChapter?.title ?? ""}
        targetRect={targetRect}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
      />

      {/* Welcome overlay - rendered lazily by parent */}
      {mode === "welcome" && (
        <WelcomeLazy onStart={handleWelcomeStart} onSkip={handleWelcomeSkip} />
      )}

      {/* Chapter prompt toast */}
      {mode === "chapter-prompt" && promptedChapter && (
        <ChapterPromptLazy
          chapter={promptedChapter}
          onAccept={() => startChapter(promptedChapter.id)}
          onDismiss={dismissPrompt}
        />
      )}
    </TourContext.Provider>
  );
}

// Lazy imports to avoid circular deps and code-split heavy components
import dynamic from "next/dynamic";

const WelcomeOverlay = dynamic(
  () =>
    import("./welcome-overlay").then((m) => ({
      default: m.WelcomeOverlay,
    })),
  { ssr: false }
);

const ChapterPromptToast = dynamic(
  () =>
    import("./chapter-prompt-toast").then((m) => ({
      default: m.ChapterPromptToast,
    })),
  { ssr: false }
);

function WelcomeLazy({
  onStart,
  onSkip,
}: {
  onStart: () => void;
  onSkip: () => void;
}) {
  return <WelcomeOverlay onStart={onStart} onSkip={onSkip} />;
}

function ChapterPromptLazy({
  chapter,
  onAccept,
  onDismiss,
}: {
  chapter: TourChapter;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  return (
    <ChapterPromptToast
      chapter={chapter}
      onAccept={onAccept}
      onDismiss={onDismiss}
    />
  );
}
