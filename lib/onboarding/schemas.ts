import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^(\+92|0)?3[0-9]{9}$/, "Please enter a valid Pakistani phone number (e.g. 03001234567)"),
});

export const lawyerPracticeSchema = z.object({
  barCouncilNumber: z.string().min(1, "Bar council number is required"),
  yearsOfExperience: z.string().min(1, "Please select your experience"),
  practiceAreas: z.array(z.string()).min(1, "Select at least one practice area"),
});

export const lawyerLocationSchema = z.object({
  province: z.string().min(1, "Please select a province"),
  city: z.string().min(1, "Please select a city"),
  primaryCourt: z.string().min(1, "Please enter your primary court"),
});

export const lawyerFirmSchema = z.object({
  firmType: z.string().min(1, "Please select a firm type"),
  firmName: z.string().optional().default(""),
});

export const referralSchema = z.object({
  source: z.string().optional().default(""),
  otherDetail: z.string().optional().default(""),
});

export const judgeJudicialSchema = z.object({
  courtLevel: z.string().min(1, "Please select a court level"),
  designation: z.string().min(1, "Please enter your designation"),
});

export const judgeLocationSchema = z.object({
  province: z.string().min(1, "Please select a province"),
  city: z.string().min(1, "Please select a city"),
  courtName: z.string().min(1, "Please enter the court name"),
});

export const comingSoonEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const lawStudentEducationSchema = z.object({
  university: z.string().min(2, "University name is required"),
  yearOfStudy: z.string().min(1, "Please select your year"),
  program: z.string().min(1, "Please select your program"),
});

export const lawStudentInterestsSchema = z.object({
  areasOfInterest: z.array(z.string()).min(1, "Select at least one area"),
  careerGoal: z.string().min(1, "Please select a career goal"),
});

export const citizenConcernSchema = z.object({
  concernArea: z.string().min(1, "Please select your legal concern area"),
  briefDescription: z.string().optional().default(""),
});

export const citizenLocationSchema = z.object({
  province: z.string().min(1, "Please select a province"),
  city: z.string().min(1, "Please select a city"),
});
