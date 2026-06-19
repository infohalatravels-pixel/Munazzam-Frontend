import { getAccessToken } from "@/lib/auth/session";
import { apiClient } from "@/lib/auth/apiClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type EmployeeDocument = {
  id: string;
  documentId: string | null;
  title: string;
  icon: string;
  documentType: string;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  updatedAt: string | null;
  referenceNumber: string | null;
  expiryDate: string | null;
  hasFile: boolean;
  status: string;
  statusLabel: string;
  statusClassName: string;
  dotClassName: string;
};

export type UploadEmployeeDocKey = "passport" | "qid" | "visa" | "photo";

export const EMPLOYEE_UPLOAD_DOC_OPTIONS = [
  {
    id: "passport" as const,
    label: "Passport Copy",
    description: "Passport scan or photo",
    icon: "menu_book",
  },
  {
    id: "qid" as const,
    label: "QID Copy",
    description: "Qatar ID document",
    icon: "badge",
  },
  {
    id: "visa" as const,
    label: "Visa Copy",
    description: "Work or residence visa",
    icon: "verified_user",
  },
  {
    id: "photo" as const,
    label: "Employee Photo",
    description: "Profile portrait photo",
    icon: "photo_camera",
  },
];

export async function fetchEmployeeDocuments(
  employeeId: string
): Promise<EmployeeDocument[]> {
  const result = await apiClient<{ documents: EmployeeDocument[] }>(
    `/api/employees/${employeeId}/documents`,
    { method: "GET" }
  );
  return result.documents;
}

export async function uploadEmployeeDocument(
  employeeId: string,
  docKey: UploadEmployeeDocKey,
  file: File
): Promise<EmployeeDocument> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/api/employees/${employeeId}/documents/${docKey}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Upload failed.");
  }

  return result.data.document as EmployeeDocument;
}

export async function fetchEmployeeDocumentBlob(
  employeeId: string,
  documentId: string,
  mode: "view" | "download"
): Promise<Blob> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  const response = await fetch(
    `${API_URL}/api/employees/${employeeId}/documents/${documentId}/${mode}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load document.");
  }

  return response.blob();
}

export async function downloadEmployeeDocument(
  employeeId: string,
  document: EmployeeDocument
): Promise<void> {
  if (!document.documentId) return;

  const blob = await fetchEmployeeDocumentBlob(
    employeeId,
    document.documentId,
    "download"
  );
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = document.fileName || `${document.title}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
