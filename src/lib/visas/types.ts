export type VisaEmployeeType = "FREELANCER" | "PERMANENT" | "CONTRACT";

export type VisaFinancialModel = "CLIENT_PAYS" | "COMPANY_PAYS";

export type VisaApplicationStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REJECTED" | "ON_HOLD";

export type VisaPaymentStatus = "PAID" | "PARTIAL" | "DUE" | "N/A";

export type MedicalRoute = "HOME_COUNTRY_QMC" | "IN_QATAR_QMC";

export type VisaStageStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "FAILED" | "SKIPPED";

export type VisaKpi = {
  id: string;
  label: string;
  value: number;
  sublabel: string;
  icon: string;
  highlight?: boolean;
  trend?: string;
};

export type VisaQuotaCard = {
  id: string;
  country: string;
  countryCode: string;
  vpNumber: string;
  used: number;
  total: number;
};

export type VisaApplication = {
  id: string;
  reference: string;
  applicantName: string;
  employeeType: VisaEmployeeType;
  nationality: string;
  vpNumber: string;
  currentStage: string;
  currentStageKey: string;
  daysInStage: number;
  paymentStatus: VisaPaymentStatus;
  avatarInitials: string;
};

export type VisaAllocation = {
  id: string;
  country: string;
  countryCode: string;
  vpNumber: string;
  professionCategory: string;
  totalQuota: number;
  usedQuota: number;
  status: "ACTIVE" | "FULL" | "INACTIVE";
};

export type VisaStageItem = {
  key: string;
  label: string;
  status: VisaStageStatus;
  date?: string;
  notes?: string;
};

export type VisaPaymentMilestone = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "DUE" | "SCHEDULED" | "PENDING";
};

export type VisaDocumentItem = {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  icon: "pdf" | "doc";
};

export type VisaDetail = {
  id: string;
  reference: string;
  applicantName: string;
  visaTypeLabel: string;
  vpNumber: string;
  status: VisaApplicationStatus;
  medicalRoute: MedicalRoute;
  financialModel: VisaFinancialModel;
  employeeType: VisaEmployeeType;
  moiReference: string;
  medicalCenter: string;
  currentStageIndex: number;
  totalStages: number;
  stages: VisaStageItem[];
  milestones: VisaPaymentMilestone[];
  documents: VisaDocumentItem[];
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  linkedEmployeeCode?: string;
  linkedEmployeeStatus?: "INACTIVE" | "ACTIVE" | string;
  employeeId?: string | null;
};

export type QuotaSummary = {
  totalSlots: number;
  usedSlots: number;
  availableSlots: number;
  percentRemaining: number;
  countryCount: number;
};
