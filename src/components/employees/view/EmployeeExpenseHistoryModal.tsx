"use client";

import { useCallback, useEffect, useState } from "react";
import { AppModal } from "@/components/ui/AppModal";
import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { formatDepositDate } from "@/lib/accounts/deposits";
import { formatTransactionAmount } from "@/lib/accounts/formatters";
import {
  fetchEmployeeExpenses,
  type EmployeeExpenseRecord,
} from "@/lib/employees/expenses";

const PAGE_SIZE = 10;

const STATUS_CLASS: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Failed: "bg-error-container text-on-error-container border border-error/20",
  Cancelled: "bg-surface-container text-on-surface-variant border border-outline-variant",
  Reversed: "bg-surface-container text-on-surface-variant border border-outline-variant",
};

type EmployeeExpenseHistoryModalProps = {
  open: boolean;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  onClose: () => void;
};

export function EmployeeExpenseHistoryModal({
  open,
  employeeId,
  employeeName,
  employeeCode,
  onClose,
}: EmployeeExpenseHistoryModalProps) {
  const [expenses, setExpenses] = useState<EmployeeExpenseRecord[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    if (!open || !employeeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEmployeeExpenses(employeeId, {
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
      });

      setExpenses(data.expenses);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setFrom(data.from);
      setTo(data.to);
    } catch (err) {
      setExpenses([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load expense history.");
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, open, page, search]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setPage(1);
      setError(null);
      return;
    }

    loadExpenses();
  }, [loadExpenses, open]);

  return (
    <AppModal
      open={open}
      title="Expense History"
      subtitle={`Recorded expenses for ${employeeName}`}
      badge={employeeCode}
      onClose={onClose}
      maxWidthClassName="max-w-5xl"
    >
      <div className="space-y-md p-xl">
        {error ? (
          <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <div className="relative">
          <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search reference, account, description..."
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pr-md pl-10 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-outline-variant">
          <div className="custom-scrollbar overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className="px-md py-3 text-label-sm uppercase text-on-surface-variant">Date</th>
                  <th className="px-md py-3 text-label-sm uppercase text-on-surface-variant">Reference</th>
                  <th className="px-md py-3 text-label-sm uppercase text-on-surface-variant">Category</th>
                  <th className="px-md py-3 text-label-sm uppercase text-on-surface-variant">Description</th>
                  <th className="px-md py-3 text-label-sm uppercase text-on-surface-variant">Source Account</th>
                  <th className="px-md py-3 text-right text-label-sm uppercase text-on-surface-variant">Amount</th>
                  <th className="px-md py-3 text-label-sm uppercase text-on-surface-variant">Status</th>
                  <th className="px-md py-3 text-label-sm uppercase text-on-surface-variant">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-md py-xl text-center text-body-md text-on-surface-variant">
                      Loading expense history...
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-md py-xl text-center text-body-md text-on-surface-variant">
                      No expenses recorded for this employee yet.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-surface-container-low">
                      <td className="px-md py-3 text-body-sm text-on-surface-variant">
                        {formatDepositDate(expense.createdAt)}
                      </td>
                      <td className="px-md py-3 font-mono text-body-sm text-primary">
                        {expense.reference}
                      </td>
                      <td className="px-md py-3">
                        <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 uppercase">
                          {expense.category}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate px-md py-3 text-body-sm" title={expense.description || "—"}>
                        {expense.description || "—"}
                      </td>
                      <td className="px-md py-3 text-body-sm">{expense.sourceAccountName}</td>
                      <td className="px-md py-3 text-right font-semibold text-error">
                        -{formatTransactionAmount(expense.amount, expense.currency)}
                      </td>
                      <td className="px-md py-3">
                        <span
                          className={[
                            "rounded-full px-2.5 py-1 text-label-sm font-medium",
                            STATUS_CLASS[expense.status] ?? STATUS_CLASS.Completed,
                          ].join(" ")}
                        >
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-md py-3 text-body-sm text-on-surface-variant">
                        {expense.createdBy}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <EmployeePagination
            page={page}
            totalPages={totalPages}
            from={from}
            to={to}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </div>
    </AppModal>
  );
}
