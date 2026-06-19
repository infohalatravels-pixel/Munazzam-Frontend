import { getAccessToken } from "@/lib/auth/session";
import { apiClient } from "@/lib/auth/apiClient";
import type { OnboardingFormData } from "./types";
import type { ComplianceDocument } from "./profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type CompanyProfileResponse = {
  profile: OnboardingFormData;
  documents: ComplianceDocument[];
};

export type ProfileSection =
  | "identity"
  | "registration"
  | "signatory"
  | "contact";

export async function fetchCompanyProfile(): Promise<CompanyProfileResponse> {
  return apiClient<CompanyProfileResponse>("/api/companies/profile", {
    method: "GET",
  });
}

export async function updateCompanyProfileSection(
  section: ProfileSection,
  payload: OnboardingFormData
): Promise<OnboardingFormData> {
  const result = await apiClient<{ profile: OnboardingFormData }>(
    `/api/companies/profile/sections/${section}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return result.profile;
}

export async function uploadComplianceDocument(
  docKey: string,
  file: File
): Promise<ComplianceDocument> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/companies/documents/${docKey}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Upload failed.");
  }

  return result.data.document as ComplianceDocument;
}

export async function fetchDocumentBlob(
  documentId: string,
  mode: "view" | "download"
): Promise<Blob> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  const response = await fetch(
    `${API_URL}/api/companies/documents/${documentId}/${mode}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load document.");
  }

  return response.blob();
}

export async function downloadComplianceDocument(
  document: ComplianceDocument
): Promise<void> {
  if (!document.documentId) return;

  const blob = await fetchDocumentBlob(document.documentId, "download");
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = document.fileName || `${document.title}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export const UPLOAD_DOC_OPTIONS = [
  {
    id: "cr",
    label: "CR Certificate",
    description: "Commercial registration certificate",
    icon: "article",
  },
  {
    id: "establishment",
    label: "Establishment Card",
    description: "Company establishment card",
    icon: "badge",
  },
  {
    id: "qid",
    label: "Signatory QID",
    description: "Authorized signatory QID copy",
    icon: "account_box",
  },
] as const;

export type UploadDocKey = (typeof UPLOAD_DOC_OPTIONS)[number]["id"];
