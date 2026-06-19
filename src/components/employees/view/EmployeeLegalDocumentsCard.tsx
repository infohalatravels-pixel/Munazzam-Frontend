"use client";

import type { EmployeeDocument } from "@/lib/employees/documents";
import type { UploadEmployeeDocKey } from "@/lib/employees/documents";
import { LegalDocumentRow } from "./LegalDocumentRow";

type EmployeeLegalDocumentsCardProps = {
  documents: EmployeeDocument[];
  onView: (document: EmployeeDocument) => void;
  onDownload: (document: EmployeeDocument) => void;
  onUpload: (docKey: UploadEmployeeDocKey) => void;
};

export function EmployeeLegalDocumentsCard({
  documents,
  onView,
  onDownload,
  onUpload,
}: EmployeeLegalDocumentsCardProps) {
  const legalDocs = documents.filter((doc) => doc.id === "passport" || doc.id === "qid");

  return (
    <div className="relative rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm lg:col-span-6">
      <button
        type="button"
        onClick={() => onUpload("passport")}
        className="absolute top-4 right-4 text-on-surface-variant transition-colors hover:text-primary"
        aria-label="Upload legal document"
      >
        <span className="material-symbols-outlined">edit_square</span>
      </button>

      <h3 className="mb-lg text-label-sm font-bold tracking-wider text-on-surface-variant uppercase">
        Legal Documents
      </h3>

      <div className="space-y-sm">
        {legalDocs.map((document) => (
          <LegalDocumentRow
            key={document.id}
            document={document}
            onView={onView}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
}
