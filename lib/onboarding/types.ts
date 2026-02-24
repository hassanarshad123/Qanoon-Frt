export type UserRole = "lawyer" | "judge" | "law_student" | "common_person";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface LawyerPracticeDetails {
  barCouncilNumber: string;
  yearsOfExperience: string;
  practiceAreas: string[];
}

export interface LawyerLocation {
  province: string;
  city: string;
  primaryCourt: string;
}

export interface LawyerFirmInfo {
  firmType: string;
  firmName: string;
}

export interface ReferralInfo {
  source: string;
  otherDetail: string;
}

export interface LawyerData {
  personalInfo: PersonalInfo;
  practiceDetails: LawyerPracticeDetails;
  location: LawyerLocation;
  firmInfo: LawyerFirmInfo;
  referral: ReferralInfo;
}

export interface JudgeJudicialInfo {
  courtLevel: string;
  designation: string;
}

export interface JudgeLocation {
  province: string;
  city: string;
  courtName: string;
}

export interface JudgeData {
  personalInfo: PersonalInfo;
  judicialInfo: JudgeJudicialInfo;
  location: JudgeLocation;
}

export interface LawStudentEducation {
  university: string;
  yearOfStudy: string;
  program: string;
}

export interface LawStudentInterests {
  areasOfInterest: string[];
  careerGoal: string;
}

export interface LawStudentData {
  personalInfo: PersonalInfo;
  education: LawStudentEducation;
  interests: LawStudentInterests;
}

export interface CitizenConcern {
  concernArea: string;
  briefDescription: string;
}

export interface CitizenLocation {
  province: string;
  city: string;
}

export interface CommonPersonData {
  personalInfo: PersonalInfo;
  legalConcern: CitizenConcern;
  location: CitizenLocation;
}

export interface OnboardingState {
  role: UserRole | null;
  currentStep: number;
  lawyerData: LawyerData;
  judgeData: JudgeData;
  lawStudentData: LawStudentData;
  commonPersonData: CommonPersonData;
}
