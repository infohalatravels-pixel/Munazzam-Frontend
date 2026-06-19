"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { getCurrentMonthDateRange, formatDisplayRange } from "@/lib/accounts/ledgerDates";
import { fetchAccountLedger } from "@/lib/accounts/ledgerApi";
import { exportLedgerPdf } from "@/lib/accounts/exportLedgerPdf";
import {
  formatTransactionAmount,
  getAmountClassName,
  TRANSACTION_STATUS_CLASS,
} from "@/lib/accounts/formatters";
import {
  exportCompanyTransactionsCsv,
  fetchCompanyTransactions,
  formatCompanyTransactionDate,
  type CompanyTransaction,
} from "@/lib/accounts/companyTransactionsApi";

const PAGE_SIZE = 15;

const CATEGORY_CLASS: Record<string, string> = {
  Finance: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Revenue: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Payroll: "bg-blue-50 text-blue-700 border border-blue-100",
  Transfer: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Operations: "bg-orange-50 text-orange-700 border border-orange-100",
  Compliance: "bg-blue-50 text-blue-700 border border-blue-100",
};

export function AllTransactionsPage() {
  const router = useRouter();
  const defaultRange = getCurrentMonthDateRange();

  const [transactions, setTransactions] = useState<CompanyTransaction[]>([]);
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [periodLabel, setPeriodLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadingLedgerId, setDownloadingLedgerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCompanyTransactions({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        fromDate,
        toDate,
      });

      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setFrom(data.from);
      setTo(data.to);
      setPeriodLabel(data.period.label);
    } catch (err) {
      setTransactions([]);
      setError(err instanceof Error ? err.message : "Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, fromDate, toDate]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  async function handleExportCsv() {
    setIsExporting(true);
    try {
      const data = await fetchCompanyTransactions({
        search: search || undefined,
        fromDate,
        toDate,
        exportAll: true,
      });
      exportCompanyTransactionsCsv(
        data.transactions,
        `transactions-${fromDate}-to-${toDate}.csv`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDownloadLedger(transaction: CompanyTransaction) {
    if (!transaction.accountId) return;

    setDownloadingLedgerId(transaction.id);
    setError(null);

    try {
      const data = await fetchAccountLedger(transaction.accountId, {
        fromDate,
        toDate,
        exportAll: true,
      });

      exportLedgerPdf({
        account: data.account,
        summary: data.summary,
        entries: data.entries,
        fromDate,
        toDate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download ledger.");
    } finally {
      setDownloadingLedgerId(null);
    }
  }

  function openLedger(transaction: CompanyTransaction) {
    if (!transaction.accountId) return;
    const params = new URLSearchParams({ fromDate, toDate });
    router.push(`/dashboard/accounts/${transaction.accountId}/ledger?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
      <Link
        href="/dashboard/accounts"
        className="mb-md inline-flex items-center gap-xs text-label-md text-primary md:hidden"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Accounts
      </Link>

      <div className="mb-xl flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-sm hidden md:block">
            <ol className="flex flex-wrap items-center gap-xs text-label-sm text-on-surface-variant">
              <li>
                <Link href="/dashboard/accounts" className="hover:text-primary">
                  Accounts
                </Link>
              </li>
              <li>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </li>
              <li className="font-semibold text-primary">All Transactions</li>
            </ol>
          </nav>
          <h1 className="text-headline-lg text-on-surface">All Transactions</h1>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Company-wide transaction history with ledger access per account.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={isExporting || isLoading}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container-low disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          {isExporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {error ? (
        <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="mb-lg flex flex-wrap items-end gap-md rounded-xl border border-outline-variant bg-white p-md shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-sm text-on-surface-variant">
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
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pr-4 pl-10 text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-label-sm text-on-surface-variant">From</span>
          <input
            type="date"
            value={fromDate}
            max={toDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-label-sm text-on-surface-variant">To</span>
          <input
            type="date"
            value={toDate}
            min={fromDate}
            onChange={(event) => {
              setToDate(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm"
          />
        </label>
      </div>

      <p className="mb-md text-body-sm text-on-surface-variant">
        Period: {periodLabel || formatDisplayRange(fromDate, toDate)}
      </p>

      <section className="overflow-hidden rounded-2xl border border-outline-variant bg-white card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-lg py-3 text-label-sm uppercase text-on-surface-variant">Date</th>
                <th className="px-lg py-3 text-label-sm uppercase text-on-surface-variant">Reference</th>
                <th className="px-lg py-3 text-label-sm uppercase text-on-surface-variant">Description</th>
                <th className="px-lg py-3 text-label-sm uppercase text-on-surface-variant">Category</th>
                <th className="px-lg py-3 text-label-sm uppercase text-on-surface-variant">Account</th>
                <th className="px-lg py-3 text-right text-label-sm uppercase text-on-surface-variant">Amount</th>
                <th className="px-lg py-3 text-label-sm uppercase text-on-surface-variant">Status</th>
                <th className="px-lg py-3 text-right text-label-sm uppercase text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                    No transactions found for the selected period.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-surface-container-low">
                    <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                      {formatCompanyTransactionDate(transaction.createdAt)}
                    </td>
                    <td className="px-lg py-4 text-label-md font-semibold text-primary">
                      {transaction.reference}
                    </td>
                    <td className="px-lg py-4 text-body-sm">{transaction.description}</td>
                    <td className="px-lg py-4">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${
                          CATEGORY_CLASS[transaction.category] ??
                          "bg-surface-container text-on-surface-variant border border-outline-variant"
                        }`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-lg py-4 text-body-sm">{transaction.accountName}</td>
                    <td
                      className={[
                        "px-lg py-4 text-right font-semibold",
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
                    <td className="px-lg py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openLedger(transaction)}
                          disabled={!transaction.accountId}
                          className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm text-primary hover:bg-surface-container-low disabled:opacity-40"
                        >
                          View Ledger
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadLedger(transaction)}
                          disabled={!transaction.accountId || downloadingLedgerId === transaction.id}
                          className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40"
                          title="Download ledger PDF"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <EmployeePagination
        page={page}
        totalPages={totalPages}
        from={from}
        to={to}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
