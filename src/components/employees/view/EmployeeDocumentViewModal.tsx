"use client";

import { useEffect, useState } from "react";
import { AppModal } from "@/components/ui/AppModal";
import type { EmployeeDocument } from "@/lib/employees/documents";
import { fetchEmployeeDocumentBlob } from "@/lib/employees/documents";

type EmployeeDocumentViewModalProps = {
  open: boolean;
  employeeId: string;
  document: EmployeeDocument | null;
  onClose: () => void;
};

export function EmployeeDocumentViewModal({
  open,
  employeeId,
  document,
  onClose,
}: EmployeeDocumentViewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;

    async function loadPreview() {
      if (!open || !document?.documentId) {
        setPreviewUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const blob = await fetchEmployeeDocumentBlob(
          employeeId,
          document.documentId,
          "view"
        );
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to preview document.");
        setPreviewUrl(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreview();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, document?.documentId, employeeId]);

  const isImage = document?.mimeType?.startsWith("image/");
  const isPdf = document?.mimeType === "application/pdf";

  return (
    <AppModal
      open={open && Boolean(document)}
      title={document?.title || "Document"}
      subtitle={document?.fileName || undefined}
      badge="Employee Document"
      onClose={onClose}
      maxWidthClassName="max-w-5xl"
    >
      {!document?.documentId ? (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-xl text-center text-body-md text-on-surface-variant">
          No document uploaded yet. Upload a file to view it here.
        </div>
      ) : isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center text-body-md text-on-surface-variant">
          Loading document...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-error/20 bg-error-container p-md text-body-sm text-on-error-container">
          {error}
        </div>
      ) : previewUrl && isImage ? (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={document?.title}
            className="max-h-[70vh] w-full rounded-xl object-contain"
          />
        </div>
      ) : previewUrl && isPdf ? (
        <iframe
          src={previewUrl}
          title={document?.title}
          className="h-[70vh] w-full rounded-xl border border-outline-variant bg-white"
        />
      ) : previewUrl ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-xl text-center text-body-md text-on-surface-variant">
          Preview not available for this file type. Please download to view.
        </div>
      ) : null}
    </AppModal>
  );
}
