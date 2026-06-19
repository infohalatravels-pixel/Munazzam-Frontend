"use client";

import type { EmployeeDocument } from "@/lib/employees/documents";

type LegalDocumentRowProps = {
  document: EmployeeDocument;
  onView: (document: EmployeeDocument) => void;
  onDownload: (document: EmployeeDocument) => void;
};

export function LegalDocumentRow({
  document,
  onView,
  onDownload,
}: LegalDocumentRowProps) {
  return (
    <div className="group flex items-center gap-md rounded-xl border border-transparent p-md transition-colors hover:border-outline-variant hover:bg-surface">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
        <span className="material-symbols-outlined">{document.icon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-sm">
          <p className="text-body-md font-bold">{document.title}</p>
          <span className="text-body-sm font-medium">
            {document.referenceNumber || "—"}
          </span>
        </div>
        <div className="mt-xs flex items-center justify-between gap-sm">
          <p className="text-label-sm text-on-surface-variant">
            {document.expiryDate
              ? `Expires: ${document.expiryDate}`
              : "No expiry on record"}
          </p>
          {document.expiryDate ? (
            <span
              className={[
                "flex items-center gap-1 text-label-sm",
                document.statusClassName,
              ].join(" ")}
            >
              <span className={`h-2 w-2 rounded-full ${document.dotClassName}`} />
              {document.statusLabel}
            </span>
          ) : null}
        </div>
        {document.hasFile ? (
          <p className="mt-xs truncate text-label-sm text-on-surface-variant">
            File: {document.fileName}
          </p>
        ) : (
          <p className="mt-xs text-label-sm text-on-surface-variant">
            No file uploaded yet
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onView(document)}
          disabled={!document.hasFile}
          className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`View ${document.title}`}
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
        <button
          type="button"
          onClick={() => onDownload(document)}
          disabled={!document.hasFile}
          className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Download ${document.title}`}
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
        </button>
      </div>
    </div>
  );
}
