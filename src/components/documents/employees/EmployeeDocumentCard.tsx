"use client";

import { useRouter } from "next/navigation";
import type { EmployeeRecord } from "@/lib/employees/api";
import { getEmployeeDocumentSummary } from "@/lib/documents/helpers";

type EmployeeDocumentCardProps = {
  employee: EmployeeRecord;
};

export function EmployeeDocumentCard({ employee }: EmployeeDocumentCardProps) {
  const router = useRouter();
  const summary = getEmployeeDocumentSummary(employee);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface card-shadow transition-all hover:-translate-y-0.5">
      <div className="flex-1 p-lg">
        <div className="mb-lg flex items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low text-primary">
            <span className="material-symbols-outlined text-[32px]">person</span>
          </div>
          <span
            className={`rounded-full px-sm py-[2px] text-[10px] font-bold uppercase tracking-wider ${summary.status.className}`}
          >
            {summary.status.label}
          </span>
        </div>

        <h3 className="text-headline-sm text-on-surface">{employee.nameAsPassport}</h3>
        <p className="mb-xs text-[13px] font-semibold text-primary">{employee.employeeCode}</p>
        <p className="mb-lg text-body-sm text-on-surface-variant">
          {employee.designation || employee.position || "—"}
        </p>

        <div className="space-y-sm text-body-sm">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Valid Documents</span>
            <span className="font-semibold text-on-surface">{summary.validCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Expiring Soon</span>
            <span
              className={`font-semibold ${summary.expiringCount > 0 ? "text-error" : "text-on-surface"}`}
            >
              {summary.expiringCount}
            </span>
          </div>
          <div className="mt-sm h-2 overflow-hidden rounded-full bg-surface-container-low">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${summary.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant bg-surface-container-low p-md">
        <button
          type="button"
          onClick={() =>
            router.push(`/dashboard/documents/employees/${employee.id}`)
          }
          className="flex w-full items-center justify-center gap-sm rounded-xl border border-outline-variant bg-surface py-sm text-label-md transition-all hover:border-primary hover:bg-primary hover:text-on-primary"
        >
          View Records
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </button>
      </div>
    </article>
  );
}
