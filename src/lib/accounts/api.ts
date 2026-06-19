import { apiClient } from "@/lib/auth/apiClient";

export type AccountCategory = "BANK" | "INTERNAL";

export type AccountType =
  | "CURRENT"
  | "SAVINGS"
  | "PETTY_CASH"
  | "SALARY"
  | "OPERATING"
  | "REVENUE"
  | "EXPENSE"
  | "OTHER";

export type AccountStatus = "ACTIVE" | "INACTIVE" | "CLOSED";

export type AccountRecord = {
  id: string;
  name: string;
  description: string | null;
  category: AccountCategory;
  accountType: AccountType;
  bankName: string | null;
  accountNumber: string | null;
  accountNumberMasked: string | null;
  iban: string | null;
  currency: string;
  openingBalance: number;
  balance: number;
  status: AccountStatus;
  isDefault: boolean;
  sortOrder: number;
  shortName: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountStats = {
  totalBalance: number;
  bankBalance: number;
  internalBalance: number;
  activeAccountCount: number;
  currency: string;
};

export type CreateAccountPayload = {
  name: string;
  category: AccountCategory;
  accountType: AccountType;
  description?: string;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  currency?: string;
  openingBalance?: number;
  balance?: number;
  status?: AccountStatus;
  isDefault?: boolean;
  sortOrder?: number;
};

export type AccountListQuery = {
  category?: AccountCategory;
  accountType?: AccountType;
  status?: AccountStatus;
  search?: string;
};

export async function fetchAccounts(
  query: AccountListQuery = {}
): Promise<AccountRecord[]> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.accountType) params.set("accountType", query.accountType);
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  const result = await apiClient<{ accounts: AccountRecord[] }>(
    `/api/accounts${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
  return result.accounts;
}

export async function fetchAccountStats(): Promise<AccountStats> {
  const result = await apiClient<{ stats: AccountStats }>("/api/accounts/stats", {
    method: "GET",
  });
  return result.stats;
}

export async function createAccount(payload: CreateAccountPayload): Promise<AccountRecord> {
  const result = await apiClient<{ account: AccountRecord }>("/api/accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.account;
}
