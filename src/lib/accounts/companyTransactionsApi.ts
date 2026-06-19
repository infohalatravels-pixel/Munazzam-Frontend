import { apiClient } from "@/lib/auth/apiClient";

export type CompanyTransaction = {
  id: string;
  reference: string;
  rawType: string;
  type: "debit" | "credit" | "transfer";
  direction: "in" | "out";
  status: string;
  amount: number;
  signedAmount: number;
  currency: string;
  category: string;
  description: string;
  accountId: string | null;
  accountName: string;
  counterpartyAccountName: string;
  createdAt: string;
  createdBy: string;
};

export type CompanyTransactionListResult = {
  transactions: CompanyTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  from: number;
  to: number;
  period: {
    fromDate: string;
    toDate: string;
    label: string;
  };
};

export type CompanyTransactionQuery = {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  today?: boolean;
  exportAll?: boolean;
};

export async function fetchCompanyTransactions(
  query: CompanyTransactionQuery = {}
): Promise<CompanyTransactionListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.fromDate) params.set("fromDate", query.fromDate);
  if (query.toDate) params.set("toDate", query.toDate);
  if (query.today) params.set("today", "true");
  if (query.exportAll) params.set("exportAll", "true");

  const qs = params.toString();
  return apiClient<CompanyTransactionListResult>(
    `/api/transactions${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export function formatCompanyTransactionDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function exportCompanyTransactionsCsv(
  transactions: CompanyTransaction[],
  filename: string
) {
  const headers = [
    "Date",
    "Reference",
    "Description",
    "Category",
    "Account",
    "Counterparty",
    "Amount",
    "Currency",
    "Status",
  ];

  const rows = transactions.map((tx) => [
    formatCompanyTransactionDate(tx.createdAt),
    tx.reference,
    tx.description,
    tx.category,
    tx.accountName,
    tx.counterpartyAccountName,
    String(tx.signedAmount),
    tx.currency,
    tx.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
