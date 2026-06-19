import type { PendingTransaction } from "@/lib/accounts/transactionTypes";
import { formatCurrency } from "@/lib/accounts/formatters";

type PendingTransactionsPreviewProps = {
  transactions: PendingTransaction[];
};

export function PendingTransactionsPreview({
  transactions,
}: PendingTransactionsPreviewProps) {
  return (
    <section className="mt-2xl">
      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-col gap-sm border-b border-outline-variant px-md py-md sm:flex-row sm:items-center sm:justify-between sm:px-lg">
          <h2 className="text-label-md font-bold tracking-wide text-on-surface uppercase">
            Recent Pending Transactions
          </h2>
          <button
            type="button"
            disabled
            className="flex items-center gap-xs text-label-sm text-primary opacity-60"
          >
            View All History
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </button>
        </div>

        {/* Mobile cards */}
        <div className="space-y-sm p-md md:hidden">
          {transactions.map((tx) => {
            const { formatted, currency } = formatCurrency(tx.amount, tx.currency);
            return (
              <article
                key={tx.id}
                className="rounded-xl border border-outline-variant/40 bg-white p-md"
              >
                <div className="mb-sm flex items-start gap-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-container-highest text-[10px] font-bold text-primary">
                    {tx.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-label-md text-on-surface">{tx.recipient}</p>
                    <p className="text-[12px] text-on-surface-variant">{tx.subtitle}</p>
                  </div>
                  <span
                    className={[
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                      tx.statusClassName,
                    ].join(" ")}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-on-surface-variant">{tx.type}</span>
                  <span className="font-label-md text-on-surface">
                    {formatted} {currency}
                  </span>
                </div>
                <p className="mt-xs text-body-sm text-on-surface-variant">{tx.date}</p>
              </article>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="custom-scrollbar hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-lg py-sm text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
                  Recipient / Vendor
                </th>
                <th className="px-lg py-sm text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
                  Type
                </th>
                <th className="px-lg py-sm text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
                  Amount
                </th>
                <th className="px-lg py-sm text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
                  Status
                </th>
                <th className="px-lg py-sm text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {transactions.map((tx) => {
                const { formatted, currency } = formatCurrency(tx.amount, tx.currency);
                return (
                  <tr key={tx.id} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-container-highest text-[10px] font-bold text-primary">
                          {tx.initials}
                        </div>
                        <div>
                          <div className="text-label-md text-on-surface">{tx.recipient}</div>
                          <div className="text-[12px] text-on-surface-variant">{tx.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md text-body-sm text-on-surface-variant">
                      {tx.type}
                    </td>
                    <td className="px-lg py-md text-label-md text-on-surface">
                      {formatted} {currency}
                    </td>
                    <td className="px-lg py-md">
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[11px] font-bold",
                          tx.statusClassName,
                        ].join(" ")}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-lg py-md text-body-sm text-on-surface-variant">
                      {tx.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
