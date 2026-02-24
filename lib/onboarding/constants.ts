import type { UserRole } from "./types";

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
] as const;

export const CITIES_BY_PROVINCE: Record<string, string[]> = {
  Punjab: [
    "Lahore",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Gujranwala",
    "Sialkot",
    "Bahawalpur",
    "Sargodha",
    "Sahiwal",
    "Gujrat",
  ],
  Sindh: [
    "Karachi",
    "Hyderabad",
    "Sukkur",
    "Larkana",
    "Nawabshah",
    "Mirpurkhas",
    "Thatta",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar",
    "Mardan",
    "Abbottabad",
    "Swat",
    "Mansehra",
    "Dera Ismail Khan",
    "Kohat",
    "Bannu",
  ],
  Balochistan: [
    "Quetta",
    "Gwadar",
    "Turbat",
    "Khuzdar",
    "Sibi",
    "Zhob",
  ],
  "Islamabad Capital Territory": ["Islamabad"],
  "Azad Jammu & Kashmir": [
    "Muzaffarabad",
    "Mirpur",
    "Rawalakot",
    "Kotli",
    "Bagh",
  ],
  "Gilgit-Baltistan": [
    "Gilgit",
    "Skardu",
    "Hunza",
    "Chilas",
  ],
};

export const PRACTICE_AREAS = [
  "Criminal Law",
  "Civil Law",
  "Corporate & Commercial",
  "Family Law",
  "Constitutional Law",
  "Tax Law",
  "Banking & Finance",
  "Intellectual Property",
  "Labour & Employment",
  "Real Estate & Property",
  "Immigration Law",
  "Environmental Law",
  "Cyber Law & IT",
  "International Law",
] as const;

export const COURT_LEVELS = [
  "District Court",
  "High Court",
  "Supreme Court",
  "Tribunal / Special Court",
] as const;

export const FIRM_TYPES = [
  { value: "solo", label: "Solo Practice" },
  { value: "small", label: "Small Firm (2-10)" },
  { value: "medium", label: "Medium Firm (11-50)" },
  { value: "large", label: "Large Firm (50+)" },
  { value: "in_house", label: "In-House Counsel" },
] as const;

export const EXPERIENCE_RANGES = [
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10-20 years",
  "20+ years",
] as const;

export const REFERRAL_SOURCES = [
  "Search Engine (Google, etc.)",
  "Social Media",
  "Colleague / Friend",
  "Bar Association",
  "Legal Conference / Event",
  "News Article / Blog",
  "Other",
] as const;

export const LAWYER_STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "practice", label: "Practice" },
  { id: "location", label: "Location" },
  { id: "firm", label: "Firm" },
  { id: "referral", label: "Referral" },
] as const;

export const JUDGE_STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "judicial", label: "Judicial Info" },
  { id: "location", label: "Location" },
] as const;

export const LAW_STUDENT_STEPS = [
  { id: "personal", label: "About You" },
  { id: "education", label: "Education" },
  { id: "interests", label: "Interests" },
] as const;

export const COMMON_PERSON_STEPS = [
  { id: "personal", label: "About You" },
  { id: "concern", label: "Legal Need" },
  { id: "location", label: "Location" },
] as const;

export const ROLE_COLORS: Record<UserRole, { primary: string; light: string; gradient: string; hover: string }> = {
  lawyer: { primary: "#2563EB", light: "rgba(37,99,235,0.1)", gradient: "from-blue-600 to-blue-800", hover: "#1D4ED8" },
  judge: { primary: "#A21CAF", light: "rgba(162,28,175,0.1)", gradient: "from-purple-600 to-purple-800", hover: "#86198F" },
  law_student: { primary: "#059669", light: "rgba(5,150,105,0.1)", gradient: "from-emerald-600 to-emerald-800", hover: "#047857" },
  common_person: { primary: "#D97706", light: "rgba(217,119,6,0.1)", gradient: "from-amber-600 to-amber-800", hover: "#B45309" },
};

export const VALUE_SLIDES: Record<UserRole, { title: string; stat: string; description: string }[]> = {
  lawyer: [
    { title: "AI-Powered Research", stat: "5+ hours saved weekly", description: "Search Pakistan's entire case law database in seconds with intelligent AI that understands legal context." },
    { title: "Smart Brief Drafting", stat: "70% faster drafts", description: "Generate professional legal briefs with AI assistance, complete with relevant citations and precedents." },
    { title: "Practice Management", stat: "Used by 500+ lawyers", description: "Track cases, clients, and deadlines in one place. Stay organized and never miss a hearing." },
  ],
  judge: [
    { title: "Case Analysis", stat: "3x faster review", description: "AI-powered case summaries and precedent analysis help you review matters more efficiently." },
    { title: "Judgment Writing", stat: "Save 2+ hours/judgment", description: "Draft well-structured judgments with relevant citations and proper legal formatting." },
    { title: "Bench Resources", stat: "Complete legal database", description: "Access statutes, amendments, and case law instantly from your bench." },
  ],
  law_student: [
    { title: "Study Smarter", stat: "10,000+ case summaries", description: "Instant AI summaries of landmark Pakistani cases to accelerate your learning." },
    { title: "Exam Preparation", stat: "Used by top students", description: "Practice with AI-generated questions and model answers tailored to your syllabus." },
    { title: "Career Head Start", stat: "Real legal tools", description: "Learn the same AI tools that top law firms are already using in practice." },
  ],
  common_person: [
    { title: "Know Your Rights", stat: "Plain language", description: "Understand complex laws explained in simple Urdu & English that anyone can follow." },
    { title: "Find Legal Help", stat: "500+ verified lawyers", description: "Connect with the right lawyer for your specific issue, verified and reviewed." },
    { title: "Track Your Case", stat: "Stay informed", description: "Get updates and understand every step of your legal journey with clear guidance." },
  ],
};

