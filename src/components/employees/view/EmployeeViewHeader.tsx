"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { EmployeeDetail } from "@/lib/employees/api";

type EmployeeViewHeaderProps = {
  employee: EmployeeDetail;
  onViewExpenses: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

export function EmployeeViewHeader({
  employee,
  onViewExpenses,
  onDelete,
  isDeleting,
}: EmployeeViewHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between gap-md md:flex-row md:items-center">
      <div className="flex items-start gap-md">
        <button
          type="button"
          onClick={() => router.push("/dashboard/employees")}
          className="mt-1 rounded-xl border border-outline-variant p-2 transition-all hover:bg-surface-container"
          aria-label="Back to employees"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <div>
          <div className="flex flex-wrap items-center gap-sm">
            <h1 className="text-headline-lg text-on-surface">{employee.name}</h1>
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-sm text-on-primary-fixed-variant">
              {employee.employeeCode}
            </span>
          </div>
          <p className="mt-xs text-body-md text-on-surface-variant">
            {employee.designation || employee.position} • {employee.department}
          </p>
          <div className="mt-sm flex items-center text-label-md text-on-surface-variant md:hidden">
            <Link href="/dashboard/employees" className="transition-colors hover:text-primary">
              Employees
            </Link>
            <span className="material-symbols-outlined mx-1 text-sm">chevron_right</span>
            <span className="font-bold text-primary">{employee.name}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-sm">
        <button
          type="button"
          onClick={onViewExpenses}
          className="flex items-center gap-xs rounded-lg border border-primary/20 bg-primary/5 px-md py-2 text-label-md text-primary transition-colors hover:bg-primary/10"
        >
          <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          View Expenses
        </button>
        <button
          type="button"
          disabled
          className="flex items-center gap-xs rounded-lg border border-outline-variant px-md py-2 text-label-md opacity-50"
          title="Edit coming soon"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-xs rounded-lg bg-error-container px-md py-2 text-label-md text-on-error-container transition-colors hover:bg-red-100 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
          {isDeleting ? "Deleting..." : "Delete Employee"}
        </button>
      </div>
    </div>
  );
}
