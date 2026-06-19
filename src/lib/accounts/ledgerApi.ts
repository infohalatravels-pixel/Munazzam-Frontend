import { apiClient } from "@/lib/auth/apiClient";
import type { AccountRecord } from "./api";

export type LedgerEntry = {
  id: string;
  reference: string;
  type: string;
  direction: "in" | "out";
  status: string;
  description: string;
  category: string;
  counterpartyAccountName: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  currency: string;
  createdAt: string;
  createdBy: string;
};

export type AccountLedgerSummary = {
  currentBalance: number;
  openingBalance: number;
  closingBalance: number;
  currency: string;
  totalInflow: number;
  totalOutflow: number;
  periodLabel: string;
  fromDate: string;
  toDate: string;
};

export type AccountLedgerResponse = {
  account: AccountRecord;
  summary: AccountLedgerSummary;
  entries: LedgerEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    from: number;
    to: number;
  };
};

export type AccountLedgerQuery = {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  exportAll?: boolean;
};

export async function fetchAccountLedger(
  accountId: string,
  query: AccountLedgerQuery = {}
): Promise<AccountLedgerResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.fromDate) params.set("fromDate", query.fromDate);
  if (query.toDate) params.set("toDate", query.toDate);
  if (query.exportAll) params.set("exportAll", "true");

  const qs = params.toString();
  return apiClient<AccountLedgerResponse>(
    `/api/accounts/${accountId}/ledger${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function fetchAccountById(accountId: string): Promise<AccountRecord> {
  const result = await apiClient<{ account: AccountRecord }>(`/api/accounts/${accountId}`, {
    method: "GET",
  });
  return result.account;
}

export function formatLedgerDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatLedgerAmount(value: number | null, currency = "QAR") {
  if (value === null) return "—";
  return value.toLocaleString("en-QA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const CATEGORY_CLASS: Record<string, string> = {
  Finance: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Revenue: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Payroll: "bg-blue-50 text-blue-700 border border-blue-100",
  Transfer: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Operations: "bg-orange-50 text-orange-700 border border-orange-100",
  Compliance: "bg-blue-50 text-blue-700 border border-blue-100",
};

export function getLedgerCategoryClass(category: string) {
  return CATEGORY_CLASS[category] ?? "bg-surface-container text-on-surface-variant border border-outline-variant";
}
