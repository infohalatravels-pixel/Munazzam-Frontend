"use client";

import type { EmployeeDetail } from "@/lib/employees/api";
import {
  formatSalary,
  getEmploymentStatusClass,
} from "@/lib/employees/viewHelpers";

type EmployeeProfessionalCardProps = {
  employee: EmployeeDetail;
};

export function EmployeeProfessionalCard({ employee }: EmployeeProfessionalCardProps) {
  return (
    <div className="relative rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm lg:col-span-4">
      <button
        type="button"
        disabled
        className="absolute top-4 right-4 text-on-surface-variant opacity-50"
        title="Edit coming soon"
      >
        <span className="material-symbols-outlined">edit_square</span>
      </button>

      <h3 className="mb-lg text-label-sm font-bold tracking-wider text-on-surface-variant uppercase">
        Professional Details
      </h3>

      <div className="space-y-lg">
        <div className="flex items-start justify-between">
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Current Status
            </label>
            <span
              className={[
                "rounded-full px-3 py-1 text-label-sm font-bold",
                getEmploymentStatusClass(employee.employmentStatus),
              ].join(" ")}
            >
              {employee.employmentStatus}
            </span>
          </div>
          <div className="text-right">
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Join Date
            </label>
            <p className="text-body-sm font-medium">{employee.joinDate}</p>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface p-md">
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Monthly Salary
          </label>
          <p className="text-headline-sm font-bold text-primary">
            {formatSalary(employee.salary)}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">QAR</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Designation
            </label>
            <p className="text-body-sm font-medium">
              {employee.designation || employee.position}
            </p>
          </div>
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Department
            </label>
            <p className="text-body-sm font-medium">{employee.department}</p>
          </div>
        </div>

        {employee.lastSalaryTransferDate ? (
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Last Salary Transfer
            </label>
            <p className="text-body-sm font-medium">{employee.lastSalaryTransferDate}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