export const YEAR_OF_STUDY = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year (LL.M)",
  "PhD/Research",
] as const;

export const LAW_PROGRAMS = [
  "LL.B (5-Year)",
  "LL.B (3-Year)",
  "LL.M",
  "Bar-at-Law",
  "PhD in Law",
] as const;

export const CAREER_GOALS = [
  "Litigation",
  "Corporate Practice",
  "Judiciary",
  "Academia",
  "Government/Public Service",
  "NGO/Human Rights",
  "Not sure yet",
] as const;

export const LEGAL_CONCERN_AREAS = [
  "Family & Divorce",
  "Property & Land",
  "Criminal Defense",
  "Employment & Labor",
  "Business & Contracts",
  "Consumer Rights",
  "Immigration",
  "Inheritance & Succession",
  "Cybercrime",
  "Other",
] as const;

// --- Judge Premium Panel ---

export interface JudgePanelStep {
  icon: string;
  heading: string;
  description: string;
  features: { icon: string; label: string }[];
}

export const JUDGE_PANEL_STEPS: JudgePanelStep[] = [
  {
    icon: "Scale",
    heading: "Welcome, Your Honor",
    description: "A secure, AI-powered workspace designed for the judiciary of Pakistan.",
    features: [
      { icon: "Shield", label: "Encrypted" },
      { icon: "Sparkles", label: "AI-Powered" },
      { icon: "Lock", label: "Private" },
    ],
  },
  {
    icon: "Gavel",
    heading: "Your Bench Tools",
    description: "Judgment drafting, case analysis, and precedent research tailored to your court level.",
    features: [
      { icon: "FileText", label: "Judgments" },
      { icon: "Search", label: "Research" },
      { icon: "BookOpen", label: "Precedents" },
    ],
  },
  {
    icon: "MapPin",
    heading: "Jurisdiction Insights",
    description: "Court-specific case law and local legal intelligence at your fingertips.",
    features: [
      { icon: "Building2", label: "Court Data" },
      { icon: "FileStack", label: "Case Law" },
      { icon: "BarChart", label: "Analytics" },
    ],
  },
];

// --- Lawyer Premium Panel ---

export interface LawyerPanelStep {
  icon: string;
  heading: string;
  description: string;
  features: { icon: string; label: string }[];
}

export const LAWYER_PANEL_STEPS: LawyerPanelStep[] = [
  {
    icon: "Scale",
    heading: "Welcome to QanoonAI",
    description: "Pakistan's first AI legal platform, built for practitioners like you.",
    features: [
      { icon: "Sparkles", label: "AI-Powered" },
      { icon: "Shield", label: "Secure" },
      { icon: "Zap", label: "Fast" },
    ],
  },
  {
    icon: "Briefcase",
    heading: "Your Practice",
    description: "AI tools calibrated to your areas of expertise and experience.",
    features: [
      { icon: "FileText", label: "Briefs" },
      { icon: "Search", label: "Research" },
      { icon: "BookOpen", label: "Case Law" },
    ],
  },
  {
    icon: "MapPin",
    heading: "Local Intelligence",
    description: "Jurisdiction-specific case law and court insights for your region.",
    features: [
      { icon: "Building2", label: "Courts" },
      { icon: "Gavel", label: "Precedents" },
      { icon: "FileStack", label: "Statutes" },
    ],
  },
  {
    icon: "Building",
    heading: "Your Workspace",
    description: "Tailored workflows for your firm's size and daily needs.",
    features: [
      { icon: "Users", label: "Team" },
      { icon: "BarChart", label: "Dashboard" },
      { icon: "Clock", label: "Tracking" },
    ],
  },
  {
    icon: "Rocket",
    heading: "Ready to Go",
    description: "300,000+ judgments. 44 AI tools. Your practice, amplified.",
    features: [
      { icon: "Zap", label: "44 Tools" },
      { icon: "Star", label: "Premium" },
      { icon: "BarChart", label: "Insights" },
    ],
  },
];

// --- Signup Premium Panel ---

export interface SignupPanelStep {
  icon: string;
  heading: string;
  description: string;
  features: { icon: string; label: string }[];
}

export const SIGNUP_PANEL_STEPS: SignupPanelStep[] = [
  {
    icon: "Scale",
    heading: "Pakistan's Legal AI",
    description: "AI-powered tools for every legal professional — research, draft, and manage cases intelligently.",
    features: [
      { icon: "Search", label: "Research" },
      { icon: "FileText", label: "Draft" },
      { icon: "BarChart3", label: "Manage" },
    ],
  },
  {
    icon: "UserCheck",
    heading: "Your Workspace Awaits",
    description: "Set up your account in minutes and start using QanoonAI tailored to your role.",
    features: [
      { icon: "Zap", label: "AI Tools" },
      { icon: "Shield", label: "Secure" },
      { icon: "Clock", label: "Minutes" },
    ],
  },
];
