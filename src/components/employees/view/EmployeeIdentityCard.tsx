"use client";

import type { EmployeeDetail } from "@/lib/employees/api";
import type { UploadEmployeeDocKey } from "@/lib/employees/documents";
import { getEmployeeTypeClass } from "@/lib/employees/viewHelpers";
import { EmployeePhoto } from "./EmployeePhoto";

type EmployeeIdentityCardProps = {
  employee: EmployeeDetail;
  onUpload: (docKey: UploadEmployeeDocKey) => void;
};

export function EmployeeIdentityCard({ employee, onUpload }: EmployeeIdentityCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm md:flex-row lg:col-span-8">
      <div className="relative h-64 w-full bg-surface-container md:h-auto md:w-64">
        <EmployeePhoto
          employeeId={employee.id}
          name={employee.name}
          hasPhoto={employee.hasPhoto}
        />
        <div className="absolute top-4 right-4">
          <span
            className={[
              "rounded-full px-3 py-1 text-label-sm font-bold shadow-md",
              getEmployeeTypeClass(),
            ].join(" ")}
          >
            {employee.employeeType}
          </span>
        </div>
      </div>

      <div className="relative flex-1 p-lg">
        <button
          type="button"
          onClick={() => onUpload("photo")}
          className="absolute top-4 right-4 text-on-surface-variant transition-colors hover:text-primary"
          aria-label="Upload employee photo"
        >
          <span className="material-symbols-outlined">edit_square</span>
        </button>

        <h3 className="mb-md text-label-sm font-bold tracking-wider text-on-surface-variant uppercase">
          Employee Identity
        </h3>

        <div className="grid grid-cols-1 gap-y-lg gap-x-xl sm:grid-cols-2">
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Name as Passport
            </label>
            <p className="text-body-md font-medium">{employee.nameAsPassport}</p>
          </div>
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Nationality
            </label>
            <p className="text-body-md font-medium">{employee.nationality}</p>
          </div>
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Phone
            </label>
            <p className="text-body-md font-medium">{employee.phoneNo}</p>
          </div>
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Employee ID
            </label>
            <p className="text-body-md font-medium">{employee.employeeCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
