"use client";

import type { EmployeeDetail } from "@/lib/employees/api";
import type { EmployeeDocument, UploadEmployeeDocKey } from "@/lib/employees/documents";

type EmployeeVisaCardProps = {
  employee: EmployeeDetail;
  visaDocument: EmployeeDocument | undefined;
  onUpload: (docKey: UploadEmployeeDocKey) => void;
  onView: (document: EmployeeDocument) => void;
  onDownload: (document: EmployeeDocument) => void;
};

export function EmployeeVisaCard({
  employee,
  visaDocument,
  onUpload,
  onView,
  onDownload,
}: EmployeeVisaCardProps) {
  const isExpiringSoon =
    visaDocument?.status === "EXPIRING" || visaDocument?.status === "EXPIRED";

  return (
    <div className="relative rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm lg:col-span-6">
      <button
        type="button"
        onClick={() => onUpload("visa")}
        className="absolute top-4 right-4 text-on-surface-variant transition-colors hover:text-primary"
        aria-label="Upload visa document"
      >
        <span className="material-symbols-outlined">edit_square</span>
      </button>

      <h3 className="mb-lg text-label-sm font-bold tracking-wider text-on-surface-variant uppercase">
        Visa Information
      </h3>

      <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
        <div className="flex items-center gap-md rounded-xl border border-primary/10 bg-primary/5 p-md sm:col-span-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-label-sm font-bold tracking-tight text-primary uppercase">
              Active {employee.visaType} Visa
            </p>
            <p className="text-body-md font-bold">{employee.visaNumber}</p>
          </div>
          {visaDocument?.hasFile ? (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onView(visaDocument)}
                className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                aria-label="View visa copy"
              >
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </button>
              <button
                type="button"
                onClick={() => onDownload(visaDocument)}
                className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                aria-label="Download visa copy"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Visa Type
          </label>
          <p className="text-body-md font-medium">{employee.visaType}</p>
        </div>
        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Profession on Visa
          </label>
          <p className="text-body-md font-medium">{employee.professionOnVisa}</p>
        </div>
        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Issue Date
          </label>
          <p className="text-body-sm font-medium">{employee.visaIssueDate}</p>
        </div>
        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Expiry Date
          </label>
          <p
            className={[
              "text-body-sm font-medium",
              isExpiringSoon ? "text-secondary" : "",
            ].join(" ")}
          >
            {employee.visaExpiryDate}
          </p>
        </div>

        {employee.sponsorFileNo ? (
          <div className="sm:col-span-2">
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Sponsor File No.
            </label>
            <p className="text-body-sm font-medium">{employee.sponsorFileNo}</p>
          </div>
        ) : null}

        {employee.workPermitNo ? (
          <div className="sm:col-span-2">
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Work Permit No.
            </label>
            <p className="text-body-sm font-medium">{employee.workPermitNo}</p>
          </div>
        ) : null}

        {visaDocument ? (
          <div className="sm:col-span-2">
            <p className="text-label-sm text-on-surface-variant">
              {visaDocument.hasFile
                ? `Visa copy: ${visaDocument.fileName}`
                : "No visa copy uploaded yet. Use the edit button to upload."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
