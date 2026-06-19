export type AccountKpi = {
  id: string;
  label: string;
  value: number;
  currency: string;
  icon: string;
  iconClassName: string;
  badge?: string;
  badgeClassName?: string;
  variant?: "currency" | "count";
};

export type BankAccount = {
  id: string;
  shortName: string;
  fullName: string;
  accountNumberMasked: string;
  accountType: string;
  balance: number;
  currency: string;
  category: "BANK" | "INTERNAL";
  accentClassName: string;
  icon: string;
  iconClassName: string;
};

export type TransactionStatus = "Completed" | "Pending" | "Failed";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: "debit" | "credit" | "transfer";
};

export type AccountsSummary = {
  lastSynchronized: string;
  kpis: AccountKpi[];
  bankAccounts: BankAccount[];
  transactions: Transaction[];
};
