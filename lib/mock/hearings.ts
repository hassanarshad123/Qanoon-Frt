import type { Hearing } from "./types";

export const hearings: Hearing[] = [
  {
    id: "hearing-001",
    caseId: "case-001",
    caseTitle: "Muhammad Aslam v. Federation of Pakistan",
    caseNumber: "CP No. 1247/2024",
    time: "10:00 AM",
    courtRoom: "Court Room No. 1, Supreme Court",
    type: "Arguments",
    status: "Scheduled"
  },
  {
    id: "hearing-002",
    caseId: "case-002",
    caseTitle: "State v. Imran Shahzad",
    caseNumber: "Crl.A No. 389/2024",
    time: "11:30 AM",
    courtRoom: "Court Room No. 3, Lahore High Court",
    type: "Appeal Hearing",
    status: "In Progress"
  },
  {
    id: "hearing-003",
    caseId: "case-008",
    caseTitle: "Zainab Noor v. SHO Police Station Gulberg",
    caseNumber: "WP No. 8976/2024",
    time: "2:00 PM",
    courtRoom: "Court Room No. 7, Lahore High Court",
    type: "Compliance Hearing",
    status: "Scheduled"
  },
  {
    id: "hearing-004",
    caseId: "case-013",
    caseTitle: "State v. Nasir Mehmood & 4 Others",
    caseNumber: "Crl.R No. 112/2024",
    time: "3:30 PM",
    courtRoom: "Court Room No. 2, Islamabad High Court",
    type: "Revision Hearing",
    status: "Scheduled"
  }
];
