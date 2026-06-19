export type DepositRecord = {
  id: string;
  reference: string;
  type: string;
  accountId: string;
  accountName: string;
  accountCategory: "BANK" | "INTERNAL";
  sourceAccountId: string | null;
  sourceAccountName: string | null;
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  status: "Completed" | "Pending" | "Failed" | "Cancelled" | "Reversed";
  description: string | null;
  createdAt: string;
  createdBy: string;
};

export function formatDepositDate(value: string) {
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
