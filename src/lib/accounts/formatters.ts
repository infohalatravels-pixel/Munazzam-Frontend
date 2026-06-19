export function formatCurrency(amount: number, currency = "QAR") {
  const formatted = new Intl.NumberFormat("en-QA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return { formatted, currency };
}

export function formatTransactionAmount(amount: number, currency = "QAR") {
  const abs = Math.abs(amount).toLocaleString("en-QA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (amount > 0) return `+${abs} ${currency}`;
  if (amount < 0) return `-${abs} ${currency}`;
  return `${abs} ${currency}`;
}

export function getAmountClassName(amount: number, type: "debit" | "credit" | "transfer") {
  if (type === "transfer") return amount >= 0 ? "text-emerald-600" : "text-error";
  if (amount > 0) return "text-emerald-600";
  return "text-error";
}

export const TRANSACTION_STATUS_CLASS: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Failed: "bg-error-container text-on-error-container border border-error/20",
  Cancelled: "bg-surface-container text-on-surface-variant border border-outline-variant",
  Reversed: "bg-surface-container text-on-surface-variant border border-outline-variant",
};
