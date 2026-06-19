"use client";

import { useEffect, useState } from "react";
import { DocumentDropzone } from "@/components/onboarding/DocumentDropzone";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import {
  EMPLOYEE_UPLOAD_DOC_OPTIONS,
  uploadEmployeeDocument,
  type EmployeeDocument,
  type UploadEmployeeDocKey,
} from "@/lib/employees/documents";

type EmployeeUploadDocumentModalProps = {
  open: boolean;
  employeeId: string;
  initialDocKey?: UploadEmployeeDocKey | null;
  onClose: () => void;
  onUploaded: (document: EmployeeDocument) => void;
};

export function EmployeeUploadDocumentModal({
  open,
  employeeId,
  initialDocKey = null,
  onClose,
  onUploaded,
}: EmployeeUploadDocumentModalProps) {
  const [selectedType, setSelectedType] = useState<UploadEmployeeDocKey | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedType(initialDocKey);
      setFiles([]);
      setError(null);
    }
  }, [open, initialDocKey]);

  async function handleUpload() {
    if (!selectedType || !files[0]) {
      setError("Select a document type and choose a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const document = await uploadEmployeeDocument(employeeId, selectedType, files[0]);
      onUploaded(document);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <AppModal
      open={open}
      title="Upload Employee Document"
      subtitle="Choose the document type, then upload a file. This replaces the previous file for that type."
      badge="Employee Profile"
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
      footer={
        <ModalFooterActions
          onCancel={onClose}
          onSave={handleUpload}
          saveLabel="Upload & Replace"
          savingLabel="Uploading..."
          isSaving={isUploading}
          disabled={!selectedType || files.length === 0}
          error={error}
        />
      }
    >
      <div className="w-full min-w-0 space-y-lg">
        <div className="grid w-full min-w-0 grid-cols-1 gap-sm sm:grid-cols-2">
          {EMPLOYEE_UPLOAD_DOC_OPTIONS.map((option) => {
            const isSelected = selectedType === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedType(option.id);
                  setFiles([]);
                  setError(null);
                }}
                className={[
                  "min-w-0 w-full rounded-xl border p-md text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-outline-variant bg-surface hover:border-primary/40",
                ].join(" ")}
              >
                <span className="material-symbols-outlined mb-sm block text-primary">
                  {option.icon}
                </span>
                <p className="text-label-md font-bold break-words text-on-surface">
                  {option.label}
                </p>
                <p className="mt-xs text-label-sm break-words text-on-surface-variant">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {selectedType ? (
          <div className="w-full min-w-0">
            <DocumentDropzone
              label={`Upload ${EMPLOYEE_UPLOAD_DOC_OPTIONS.find((o) => o.id === selectedType)?.label}`}
              hint="Uploading will replace the previous file for this document type"
              files={files}
              onFilesChange={(nextFiles) => setFiles(nextFiles.slice(-1))}
            />
          </div>
        ) : (
          <p className="text-body-sm text-on-surface-variant">
            Select a document type above to continue.
          </p>
        )}
      </div>
    </AppModal>
  );
}
