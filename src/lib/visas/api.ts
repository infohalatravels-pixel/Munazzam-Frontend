import { apiClient } from "@/lib/auth/apiClient";
import type {
  QuotaSummary,
  VisaAllocation,
  VisaApplication,
  VisaDetail,
  VisaKpi,
  VisaPaymentMilestone,
  VisaQuotaCard,
  VisaStageItem,
} from "./types";

export type VisaHubResult = {
  kpis: VisaKpi[];
  quotaCards: VisaQuotaCard[];
  applications: VisaApplication[];
  totalApplications: number;
};

export type VisaAllocationListResult = {
  allocations: VisaAllocation[];
  summary: QuotaSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type VisaApplicationListResult = {
  applications: VisaApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  from: number;
  to: number;
};

export type VisaQuotaOption = {
  id: string;
  label: string;
  country: string;
  countryCode: string;
  vpNumber: string;
  total: number;
  available: number;
};

export type CreateVisaAllocationPayload = {
  country: string;
  countryCode: string;
  vpNumber: string;
  professionCategory?: string;
  totalQuota: number;
  notes?: string;
};

export type CreateVisaApplicationPayload = {
  financialModel: "CLIENT_PAYS" | "COMPANY_PAYS";
  allocationId?: string;
  applicantName: string;
  nationality: string;
  nationalityCode?: string;
  passportNo: string;
  passportExpiry: string;
  professionOnVisa: string;
  employeeType: "FREELANCER" | "PERMANENT" | "CONTRACT";
  phoneNo?: string;
  createInactiveEmployee?: boolean;
  departmentId?: string;
  medicalCenterName?: string;
  medicalCenterCity?: string;
  medicalAppointmentDate?: string;
  medicalRoute?: "HOME_COUNTRY_QMC" | "IN_QATAR_QMC";
};

export type VisaApplicationDetailResult = {
  application: VisaDetail & {
    nationality: string;
    passportNo: string;
    professionOnVisa: string;
    phoneNo: string | null;
    allocationId: string | null;
    employeeId: string | null;
  };
};

export async function fetchVisaHub(): Promise<VisaHubResult> {
  return apiClient<VisaHubResult>("/api/visas/hub", { method: "GET" });
}

export async function fetchVisaAllocations(query: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<VisaAllocationListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  const qs = params.toString();
  return apiClient<VisaAllocationListResult>(`/api/visas/allocations${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
}

export async function createVisaAllocation(
  payload: CreateVisaAllocationPayload
): Promise<{ allocation: VisaAllocation }> {
  return apiClient<{ allocation: VisaAllocation }>("/api/visas/allocations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchVisaQuotaOptions(): Promise<{ options: VisaQuotaOption[] }> {
  return apiClient<{ options: VisaQuotaOption[] }>("/api/visas/quota-options", { method: "GET" });
}

export async function fetchVisaApplications(query: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  employeeType?: string;
  stageKey?: string;
  stageContains?: string;
  vpNumber?: string;
} = {}): Promise<VisaApplicationListResult> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  const qs = params.toString();
  return apiClient<VisaApplicationListResult>(`/api/visas/applications${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
}

export async function fetchVisaApplicationById(
  applicationId: string
): Promise<VisaApplicationDetailResult> {
  return apiClient<VisaApplicationDetailResult>(`/api/visas/applications/${applicationId}`, {
    method: "GET",
  });
}

export async function createVisaApplication(
  payload: CreateVisaApplicationPayload
): Promise<VisaApplicationDetailResult> {
  return apiClient<VisaApplicationDetailResult>("/api/visas/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function advanceVisaStage(
  applicationId: string,
  notes?: string
): Promise<VisaApplicationDetailResult> {
  return apiClient<VisaApplicationDetailResult>(
    `/api/visas/applications/${applicationId}/advance-stage`,
    {
      method: "POST",
      body: JSON.stringify({ notes }),
    }
  );
}

export async function activateEmployeeFromVisa(
  applicationId: string
): Promise<VisaApplicationDetailResult> {
  return apiClient<VisaApplicationDetailResult>(
    `/api/visas/applications/${applicationId}/activate-employee`,
    { method: "POST" }
  );
}

export type { VisaStageItem, VisaPaymentMilestone };
