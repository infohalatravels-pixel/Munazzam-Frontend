import type {
  QuotaSummary,
  VisaAllocation,
  VisaApplication,
  VisaDetail,
  VisaKpi,
  VisaQuotaCard,
} from "./types";

export const VISA_KPIS: VisaKpi[] = [
  { id: "in-progress", label: "In Progress", value: 24, sublabel: "+12%", icon: "pending_actions", trend: "up" },
  { id: "awaiting-medical", label: "Awaiting Medical", value: 8, sublabel: "Stable", icon: "medical_services" },
  { id: "medical-cleared", label: "Medical Cleared", value: 15, sublabel: "Fast Track", icon: "task_alt", trend: "positive" },
  { id: "completed", label: "Completed (30d)", value: 42, sublabel: "Record High", icon: "history", trend: "up" },
  {
    id: "quota",
    label: "Quota Available",
    value: 128,
    sublabel: "Across 6 Countries",
    icon: "pie_chart",
    highlight: true,
  },
];

export const VISA_QUOTA_CARDS: VisaQuotaCard[] = [
  { id: "qa", country: "Qatar (HQ)", countryCode: "QA", vpNumber: "VP-821", used: 45, total: 50 },
  { id: "in", country: "India", countryCode: "IN", vpNumber: "VP-412", used: 12, total: 30 },
  { id: "ph", country: "Philippines", countryCode: "PH", vpNumber: "VP-993", used: 8, total: 25 },
  { id: "uk", country: "UK", countryCode: "UK", vpNumber: "VP-002", used: 18, total: 20 },
];

export const VISA_APPLICATIONS: VisaApplication[] = [
  {
    id: "vz-9281",
    reference: "#VZ-9281",
    applicantName: "Sarah Jenkins",
    employeeType: "PERMANENT",
    nationality: "British",
    vpNumber: "VP-002",
    currentStage: "Medical Center",
    currentStageKey: "medical",
    daysInStage: 4,
    paymentStatus: "PAID",
    avatarInitials: "SJ",
  },
  {
    id: "vz-9285",
    reference: "#VZ-9285",
    applicantName: "Rajesh Kumar",
    employeeType: "FREELANCER",
    nationality: "Indian",
    vpNumber: "VP-412",
    currentStage: "Labor Dept",
    currentStageKey: "labor",
    daysInStage: 12,
    paymentStatus: "PARTIAL",
    avatarInitials: "RK",
  },
  {
    id: "vz-9302",
    reference: "#VZ-9302",
    applicantName: "Elena Rodriguez",
    employeeType: "CONTRACT",
    nationality: "Spanish",
    vpNumber: "VP-821",
    currentStage: "Fingerprinting",
    currentStageKey: "fingerprint",
    daysInStage: 2,
    paymentStatus: "DUE",
    avatarInitials: "ER",
  },
  {
    id: "vz-9310",
    reference: "#VZ-9310",
    applicantName: "David Chen",
    employeeType: "PERMANENT",
    nationality: "Chinese",
    vpNumber: "VP-002",
    currentStage: "Stamping",
    currentStageKey: "stamping",
    daysInStage: 1,
    paymentStatus: "PAID",
    avatarInitials: "DC",
  },
];

export const QUOTA_SUMMARY: QuotaSummary = {
  totalSlots: 1250,
  usedSlots: 842,
  availableSlots: 408,
  percentRemaining: 32.6,
  countryCount: 6,
};

export const VISA_ALLOCATIONS: VisaAllocation[] = [
  {
    id: "alloc-in",
    country: "India",
    countryCode: "IN",
    vpNumber: "VP-2023-0042",
    professionCategory: "Information Technology",
    totalQuota: 250,
    usedQuota: 185,
    status: "ACTIVE",
  },
  {
    id: "alloc-ph",
    country: "Philippines",
    countryCode: "PH",
    vpNumber: "VP-2023-0089",
    professionCategory: "Engineering & Design",
    totalQuota: 120,
    usedQuota: 120,
    status: "FULL",
  },
  {
    id: "alloc-eg",
    country: "Egypt",
    countryCode: "EG",
    vpNumber: "VP-2023-0112",
    professionCategory: "Executive Management",
    totalQuota: 45,
    usedQuota: 12,
    status: "ACTIVE",
  },
];

export const VISA_DETAIL_DEMO: VisaDetail = {
  id: "vis-2026-00042",
  reference: "VIS-2026-00042",
  applicantName: "Arjun Singh",
  visaTypeLabel: "Employment Visa",
  vpNumber: "VP-IN-014",
  status: "IN_PROGRESS",
  medicalRoute: "HOME_COUNTRY_QMC",
  financialModel: "CLIENT_PAYS",
  employeeType: "FREELANCER",
  moiReference: "2026-9938-110294",
  medicalCenter: "Qatar Medical Center, New Delhi",
  currentStageIndex: 4,
  totalStages: 13,
  linkedEmployeeCode: "EMP-0042",
  linkedEmployeeStatus: "INACTIVE",
  lastUpdatedBy: "Fatima Al-Thani",
  lastUpdatedAt: "2 hours ago",
  stages: [
    { key: "offer", label: "Offer Letter Signed", status: "COMPLETED", date: "Oct 12, 2025", notes: "Electronically signed by candidate." },
    { key: "docs", label: "Document Verification", status: "COMPLETED", date: "Oct 14, 2025", notes: "Passport and degree certificates verified." },
    { key: "medical-book", label: "Medical Booking (QMC)", status: "COMPLETED", date: "Oct 16, 2025", notes: "Appointment confirmed at Delhi QMC Center." },
    {
      key: "medical-result",
      label: "QMC Medical Result",
      status: "IN_PROGRESS",
      notes: "Wait for electronic transfer of results from QMC to Qatar MOI portal.",
    },
    { key: "moi", label: "Ministry Approval", status: "PENDING" },
    { key: "evisa", label: "Visa Issuance (E-Visa)", status: "PENDING" },
  ],
  milestones: [
    { id: "m1", label: "Initial Deposit", amount: 500, dueDate: "Oct 10, 2025", status: "PAID" },
    { id: "m2", label: "QMC Processing Fee", amount: 1200, dueDate: "Oct 15, 2025", status: "DUE" },
    { id: "m3", label: "Visa Issuance Fee", amount: 2000, dueDate: "Pending Stage", status: "SCHEDULED" },
  ],
  documents: [
    { id: "d1", name: "Passport_Arjun_S.pdf", uploadedAt: "Oct 14", size: "1.2 MB", icon: "pdf" },
    { id: "d2", name: "Signed_Offer_Letter.pdf", uploadedAt: "Oct 12", size: "0.8 MB", icon: "doc" },
  ],
};

export function getVisaDetailById(id: string): VisaDetail | null {
  if (id === VISA_DETAIL_DEMO.id || id === "vis-2026-00042") {
    return VISA_DETAIL_DEMO;
  }
  const app = VISA_APPLICATIONS.find((item) => item.id === id);
  if (!app) return null;
  return {
    ...VISA_DETAIL_DEMO,
    id: app.id,
    reference: app.reference.replace("#", ""),
    applicantName: app.applicantName,
    vpNumber: app.vpNumber,
    employeeType: app.employeeType,
    financialModel: app.employeeType === "FREELANCER" ? "CLIENT_PAYS" : "COMPANY_PAYS",
  };
}
