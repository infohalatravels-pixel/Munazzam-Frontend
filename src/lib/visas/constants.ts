import type { VisaEmployeeType, VisaPaymentStatus } from "./types";

export const EMPLOYEE_TYPE_LABEL: Record<VisaEmployeeType, string> = {
  FREELANCER: "Freelancer",
  PERMANENT: "Permanent",
  CONTRACT: "Contract",
};

export const EMPLOYEE_TYPE_CLASS: Record<VisaEmployeeType, string> = {
  FREELANCER: "bg-[#E0F2FE] text-[#0369A1]",
  PERMANENT: "bg-[#DBEAFE] text-[#1E40AF]",
  CONTRACT: "bg-[#F3E8FF] text-[#6B21A8]",
};

export const PAYMENT_STATUS_CLASS: Record<VisaPaymentStatus, string> = {
  PAID: "bg-[#D1FAE5] text-[#065F46]",
  PARTIAL: "bg-[#FEF3C7] text-[#92400E]",
  DUE: "bg-[#FEE2E2] text-[#991B1B]",
  "N/A": "bg-surface-container text-on-surface-variant",
};

export const STAGE_FILTER_OPTIONS = [
  "All Stages",
  "Medical",
  "MOI",
  "Visa",
  "Biometrics",
  "QID",
] as const;

/** Maps hub stage filter labels to `currentStageKey` substring for API queries. */
export const STAGE_FILTER_QUERY: Record<string, string | undefined> = {
  "All Stages": undefined,
  Medical: "MEDICAL",
  MOI: "MOI",
  Visa: "VISA",
  Biometrics: "BIOMETRIC",
  QID: "QID",
};

export const TYPE_FILTER_OPTIONS = ["All Types", "Freelancer", "Permanent", "Contract"] as const;

export const TYPE_FILTER_QUERY: Record<string, string | undefined> = {
  "All Types": undefined,
  Freelancer: "FREELANCER",
  Permanent: "PERMANENT",
  Contract: "CONTRACT",
};

export const WIZARD_STEPS = [
  { id: 1, label: "Visa Type" },
  { id: 2, label: "Quota" },
  { id: 3, label: "Applicant" },
  { id: 4, label: "Employment" },
  { id: 5, label: "Payments" },
  { id: 6, label: "Review" },
] as const;

export const HOME_COUNTRY_MEDICAL_CODES = new Set(["PK", "IN", "NP", "BD", "PH"]);

export const QUOTA_OPTIONS = [
  { id: "vp-in", label: "India - VP-2024-001", country: "India", vpNumber: "VP-2024-001", total: 50, available: 12 },
  { id: "vp-pk", label: "Pakistan - VP-2024-042", country: "Pakistan", vpNumber: "VP-2024-042", total: 50, available: 12 },
  { id: "vp-ph", label: "Philippines - VP-2024-088", country: "Philippines", vpNumber: "VP-2024-088", total: 25, available: 8 },
  { id: "vp-uk", label: "United Kingdom - VP-2024-012", country: "United Kingdom", vpNumber: "VP-2024-012", total: 20, available: 2 },
] as const;

export const NATIONALITY_OPTIONS = [
  { code: "IN", label: "India" },
  { code: "PK", label: "Pakistan" },
  { code: "PH", label: "Philippines" },
  { code: "UK", label: "United Kingdom" },
] as const;

export const DEFAULT_PAYMENT_MILESTONES = [
  { label: "Initial Application", amount: 1500, dueStage: "Immediate", status: "PENDING" as const },
  { label: "Govt Visa Approval", amount: 3000, dueStage: "Upon MoI Approval", status: "SCHEDULED" as const },
  { label: "Medical & Biometrics", amount: 800, dueStage: "Pre-Departure", status: "SCHEDULED" as const },
  { label: "Final QID Issuance", amount: 1200, dueStage: "Final Stage", status: "SCHEDULED" as const },
];

export const PROFESSION_CATEGORIES = [
  "Information Technology",
  "Construction & Engineering",
  "Healthcare",
  "Executive Management",
  "Engineering & Design",
] as const;
