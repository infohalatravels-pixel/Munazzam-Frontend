"use client";

import { formatTransactionAmount } from "@/lib/accounts/formatters";
import type { EligibleEmployee } from "@/lib/accounts/transactionsApi";

type EmployeeSelectionTableProps = {
  employees: EligibleEmployee[];
  isLoading?: boolean;
  onSelectEmployee: (employee: EligibleEmployee) => void;
};

function formatLastTransferDate(date: string | null, days: number | null) {
  if (!date || days === null) return "Never";
  
  const transferDate = new Date(date);
  if (Number.isNaN(transferDate.getTime())) return "Never";
  
  return `${transferDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} (${days} days ago)`;
}

export function EmployeeSelectionTable({ 
  employees, 
  isLoading = false, 
  onSelectEmployee 
}: EmployeeSelectionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white">
      <div className="border-b border-outline-variant bg-surface px-lg py-md">
        <h3 className="text-headline-sm text-on-surface">Select Employee for Payroll</h3>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Choose an eligible employee to process salary payment. Employees must wait 30 days between transfers.
        </p>
      </div>

      {isLoading ? (
        <p className="px-lg py-xl text-center text-body-md text-on-surface-variant">
          Loading employees...
        </p>
      ) : (
        <>
          {/* Mobile */}
          <div className="space-y-sm p-md md:hidden">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <article
                  key={employee.id}
                  className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-md"
                >
                  <div className="mb-sm flex items-start justify-between gap-sm">
                    <div>
                      <p className="text-label-md text-on-surface">{employee.nameAsPassport}</p>
                      <p className="text-label-sm text-on-surface-variant">
                        {employee.employeeCode} • {employee.designation || "No designation"}
                      </p>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        employee.isEligible
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100",
                      ].join(" ")}
                    >
                      {employee.isEligible ? "Eligible" : `${employee.daysRemaining} days left`}
                    </span>
                  </div>
                  <div className="mb-sm">
                    <p className="text-body-sm text-on-surface-variant">
                      Salary: <span className="font-semibold text-on-surface">
                        {formatTransactionAmount(employee.salary, "QAR")}
                      </span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Last transfer: {formatLastTransferDate(employee.lastSalaryTransferDate, employee.daysSinceLastTransfer)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectEmployee(employee)}
                    disabled={!employee.isEligible}
                    className={[
                      "w-full rounded-lg px-md py-2 text-label-sm font-medium transition-all",
                      employee.isEligible
                        ? "bg-primary text-on-primary hover:bg-primary-container"
                        : "bg-surface-container text-on-surface-variant cursor-not-allowed opacity-60",
                    ].join(" ")}
                  >
                    {employee.isEligible ? "Select Employee" : "Not Eligible"}
                  </button>
                </article>
              ))
            ) : (
              <p className="py-xl text-center text-body-md text-on-surface-variant">
                No employees found.
              </p>
            )}
          </div>

          {/* Desktop */}
          <div className="custom-scrollbar hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface">
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Employee
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Code
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Designation
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Salary
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Last Transfer
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Status
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="px-lg py-4 text-label-md text-on-surface">
                        {employee.nameAsPassport}
                      </td>
                      <td className="px-lg py-4 font-mono text-body-sm text-on-surface-variant">
                        {employee.employeeCode}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {employee.designation || "—"}
                      </td>
                      <td className="px-lg py-4 font-semibold text-on-surface">
                        {formatTransactionAmount(employee.salary, "QAR")}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {formatLastTransferDate(employee.lastSalaryTransferDate, employee.daysSinceLastTransfer)}
                      </td>
                      <td className="px-lg py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-label-sm font-medium",
                            employee.isEligible
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100",
                          ].join(" ")}
                        >
                          {employee.isEligible ? "Eligible" : `${employee.daysRemaining} days left`}
                        </span>
                      </td>
                      <td className="px-lg py-4">
                        <button
                          type="button"
                          onClick={() => onSelectEmployee(employee)}
                          disabled={!employee.isEligible}
                          className={[
                            "rounded-lg px-md py-2 text-label-sm font-medium transition-all",
                            employee.isEligible
                              ? "bg-primary text-on-primary hover:bg-primary-container"
                              : "bg-surface-container text-on-surface-variant cursor-not-allowed opacity-60",
                          ].join(" ")}
                        >
                          {employee.isEligible ? "Select" : "Not Eligible"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-lg py-xl text-center text-body-md text-on-surface-variant"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}