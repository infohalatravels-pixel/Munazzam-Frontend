import type { CompanyType, OnboardingFormData } from "./types";

export type CompanyProfileView = {
  legalNameEn: string;
  legalNameAr: string;
  tradeNameEn: string;
  tradeNameAr: string;
  companyType: CompanyType;
  industry: string;
  crNumber: string;
  crIssueDate: string;
  crExpiryDate: string;
  establishmentCardNo: string;
  signatoryName: string;
  signatoryQid: string;
  email: string;
  phoneNo: string;
  website: string;
  physicalAddress: string;
  nationalAddressCode: string;
};

export const DEMO_COMPANY_PROFILE: CompanyProfileView = {
  legalNameEn: "Munazzam Operations Management WLL",
  legalNameAr: "منظم لإدارة العمليات ذ.م.م",
  tradeNameEn: "Munazzam",
  tradeNameAr: "منظم",
  companyType: "BOTH",
  industry: "Professional Services / Logistics",
  crNumber: "129485/01",
  crIssueDate: "2020-10-14",
  crExpiryDate: "2025-10-14",
  establishmentCardNo: "78-3920-112",
  signatoryName: "Ahmed Al-Thani",
  signatoryQid: "29063400192",
  email: "ops@munazzam.qa",
  phoneNo: "+974 4455 0000",
  website: "www.munazzam.qa",
  physicalAddress:
    "Tornado Tower, Floor 42,\nWest Bay, Street 810, Zone 60\nDoha, Qatar",
  nationalAddressCode: "60 - 810 - 42 - 12",
};

export function formatDisplayDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getCrStatus(expiry?: string | null) {
  if (!expiry) {
    return {
      label: "UNKNOWN",
      className: "bg-surface-container-highest text-on-surface-variant",
    };
  }

  const exp = new Date(expiry);
  const now = new Date();

  if (exp < now) {
    return {
      label: "EXPIRED",
      className: "bg-error-container text-on-error-container",
    };
  }

  const days = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 30) {
    return {
      label: "EXPIRING SOON",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "ACTIVE",
    className: "bg-green-100 text-green-700",
  };
}

export function getCompanyTypeBadges(type?: CompanyType) {
  if (type === "BOTH") return ["SPONSOR", "PRO"];
  if (type === "SPONSOR") return ["SPONSOR"];
  if (type === "PRO_AGENCY") return ["PRO"];
  return [];
}

function buildPhysicalAddress(data: OnboardingFormData) {
  const parts = [
    data.buildingNo ? `Building ${data.buildingNo}` : null,
    data.area,
    data.streetNo ? `Street ${data.streetNo}` : null,
    data.zoneNo ? `Zone ${data.zoneNo}` : null,
    [data.city, data.country].filter(Boolean).join(", "),
  ].filter(Boolean);

  if (parts.length > 0) return parts.join(",\n");
  return data.nationalAddress || "—";
}

function buildNationalAddressCode(data: OnboardingFormData) {
  const zone = data.zoneNo || "—";
  const street = data.streetNo || "—";
  const building = data.buildingNo || "—";
  const po = data.poBox || "—";
  return `${zone} - ${street} - ${building} - ${po}`;
}

export function mapFormDataToProfile(data: OnboardingFormData): CompanyProfileView {
  const empty = "—";

  return {
    legalNameEn: data.legalNameEn || empty,
    legalNameAr: data.legalNameAr || empty,
    tradeNameEn: data.tradeNameEn || empty,
    tradeNameAr: data.tradeNameAr || empty,
    companyType: data.companyType || "PRO_AGENCY",
    industry: data.industry || empty,
    crNumber: data.crNumber || empty,
    crIssueDate: data.crIssueDate || "",
    crExpiryDate: data.crExpiryDate || "",
    establishmentCardNo: data.establishmentCardNo || empty,
    signatoryName: data.signatoryName || empty,
    signatoryQid: data.signatoryQid || empty,
    email: data.email || empty,
    phoneNo: data.phoneNo || empty,
    website: data.website || empty,
    physicalAddress: buildPhysicalAddress(data),
    nationalAddressCode: buildNationalAddressCode(data),
  };
}

export type ComplianceDocument = {
  id: string;
  documentId: string | null;
  title: string;
  subtitle: string;
  icon: string;
  status: string;
  statusClassName: string;
  fileName?: string | null;
  mimeType?: string | null;
};

export const DEMO_COMPLIANCE_DOCUMENTS: ComplianceDocument[] = [
  {
    id: "cr",
    documentId: null,
    title: "CR Certificate",
    subtitle: "No document uploaded yet",
    icon: "article",
    status: "MISSING",
    statusClassName: "bg-surface-container-highest text-on-surface-variant",
  },
  {
    id: "establishment",
    documentId: null,
    title: "Establishment Card",
    subtitle: "No document uploaded yet",
    icon: "badge",
    status: "MISSING",
    statusClassName: "bg-surface-container-highest text-on-surface-variant",
  },
  {
    id: "qid",
    documentId: null,
    title: "Signatory QID",
    subtitle: "No document uploaded yet",
    icon: "account_box",
    status: "MISSING",
    statusClassName: "bg-surface-container-highest text-on-surface-variant",
  },
];
