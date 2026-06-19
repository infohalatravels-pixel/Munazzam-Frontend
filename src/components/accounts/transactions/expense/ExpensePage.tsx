"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExpenseRecord,
  CreateExpensePayload,
  fetchExpenses,
  createExpense,
} from "@/lib/accounts/transactionsApi";
import { ExpensePageHeader } from "./ExpensePageHeader";
import { ExpensesTable } from "./ExpensesTable";
import { CreateExpenseModal } from "./CreateExpenseModal";

const PAGE_SIZE = 5;

export function ExpensePage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadExpenses = useCallback(async (nextPage: number, nextSearch: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchExpenses({
        page: nextPage,
        limit: PAGE_SIZE,
        search: nextSearch,
      });

      setExpenses(result.expenses);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      setExpenses([]);
      setTotal(0);
      setTotalPages(1);
      setError(err instanceof Error ? err.message : "Failed to load expenses.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses(page, search);
  }, [loadExpenses, page, search]);

  const handleExpenseCreated = useCallback(
    (result: { expense: ExpenseRecord }) => {
      const { expense } = result;
      setSuccessMessage(
        `Expense of ${expense.amount.toLocaleString()} ${expense.currency} recorded from ${expense.sourceAccountName}. New balance: ${expense.closingBalance.toLocaleString()} ${expense.currency}.`
      );
      if (page === 1) {
        loadExpenses(1, search);
      } else {
        setPage(1);
      }
    },
    [loadExpenses, page, search]
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <Link
          href="/dashboard/accounts/transactions"
          className="mb-md inline-flex items-center gap-xs text-label-md text-primary md:hidden"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Transactions
        </Link>

        <ExpensePageHeader />

        {successMessage ? (
          <div className="mb-lg rounded-lg border border-emerald-200 bg-emerald-50 px-md py-sm text-body-sm text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        {error ? (
          <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <div className="mb-lg flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setSuccessMessage(null);
              setShowModal(true);
            }}
            className="flex min-h-11 w-full items-center justify-center gap-xs rounded-lg bg-primary px-lg py-2.5 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98] sm:w-auto"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Record Expense
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard/accounts/transactions")}
            className="hidden min-h-11 items-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container sm:inline-flex"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to Hub
          </button>
        </div>

        <ExpensesTable
          expenses={expenses}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          total={total}
          search={search}
          onPageChange={setPage}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      </div>

      <CreateExpenseModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleExpenseCreated}
      />
    </>
  );
}