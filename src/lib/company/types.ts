import type { SessionUser } from "@/lib/auth/session";

export type CompanyType = "SPONSOR" | "PRO_AGENCY" | "BOTH";
export type LegalForm =
  | "LLC"
  | "WLL"
  | "SOLE_PROPRIETORSHIP"
  | "BRANCH"
  | "OTHER";

export type OnboardingFormData = {
  legalNameEn?: string;
  legalNameAr?: string;
  tradeNameEn?: string;
  tradeNameAr?: string;
  companyType?: CompanyType;
  legalForm?: LegalForm | "";
  industry?: string;
  crNumber?: string;
  crIssueDate?: string;
  crExpiryDate?: string;
  email?: string;
  phoneNo?: string;
  mobileNo?: string;
  website?: string;
  poBox?: string;
  buildingNo?: string;
  streetNo?: string;
  zoneNo?: string;
  area?: string;
  city?: string;
  country?: string;
  nationalAddress?: string;
  establishmentCardNo?: string;
  establishmentCardExpiry?: string;
  sponsorFileNo?: string;
  signatoryName?: string;
  signatoryQid?: string;
  signatoryQidExpiry?: string;
  signatoryPhone?: string;
  visaAllocated?: number;
  maxEmployees?: number;
  maxStorageGb?: number;
};

export type OnboardingState = {
  isCompanySetup: boolean;
  onboardingStep: number;
  formData: OnboardingFormData;
  company: OnboardingFormData | null;
};

export type SaveOnboardingResult = {
  user: SessionUser;
  company: OnboardingFormData | null;
  currentStep: number;
  nextStep: number;
  completed: boolean;
  formData: OnboardingFormData;
};

export const ONBOARDING_STEPS = [
  { id: 1, label: "Company Identity" },
  { id: 2, label: "CR Information" },
  { id: 3, label: "Address & Contact" },
  { id: 4, label: "Signatory" },
  { id: 5, label: "Visa & Limits" },
] as const;

export const COMPANY_TYPE_OPTIONS: { value: CompanyType; label: string }[] = [
  { value: "SPONSOR", label: "Sponsor Company" },
  { value: "PRO_AGENCY", label: "PRO Agency" },
  { value: "BOTH", label: "Sponsor & PRO Agency" },
];

export const LEGAL_FORM_OPTIONS: { value: LegalForm; label: string }[] = [
  { value: "LLC", label: "LLC (Limited Liability Company)" },
  { value: "SOLE_PROPRIETORSHIP", label: "Sole Proprietorship" },
  { value: "WLL", label: "WLL" },
  { value: "BRANCH", label: "Branch of Foreign Company" },
  { value: "OTHER", label: "Other" },
];

export const EMPTY_ONBOARDING_FORM: OnboardingFormData = {
  legalNameEn: "",
  legalNameAr: "",
  tradeNameEn: "",
  tradeNameAr: "",
  companyType: "PRO_AGENCY",
  legalForm: "",
  industry: "",
  crNumber: "",
  crIssueDate: "",
  crExpiryDate: "",
  email: "",
  phoneNo: "",
  mobileNo: "",
  website: "",
  poBox: "",
  buildingNo: "",
  streetNo: "",
  zoneNo: "",
  area: "",
  city: "Doha",
  country: "Qatar",
  nationalAddress: "",
  establishmentCardNo: "",
  establishmentCardExpiry: "",
  sponsorFileNo: "",
  signatoryName: "",
  signatoryQid: "",
  signatoryQidExpiry: "",
  signatoryPhone: "",
  visaAllocated: 10,
  maxEmployees: 50,
  maxStorageGb: 1024,
};
