"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  exportCompanyTransactionsCsv,
  fetchCompanyTransactions,
  formatCompanyTransactionDate,
  type CompanyTransaction,
} from "@/lib/accounts/companyTransactionsApi";
import {
  formatTransactionAmount,
  getAmountClassName,
  TRANSACTION_STATUS_CLASS,
} from "@/lib/accounts/formatters";

const PAGE_SIZE = 5;

const STATUS_FILTERS = ["All", "Completed", "Pending", "Failed", "Cancelled", "Reversed"] as const;

type TransactionsSectionProps = {
  variant?: "recent";
};

export function TransactionsSection({ variant = "recent" }: TransactionsSectionProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<CompanyTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCompanyTransactions({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        today: variant === "recent",
      });

      setTransactions(data.transactions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setFrom(data.from);
      setTo(data.to);
    } catch (err) {
      setTransactions([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, variant]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filtered = useMemo(() => {
    if (statusFilter === "All") return transactions;
    return transactions.filter((tx) => tx.status === statusFilter);
  }, [transactions, statusFilter]);

  async function handleExport() {
    setIsExporting(true);
    try {
      const data = await fetchCompanyTransactions({
        today: true,
        exportAll: true,
        search: search || undefined,
      });
      const today = new Date().toISOString().slice(0, 10);
      exportCompanyTransactionsCsv(data.transactions, `today-transactions-${today}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant bg-white card-shadow">
      <div className="flex flex-col gap-md border-b border-outline-variant p-md sm:flex-row sm:items-center sm:justify-between sm:px-lg">
        <div>
          <h2 className="text-headline-sm text-on-surface">Today&apos;s Transactions</h2>
          <p className="text-body-sm text-on-surface-variant">Activity recorded today across all accounts</p>
        </div>

        <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:w-56">
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
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low py-2 pr-md pl-10 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="flex gap-xs">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={[
                "flex min-h-10 min-w-10 items-center justify-center rounded-lg border transition-colors",
                showFilters
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low",
              ].join(" ")}
              aria-label="Toggle filters"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting || isLoading}
              className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-outline-variant/30 px-3 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50"
              aria-label="Export today's transactions"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/accounts/transactions/all")}
              className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 text-label-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              View All
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="border-b border-error/20 bg-error-container px-lg py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      {showFilters ? (
        <div className="flex flex-wrap gap-sm border-b border-outline-variant bg-surface-container-low px-md py-sm sm:px-lg">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={[
                "rounded-full px-3 py-1.5 text-label-sm transition-colors active:scale-95",
                statusFilter === status
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant bg-white text-on-surface-variant",
              ].join(" ")}
            >
              {status}
            </button>
          ))}
        </div>
      ) : null}

      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-lg py-3 text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                Date
              </th>
              <th className="px-lg py-3 text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                Description
              </th>
              <th className="px-lg py-3 text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                Account
              </th>
              <th className="px-lg py-3 text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                Category
              </th>
              <th className="px-lg py-3 text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                Amount
              </th>
              <th className="px-lg py-3 text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                  Loading today&apos;s transactions...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                  No transactions recorded today.
                </td>
              </tr>
            ) : (
              filtered.map((transaction) => (
                <tr key={transaction.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                    {formatCompanyTransactionDate(transaction.createdAt)}
                  </td>
                  <td className="px-lg py-4 text-label-md text-on-surface">
                    {transaction.description}
                  </td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                    {transaction.accountName}
                  </td>
                  <td className="px-lg py-4">
                    <span className="rounded-full bg-surface-container px-2.5 py-1 text-label-sm text-on-surface-variant">
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={[
                      "px-lg py-4 font-semibold",
                      getAmountClassName(transaction.signedAmount, transaction.type),
                    ].join(" ")}
                  >
                    {formatTransactionAmount(transaction.signedAmount, transaction.currency)}
                  </td>
                  <td className="px-lg py-4">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-label-sm font-medium",
                        TRANSACTION_STATUS_CLASS[transaction.status] ??
                          "bg-surface-container text-on-surface-variant",
                      ].join(" ")}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-md border-t border-outline-variant bg-surface-container-low px-md py-4 sm:flex-row sm:items-center sm:justify-between sm:px-lg">
        <p className="text-center text-body-sm text-on-surface-variant sm:text-left">
          Showing {from} to {to} of {total} transactions today
        </p>
        <div className="flex items-center justify-center gap-xs">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex min-h-9 min-w-9 items-center justify-center rounded transition-colors hover:bg-white disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="px-2 text-label-sm text-on-surface-variant">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex min-h-9 min-w-9 items-center justify-center rounded transition-colors hover:bg-white disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="border-t border-outline-variant px-lg py-3 text-center">
        <Link
          href="/dashboard/accounts/transactions/all"
          className="text-label-md font-medium text-primary hover:underline"
        >
          View all transactions with date range and ledger export
        </Link>
      </div>
    </section>
  );
}
