import type { Transaction } from "@/lib/accounts/types";
import {
  formatTransactionAmount,
  getAmountClassName,
  TRANSACTION_STATUS_CLASS,
} from "@/lib/accounts/formatters";

type TransactionCardProps = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <article className="rounded-xl border border-outline-variant/40 bg-white p-md transition-colors active:bg-surface-container-low">
      <div className="mb-sm flex items-start justify-between gap-sm">
        <div className="min-w-0 flex-1">
          <p className="text-label-sm text-on-surface-variant">{transaction.date}</p>
          <p className="mt-xs truncate text-label-md font-medium text-on-surface">
            {transaction.description}
          </p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
            TRANSACTION_STATUS_CLASS[transaction.status],
          ].join(" ")}
        >
          {transaction.status}
        </span>
      </div>

      <div className="flex items-center justify-between gap-sm">
        <span className="rounded-full bg-surface-container px-2.5 py-1 text-label-sm text-on-surface-variant">
          {transaction.category}
        </span>
        <span
          className={[
            "text-label-md font-semibold",
            getAmountClassName(transaction.amount, transaction.type),
          ].join(" ")}
        >
          {formatTransactionAmount(transaction.amount, transaction.currency)}
        </span>
      </div>
    </article>
  );
}
