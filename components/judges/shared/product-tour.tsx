"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { profilesApi } from "@/lib/api/profiles";
import { judgeTourSteps } from "@/lib/actions/judge-tour";
import { WelcomeModal } from "./welcome-modal";

export function ProductTour() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showWelcome, setShowWelcome] = useState(false);
  const [checked, setChecked] = useState(false);

  const userId = session?.user?.id;
  const userName = session?.user?.name || "Justice";

  useEffect(() => {
    if (pathname !== "/judges" || checked || !userId) return;

    let cancelled = false;
    profilesApi.getJudgeTourStatus().then(({ tourCompleted }) => {
      if (!cancelled && !tourCompleted) {
        setShowWelcome(true);
      }
      setChecked(true);
    });

    return () => { cancelled = true; };
  }, [pathname, userId, checked]);

  const startTour = useCallback(() => {
    if (!userId) return;
    setShowWelcome(false);

    // Small delay to let the modal close
    setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "qanoon-tour-popover",
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Done",
        onDestroyStarted: () => {
          profilesApi.completeJudgeTour().catch(console.error);
          driverObj.destroy();
        },
      });

      driverObj.setSteps(judgeTourSteps);
      driverObj.drive();
    }, 300);
  }, [userId]);

  const skipTour = useCallback(() => {
    if (!userId) return;
    setShowWelcome(false);
    profilesApi.completeJudgeTour().catch(console.error);
  }, [userId]);

  if (!showWelcome) return null;

  return (
    <WelcomeModal
      name={userName}
      open={showWelcome}
      onStartTour={startTour}
      onSkip={skipTour}
    />
  );
}
