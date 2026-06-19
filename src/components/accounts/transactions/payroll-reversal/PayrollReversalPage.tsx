"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchPayrollReversals } from "@/lib/accounts/transactionsApi";
import type { PayrollReversalRecord } from "@/lib/accounts/transactionsApi";
import { CreatePayrollReversalModal } from "./CreatePayrollReversalModal";
import { PayrollReversalsTable } from "./PayrollReversalsTable";
import { PayrollReversalPageHeader } from "./PayrollReversalPageHeader";

const PAGE_SIZE = 5;

export function PayrollReversalPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [reversals, setReversals] = useState<PayrollReversalRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadReversals = useCallback(async (nextPage: number, nextSearch: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchPayrollReversals({
        page: nextPage,
        limit: PAGE_SIZE,
        search: nextSearch,
      });

      setReversals(result.reversals);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      setReversals([]);
      setTotal(0);
      setTotalPages(1);
      setError(err instanceof Error ? err.message : "Failed to load payroll reversals.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReversals(page, search);
  }, [loadReversals, page, search]);

  const handleReversalCreated = useCallback(
    (result: { reversal: PayrollReversalRecord }) => {
      const { reversal } = result;
      setSuccessMessage(
        `Payroll reversal ${reversal.reference} completed: ${reversal.netAmount.toLocaleString()} ${reversal.currency} net amount (${reversal.amount.toLocaleString()} reversal - ${reversal.deduction.toLocaleString()} deduction) added to ${reversal.destinationAccountName} for ${reversal.employeeName} (${reversal.employeeCode}).`
      );
      if (page === 1) {
        loadReversals(1, search);
      } else {
        setPage(1);
      }
    },
    [loadReversals, page, search]
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

        <PayrollReversalPageHeader />

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
            <span className="material-symbols-outlined text-[20px]">history</span>
            Process Reversal
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

        <PayrollReversalsTable
          reversals={reversals}
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

      <CreatePayrollReversalModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleReversalCreated}
      />
    </>
  );
}