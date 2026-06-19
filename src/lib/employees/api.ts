import { getAccessToken } from "@/lib/auth/session";
import { apiClient } from "@/lib/auth/apiClient";
import type { EmployeeDocument } from "./documents";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type Department = {
  id: string;
  name: string;
  code: string;
};

export type EmployeeRecord = {
  id: string;
  employeeId: string;
  employeeCode: string;
  name: string;
  nameAsPassport: string;
  phoneNo: string;
  nationality: string;
  department: string;
  departmentId: string | null;
  departmentCode: string;
  position: string;
  designation: string | null;
  visaStatus: string;
  visaStatusLabel: string;
  visaStatusClassName: string;
  joinedDate: string;
  joinDate: string;
  employeeType: string;
  passportNo: string;
  passportExpiry: string;
  qidNo: string | null;
  qidExpiry: string | null;
  salary: number;
  visaType: string;
  visaNumber: string;
  visaIssueDate: string;
  visaExpiryDate: string;
  sponsorFileNo: string | null;
  professionOnVisa: string;
  workPermitNo: string | null;
  employmentStatus: string;
  lastSalaryTransferDate: string | null;
  hasPhoto: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdByName?: string;
};

export type EmployeeDetail = EmployeeRecord & {
  documents: EmployeeDocument[];
  createdByName: string;
};

export type EmployeeListResponse = {
  employees: EmployeeRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    from: number;
    to: number;
  };
};

export type EmployeeStats = {
  totalStaff: number;
  activeVisas: number;
  activeVisaPct: string;
  expiringSoon: number;
  onLeave: number;
};

export type EmployeeListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  visaStatus?: string;
  employmentStatus?: string;
};

export async function fetchDepartments(): Promise<Department[]> {
  const result = await apiClient<{ departments: Department[] }>("/api/departments", {
    method: "GET",
  });
  return result.departments;
}

export async function fetchEmployees(
  query: EmployeeListQuery = {}
): Promise<EmployeeListResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.departmentId) params.set("departmentId", query.departmentId);
  if (query.visaStatus) params.set("visaStatus", query.visaStatus);
  if (query.employmentStatus) params.set("employmentStatus", query.employmentStatus);

  const qs = params.toString();
  return apiClient<EmployeeListResponse>(`/api/employees${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
}

export async function fetchEmployeeStats(): Promise<EmployeeStats> {
  const result = await apiClient<{ stats: EmployeeStats }>("/api/employees/stats", {
    method: "GET",
  });
  return result.stats;
}

export async function fetchVisaExpiringEmployees(days = 30): Promise<EmployeeRecord[]> {
  const result = await apiClient<{ employees: EmployeeRecord[] }>(
    `/api/employees/visa-expiring?days=${days}`,
    { method: "GET" }
  );
  return result.employees;
}

export async function createEmployee(
  payload: Record<string, unknown>,
  files: {
    photo?: File | null;
    visa?: File | null;
    passport?: File | null;
    qid?: File | null;
  }
): Promise<EmployeeRecord> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  if (files.photo) formData.append("photo", files.photo);
  if (files.visa) formData.append("visa", files.visa);
  if (files.passport) formData.append("passport", files.passport);
  if (files.qid) formData.append("qid", files.qid);

  const response = await fetch(`${API_URL}/api/employees`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create employee.");
  }

  return result.data.employee as EmployeeRecord;
}

export async function fetchEmployeeById(employeeId: string): Promise<EmployeeDetail> {
  const result = await apiClient<{ employee: EmployeeDetail }>(
    `/api/employees/${employeeId}`,
    { method: "GET" }
  );
  return result.employee;
}

export async function deleteEmployee(employeeId: string): Promise<void> {
  await apiClient(`/api/employees/${employeeId}`, { method: "DELETE" });
}

export async function bulkDeleteEmployees(employeeIds: string[]): Promise<void> {
  await apiClient("/api/employees/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ employeeIds }),
  });
}

export async function downloadEmployeesCsv(query: EmployeeListQuery = {}): Promise<void> {
  await downloadCsv("/api/employees/export", query, `employees-${Date.now()}.csv`);
}

export async function downloadVisaAlertsCsv(days = 30): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  const response = await fetch(
    `${API_URL}/api/employees/visa-expiring/report?days=${days}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Failed to download report.");

  const blob = await response.blob();
  triggerDownload(blob, `visa-expiring-report-${Date.now()}.csv`);
}

export function getEmployeePhotoUrl(employeeId: string): string {
  return `${API_URL}/api/employees/${employeeId}/photo`;
}

async function downloadCsv(
  path: string,
  query: EmployeeListQuery,
  filename: string
): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.departmentId) params.set("departmentId", query.departmentId);
  if (query.visaStatus) params.set("visaStatus", query.visaStatus);
  if (query.employmentStatus) params.set("employmentStatus", query.employmentStatus);

  const qs = params.toString();
  const response = await fetch(`${API_URL}${path}${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to export CSV.");

  const blob = await response.blob();
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const VISA_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All visa statuses" },
  { value: "VERIFIED", label: "Verified" },
  { value: "RENEWING", label: "Renewing" },
  { value: "EXPIRED", label: "Expired" },
  { value: "PENDING", label: "Pending" },
];
