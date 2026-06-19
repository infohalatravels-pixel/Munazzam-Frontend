import type { EmployeeRecord } from "@/lib/employees/api";
import type { EmployeeDocument } from "@/lib/employees/documents";
import type { ComplianceDocument } from "@/lib/company/profile";

export type DocumentComplianceStatus = {
  label: string;
  className: string;
};

export type EmployeeDocumentSummary = {
  validCount: number;
  expiringCount: number;
  missingCount: number;
  totalSlots: number;
  progressPercent: number;
  status: DocumentComplianceStatus;
};

function daysUntil(dateValue?: string | null) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getEmployeeDocumentSummary(
  employee: EmployeeRecord
): EmployeeDocumentSummary {
  const slots = [
    { has: Boolean(employee.passportNo), expiry: employee.passportExpiry },
    { has: Boolean(employee.qidNo), expiry: employee.qidExpiry },
    { has: Boolean(employee.visaNumber), expiry: employee.visaExpiryDate },
    { has: employee.hasPhoto, expiry: null as string | null },
  ];

  let validCount = 0;
  let expiringCount = 0;
  let missingCount = 0;

  for (const slot of slots) {
    if (!slot.has) {
      missingCount += 1;
      continue;
    }

    const days = daysUntil(slot.expiry);
    if (days !== null && days < 0) {
      missingCount += 1;
      continue;
    }

    validCount += 1;
    if (days !== null && days <= 30) {
      expiringCount += 1;
    }
  }

  const totalSlots = slots.length;
  const progressPercent = Math.round((validCount / totalSlots) * 100);

  let status: DocumentComplianceStatus;
  if (missingCount > 0 || employee.visaStatus === "EXPIRED") {
    status = {
      label: "Action Required",
      className: "bg-error-container text-on-error-container",
    };
  } else if (expiringCount > 0 || employee.visaStatus === "EXPIRING") {
    status = {
      label: "Review Needed",
      className: "bg-amber-100 text-amber-800",
    };
  } else {
    status = {
      label: "Compliant",
      className: "bg-emerald-100 text-emerald-800",
    };
  }

  return {
    validCount,
    expiringCount,
    missingCount,
    totalSlots,
    progressPercent,
    status,
  };
}

export function summarizeCompanyDocuments(documents: ComplianceDocument[]) {
  const total = documents.length;
  const uploaded = documents.filter((doc) => Boolean(doc.documentId)).length;
  const missing = total - uploaded;

  return { total, uploaded, missing };
}

export type DocumentSection = {
  id: string;
  title: string;
  icon: string;
  documentIds: string[];
};

export const EMPLOYEE_DOCUMENT_SECTIONS: DocumentSection[] = [
  {
    id: "identity",
    title: "Identity Documents",
    icon: "fingerprint",
    documentIds: ["passport", "qid"],
  },
  {
    id: "visa",
    title: "Legal & Visa Compliance",
    icon: "gavel",
    documentIds: ["visa"],
  },
  {
    id: "employment",
    title: "Employment Documents",
    icon: "work",
    documentIds: ["photo"],
  },
];

export function groupEmployeeDocuments(documents: EmployeeDocument[]) {
  return EMPLOYEE_DOCUMENT_SECTIONS.map((section) => ({
    ...section,
    documents: documents.filter((doc) => section.documentIds.includes(doc.id)),
  })).filter((section) => section.documents.length > 0);
}

export function formatDocumentDate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
