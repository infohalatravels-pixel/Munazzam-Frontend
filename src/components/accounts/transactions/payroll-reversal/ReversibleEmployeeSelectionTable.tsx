"use client";

import { formatTransactionAmount } from "@/lib/accounts/formatters";
import { formatDepositDate } from "@/lib/accounts/deposits";
import type { ReversibleEmployee } from "@/lib/accounts/transactionsApi";

type ReversibleEmployeeSelectionTableProps = {
  employees: ReversibleEmployee[];
  isLoading?: boolean;
  onSelectEmployee: (employee: ReversibleEmployee) => void;
};

export function ReversibleEmployeeSelectionTable({ 
  employees, 
  isLoading = false, 
  onSelectEmployee 
}: ReversibleEmployeeSelectionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white">
      <div className="border-b border-outline-variant bg-surface px-lg py-md">
        <h3 className="text-headline-sm text-on-surface">Select Employee for Payroll Reversal</h3>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Choose an employee with recent payroll history to process a reversal. Only employees with completed payroll transactions are shown.
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
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Available
                    </span>
                  </div>
                  <div className="mb-sm space-y-xs">
                    <p className="text-body-sm text-on-surface-variant">
                      Last Payroll: <span className="font-semibold text-on-surface">
                        {formatTransactionAmount(employee.lastPayrollAmount, "QAR")}
                      </span>
                      {employee.lastPayrollReference && (
                        <span className="ml-xs font-mono text-xs">({employee.lastPayrollReference})</span>
                      )}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Payroll Date: {formatDepositDate(employee.lastPayrollDate)}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Current Salary: {formatTransactionAmount(employee.salary, "QAR")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectEmployee(employee)}
                    className="w-full rounded-lg bg-primary px-md py-2 text-label-sm font-medium text-on-primary transition-all hover:bg-primary-container"
                  >
                    Select Employee
                  </button>
                </article>
              ))
            ) : (
              <p className="py-xl text-center text-body-md text-on-surface-variant">
                No employees with recent payroll found.
              </p>
            )}
          </div>

          {/* Desktop */}
          <div className="custom-scrollbar hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] border-collapse text-left">
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
                    Current Salary
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Last Payroll
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Payroll Date
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
                      <td className="px-lg py-4">
                        <div>
                          <p className="font-semibold text-on-surface">
                            {formatTransactionAmount(employee.lastPayrollAmount, "QAR")}
                          </p>
                          {employee.lastPayrollReference && (
                            <p className="font-mono text-xs text-on-surface-variant">
                              {employee.lastPayrollReference}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {formatDepositDate(employee.lastPayrollDate)}
                      </td>
                      <td className="px-lg py-4">
                        <button
                          type="button"
                          onClick={() => onSelectEmployee(employee)}
                          className="rounded-lg bg-primary px-md py-2 text-label-sm font-medium text-on-primary transition-all hover:bg-primary-container"
                        >
                          Select
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
                      No employees with recent payroll found.
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