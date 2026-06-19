import { apiClient } from "@/lib/auth/apiClient";

export type DocumentExpiryAlert = {
  id: string;
  entityType: "company" | "employee";
  entityId: string | null;
  title: string;
  subtitle: string;
  icon: string;
  expiryDate: string | null;
  expiryDisplay: string;
  daysLeft: number;
  severity: "expired" | "expiring";
  badgeLabel: string;
  accentClass: string;
  timeLabel: string;
  resolveHref: string;
};

export type DocumentsHubStats = {
  totalAssets: number;
  missingFiles: number;
  complianceRate: number;
  storageUsedMb: number;
  companyDocSlots: number;
  employeeDocTypes: number;
  activeEmployees: number;
  entitiesEnabled: number;
};

export type DocumentsHubResponse = {
  alerts: DocumentExpiryAlert[];
  alertCount: number;
  stats: DocumentsHubStats;
};

export async function fetchDocumentsHub(): Promise<DocumentsHubResponse> {
  return apiClient<DocumentsHubResponse>("/api/documents/hub", {
    method: "GET",
  });
}
