"use client";

import { useContext } from "react";
import { TourContext, type TourContextValue } from "./tour-provider";

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTour must be used within a <LawyerTourProvider>");
  }
  return ctx;
}
