import type { AccountRecord, AccountStats } from "./api";
import { formatAccountTypeLabel } from "./constants";
import type { AccountKpi, BankAccount } from "./types";

const CARD_ACCENTS = ["bg-primary", "bg-secondary", "bg-on-surface", "bg-tertiary-container"];
const CARD_ICONS = [
  { icon: "account_balance", iconClassName: "text-primary" },
  { icon: "verified_user", iconClassName: "text-secondary" },
  { icon: "account_balance", iconClassName: "text-on-surface" },
  { icon: "savings", iconClassName: "text-primary" },
];

export function mapAccountToCard(account: AccountRecord, index: number): BankAccount {
  const style = CARD_ICONS[index % CARD_ICONS.length];

  return {
    id: account.id,
    shortName: account.shortName,
    fullName:
      account.category === "BANK"
        ? account.bankName || account.name
        : account.name,
    accountNumberMasked: account.accountNumberMasked || "—",
    accountType: formatAccountTypeLabel(account.accountType),
    balance: account.balance,
    currency: account.currency,
    category: account.category,
    accentClassName: CARD_ACCENTS[index % CARD_ACCENTS.length],
    icon: account.category === "INTERNAL" ? "savings" : style.icon,
    iconClassName: style.iconClassName,
  };
}

export function buildKpisFromStats(stats: AccountStats): AccountKpi[] {
  return [
    {
      id: "total-balance",
      label: "Total Balance",
      value: stats.totalBalance,
      currency: stats.currency,
      icon: "account_balance_wallet",
      iconClassName: "bg-primary/5 text-primary",
      badge: "Live",
      badgeClassName: "text-emerald-600 bg-emerald-50",
      variant: "currency",
    },
    {
      id: "bank-balance",
      label: "Bank Balance",
      value: stats.bankBalance,
      currency: stats.currency,
      icon: "account_balance",
      iconClassName: "bg-secondary/5 text-secondary",
      badge: "Bank",
      badgeClassName: "text-on-surface-variant",
      variant: "currency",
    },
    {
      id: "internal-balance",
      label: "Internal Balance",
      value: stats.internalBalance,
      currency: stats.currency,
      icon: "receipt_long",
      iconClassName: "bg-error/5 text-error",
      variant: "currency",
    },
    {
      id: "active-accounts",
      label: "Active Accounts",
      value: stats.activeAccountCount,
      currency: stats.currency,
      icon: "pending_actions",
      iconClassName: "bg-tertiary-container/10 text-primary",
      badge: "Accounts",
      badgeClassName: "text-on-surface-variant",
      variant: "count",
    },
  ];
}

export function formatLastSynchronized(accounts: AccountRecord[]) {
  if (accounts.length === 0) return "Not synced yet";

  const latest = accounts.reduce((max, account) => {
    const updated = new Date(account.updatedAt).getTime();
    return updated > max ? updated : max;
  }, 0);

  return new Date(latest).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
