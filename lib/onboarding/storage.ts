import type { OnboardingState } from "./types";

const STORAGE_KEY = "qanoon-onboarding";

const defaultState: OnboardingState = {
  role: null,
  currentStep: 0,
  lawyerData: {
    personalInfo: { fullName: "", email: "", phone: "" },
    practiceDetails: { barCouncilNumber: "", yearsOfExperience: "", practiceAreas: [] },
    location: { province: "", city: "", primaryCourt: "" },
    firmInfo: { firmType: "", firmName: "" },
    referral: { source: "", otherDetail: "" },
  },
  judgeData: {
    personalInfo: { fullName: "", email: "", phone: "" },
    judicialInfo: { courtLevel: "", designation: "" },
    location: { province: "", city: "", courtName: "" },
  },
  lawStudentData: {
    personalInfo: { fullName: "", email: "", phone: "" },
    education: { university: "", yearOfStudy: "", program: "" },
    interests: { areasOfInterest: [], careerGoal: "" },
  },
  commonPersonData: {
    personalInfo: { fullName: "", email: "", phone: "" },
    legalConcern: { concernArea: "", briefDescription: "" },
    location: { province: "", city: "" },
  },
};

export function getOnboardingState(): OnboardingState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveOnboardingState(state: Partial<OnboardingState>) {
  if (typeof window === "undefined") return;
  try {
    const current = getOnboardingState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...state }));
  } catch {
    // silently fail
  }
}

export function clearOnboardingState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getDefaultState(): OnboardingState {
  return JSON.parse(JSON.stringify(defaultState));
}
