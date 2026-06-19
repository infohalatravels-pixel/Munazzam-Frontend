"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { formatAccountTypeLabel } from "@/lib/accounts/constants";
import { exportLedgerPdf } from "@/lib/accounts/exportLedgerPdf";
import { getCurrentMonthDateRange, formatDisplayRange } from "@/lib/accounts/ledgerDates";
import {
  fetchAccountLedger,
  formatLedgerAmount,
  formatLedgerDate,
  getLedgerCategoryClass,
  type AccountLedgerSummary,
  type LedgerEntry,
} from "@/lib/accounts/ledgerApi";
import type { AccountRecord } from "@/lib/accounts/api";

const PAGE_SIZE = 10;

export function AccountLedgerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = params.accountId as string;

  const defaultRange = useMemo(() => {
    const fromParam = searchParams.get("fromDate");
    const toParam = searchParams.get("toDate");
    if (fromParam && toParam) {
      return { fromDate: fromParam, toDate: toParam };
    }
    return getCurrentMonthDateRange();
  }, [searchParams]);

  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<AccountLedgerSummary | null>(null);
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);

  useEffect(() => {
    setFromDate(defaultRange.fromDate);
    setToDate(defaultRange.toDate);
    setPage(1);
  }, [defaultRange.fromDate, defaultRange.toDate]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLedger = useCallback(
    async (nextPage: number, nextSearch: string, rangeFrom: string, rangeTo: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchAccountLedger(accountId, {
          page: nextPage,
          limit: PAGE_SIZE,
          search: nextSearch || undefined,
          fromDate: rangeFrom,
          toDate: rangeTo,
        });

        setAccount(data.account);
        setEntries(data.entries);
        setSummary(data.summary);
        setPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
        setFrom(data.pagination.from);
        setTo(data.pagination.to);
      } catch (err) {
        setAccount(null);
        setEntries([]);
        setSummary(null);
        setError(err instanceof Error ? err.message : "Failed to load ledger.");
      } finally {
        setIsLoading(false);
      }
    },
    [accountId]
  );

  useEffect(() => {
    loadLedger(page, search, fromDate, toDate);
  }, [loadLedger, page, search, fromDate, toDate]);

  function handleFromDateChange(value: string) {
    setFromDate(value);
    setPage(1);
  }

  function handleToDateChange(value: string) {
    setToDate(value);
    setPage(1);
  }

  function resetToCurrentMonth() {
    const range = getCurrentMonthDateRange();
    setFromDate(range.fromDate);
    setToDate(range.toDate);
    setPage(1);
  }

  async function handleExportPdf() {
    if (!account) return;

    setIsExporting(true);
    setError(null);

    try {
      const data = await fetchAccountLedger(accountId, {
        search: search || undefined,
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
      setError(err instanceof Error ? err.message : "Failed to export ledger PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  const accountTitle = account
    ? `${account.shortName || account.name}${account.accountNumberMasked ? ` - ${account.accountNumberMasked.slice(-4)}` : ""}`
    : "Account";

  return (
    <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
      <div className="mb-xl flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/dashboard/accounts/list")}
            className="mb-2 flex items-center gap-1 text-label-md text-primary transition-all hover:gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Accounts
          </button>
          <h2 className="flex flex-wrap items-center gap-3 text-headline-lg text-on-surface">
            Account Ledger: {accountTitle}
            {account ? (
              <span className="rounded-full border border-primary-container/20 bg-primary-container/10 px-3 py-1 text-[12px] font-bold text-primary-container">
                {formatAccountTypeLabel(account.accountType).toUpperCase()}
              </span>
            ) : null}
          </h2>
          {account ? (
            <p className="mt-xs text-body-sm text-on-surface-variant">
              {account.category === "BANK"
                ? account.bankName || account.name
                : account.name}{" "}
              · {account.category === "BANK" ? "Bank Account" : "Internal System Account"}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting || isLoading || !account}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          {isExporting ? "Exporting..." : "Export PDF"}
        </button>
      </div>

      {error ? (
        <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="mb-xl grid grid-cols-1 gap-lg md:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-white p-lg shadow-sm">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                Current Balance
              </p>
              <h3 className="mt-1 text-headline-md font-bold">
                {summary
                  ? `${summary.currency} ${formatLedgerAmount(summary.currentBalance)}`
                  : "—"}
              </h3>
            </div>
            <div className="rounded-lg bg-surface-container-high p-2 text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-lg rounded-xl border border-outline-variant bg-white p-lg shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <span className="material-symbols-outlined">arrow_downward</span>
          </div>
          <div>
            <p className="text-label-sm text-on-surface-variant">
              Total Inflow ({summary?.periodLabel ?? "Selected period"})
            </p>
            <h3 className="text-headline-sm font-bold text-emerald-700">
              {summary
                ? `${summary.currency} ${formatLedgerAmount(summary.totalInflow)}`
                : "—"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-lg rounded-xl border border-outline-variant bg-white p-lg shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700">
            <span className="material-symbols-outlined">arrow_upward</span>
          </div>
          <div>
            <p className="text-label-sm text-on-surface-variant">
              Total Outflow ({summary?.periodLabel ?? "Selected period"})
            </p>
            <h3 className="text-headline-sm font-bold text-red-700">
              {summary
                ? `${summary.currency} ${formatLedgerAmount(summary.totalOutflow)}`
                : "—"}
            </h3>
          </div>
        </div>
      </div>

      <div className="mb-lg flex flex-wrap items-end gap-md rounded-xl border border-outline-variant bg-white p-md shadow-sm">
        <div className="relative min-w-[200px] flex-1">
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
            placeholder="Search description, reference ID..."
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pr-4 pl-10 text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-wrap items-end gap-sm">
          <label className="flex flex-col gap-1">
            <span className="text-label-sm text-on-surface-variant">From</span>
            <input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(event) => handleFromDateChange(event.target.value)}
              className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-label-sm text-on-surface-variant">To</span>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(event) => handleToDateChange(event.target.value)}
              className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>
          <button
            type="button"
            onClick={resetToCurrentMonth}
            className="mb-0.5 rounded-lg border border-outline-variant px-3 py-2 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            This month
          </button>
        </div>
      </div>

      <div className="mb-md flex flex-col gap-xs rounded-xl border border-primary-container/20 bg-primary-container/5 px-lg py-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
            Opening Balance
          </p>
          <p className="text-headline-sm font-bold text-on-surface">
            {summary
              ? `${summary.currency} ${formatLedgerAmount(summary.openingBalance)}`
              : "—"}
          </p>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Period: {formatDisplayRange(fromDate, toDate)}
          {summary ? ` · ${total} transaction${total === 1 ? "" : "s"}` : null}
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-lg py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Date
                </th>
                <th className="px-lg py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Reference ID
                </th>
                <th className="px-lg py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Description
                </th>
                <th className="px-lg py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Category
                </th>
                <th className="px-lg py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Account
                </th>
                <th className="px-lg py-4 text-right text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Debit
                </th>
                <th className="px-lg py-4 text-right text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Credit
                </th>
                <th className="px-lg py-4 text-right text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                    Loading ledger...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                    No transactions found for the selected date range.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const isTransfer = entry.type === "TRANSFER" || entry.category === "Transfer";
                  const isIncoming = entry.direction === "in" || entry.credit !== null;

                  return (
                    <tr key={entry.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="px-lg py-4 text-body-sm">{formatLedgerDate(entry.createdAt)}</td>
                      <td className="px-lg py-4 text-label-md font-semibold text-primary">
                        {entry.reference}
                      </td>
                      <td className="px-lg py-4 text-body-sm">
                        <div className="flex items-center gap-2">
                          {isTransfer ? (
                            <span
                              className={`material-symbols-outlined text-[18px] ${
                                isIncoming ? "text-emerald-600" : "text-on-primary-fixed-variant"
                              }`}
                            >
                              {isIncoming ? "call_received" : "call_made"}
                            </span>
                          ) : null}
                          <span>{entry.description}</span>
                        </div>
                      </td>
                      <td className="px-lg py-4">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${getLedgerCategoryClass(entry.category)}`}
                        >
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {entry.counterpartyAccountName}
                      </td>
                      <td className="px-lg py-4 text-right text-label-md font-bold text-on-primary-fixed-variant">
                        {entry.debit !== null ? formatLedgerAmount(entry.debit) : "—"}
                      </td>
                      <td className="px-lg py-4 text-right text-label-md font-bold text-emerald-700">
                        {entry.credit !== null ? formatLedgerAmount(entry.credit) : "—"}
                      </td>
                      <td className="px-lg py-4 text-right text-label-md font-semibold">
                        {formatLedgerAmount(entry.balance)}
                      </td>
                    </tr>
                  );
                })
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

      <div className="mt-lg flex items-center gap-4 rounded-xl border border-primary-container/10 bg-primary-container/5 p-md">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          info
        </span>
        <p className="text-body-sm text-on-surface-variant">
          Entries are sorted oldest first within the selected period. Use{" "}
          <strong>Export PDF</strong> to download the full statement for the current filters.
          Post new entries from the{" "}
          <Link href="/dashboard/accounts/transactions" className="font-semibold text-primary underline underline-offset-2">
            Transactions Hub
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
