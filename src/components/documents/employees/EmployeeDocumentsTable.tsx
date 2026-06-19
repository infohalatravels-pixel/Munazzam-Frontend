"use client";

import type { EmployeeDocument } from "@/lib/employees/documents";
import { formatDocumentDate } from "@/lib/documents/helpers";

type EmployeeDocumentsTableProps = {
  title: string;
  icon: string;
  documents: EmployeeDocument[];
  onView: (document: EmployeeDocument) => void;
  onDownload: (document: EmployeeDocument) => void;
};

function getFileIcon(mimeType?: string | null) {
  if (mimeType?.includes("pdf")) return "picture_as_pdf";
  if (mimeType?.includes("image")) return "image";
  return "description";
}

function getFileIconClass(mimeType?: string | null) {
  if (mimeType?.includes("pdf")) return "bg-red-50 text-red-700";
  if (mimeType?.includes("image")) return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export function EmployeeDocumentsTable({
  title,
  icon,
  documents,
  onView,
  onDownload,
}: EmployeeDocumentsTableProps) {
  return (
    <section>
      <div className="mb-md flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h4 className="text-headline-sm text-on-surface">{title}</h4>
        <span className="ml-auto rounded-full bg-surface-container-low px-3 py-1 text-label-sm text-on-surface-variant">
          {documents.length} Document{documents.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm">
        <div className="hidden md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="px-gutter py-3 text-label-sm uppercase text-on-surface-variant">
                  Document Name
                </th>
                <th className="px-gutter py-3 text-label-sm uppercase text-on-surface-variant">
                  Type
                </th>
                <th className="px-gutter py-3 text-label-sm uppercase text-on-surface-variant">
                  Expiry Date
                </th>
                <th className="px-gutter py-3 text-label-sm uppercase text-on-surface-variant">
                  Status
                </th>
                <th className="px-gutter py-3 text-right text-label-sm uppercase text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr
                  key={document.id}
                  className="group border-b border-outline-variant/50 transition-colors last:border-b-0 hover:bg-surface-container-low"
                >
                  <td className="px-gutter py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded ${getFileIconClass(document.mimeType)}`}
                      >
                        <span className="material-symbols-outlined">
                          {getFileIcon(document.mimeType)}
                        </span>
                      </div>
                      <div>
                        <p className="text-label-md font-semibold">{document.title}</p>
                        <p className="text-[12px] text-on-surface-variant">
                          {document.referenceNumber
                            ? `Ref: ${document.referenceNumber}`
                            : document.fileName || "No file uploaded"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-gutter py-4 text-body-sm">{document.documentType}</td>
                  <td className="px-gutter py-4 text-body-sm">
                    {formatDocumentDate(document.expiryDate)}
                  </td>
                  <td className="px-gutter py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-label-sm ${document.statusClassName}`}
                    >
                      {document.statusLabel}
                    </span>
                  </td>
                  <td className="px-gutter py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-40 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => onView(document)}
                        disabled={!document.hasFile}
                        className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        title="View"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownload(document)}
                        disabled={!document.hasFile}
                        className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        title="Download"
                      >
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-outline-variant md:hidden">
          {documents.map((document) => (
            <div key={document.id} className="p-md">
              <div className="mb-sm flex items-start justify-between gap-sm">
                <div>
                  <p className="text-label-md font-semibold">{document.title}</p>
                  <p className="text-label-sm text-on-surface-variant">
                    {document.documentType}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-1 text-label-sm ${document.statusClassName}`}>
                  {document.statusLabel}
                </span>
              </div>
              <p className="mb-sm text-body-sm text-on-surface-variant">
                Expires: {formatDocumentDate(document.expiryDate)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onView(document)}
                  disabled={!document.hasFile}
                  className="flex-1 rounded-lg border border-outline-variant py-2 text-label-sm disabled:opacity-40"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => onDownload(document)}
                  disabled={!document.hasFile}
                  className="flex-1 rounded-lg border border-outline-variant py-2 text-label-sm disabled:opacity-40"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
