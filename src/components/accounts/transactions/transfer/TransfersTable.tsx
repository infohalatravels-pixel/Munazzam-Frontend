"use client";

import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { formatTransactionAmount } from "@/lib/accounts/formatters";
import { formatDepositDate } from "@/lib/accounts/deposits";
import type { TransferRecord } from "@/lib/accounts/transactionsApi";

const STATUS_CLASS: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Failed: "bg-error-container text-on-error-container border border-error/20",
  Cancelled: "bg-surface-container text-on-surface-variant border border-outline-variant",
  Reversed: "bg-surface-container text-on-surface-variant border border-outline-variant",
};

const TYPE_CLASS: Record<string, string> = {
  TRANSFER_IN: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  TRANSFER_OUT: "bg-blue-50 text-blue-700 border border-blue-100",
};

const TYPE_LABEL: Record<string, string> = {
  TRANSFER_IN: "Transfer In",
  TRANSFER_OUT: "Transfer Out",
};

type TransfersTableProps = {
  transfers: TransferRecord[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  search: string;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
};

export function TransfersTable({
  transfers,
  isLoading = false,
  page,
  totalPages,
  total,
  search,
  onPageChange,
  onSearchChange,
}: TransfersTableProps) {
  const from = total === 0 ? 0 : (page - 1) * 5 + 1;
  const to = Math.min(page * 5, total);

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant bg-white card-shadow">
      <div className="flex flex-col gap-md border-b border-outline-variant p-md sm:flex-row sm:items-center sm:justify-between sm:px-lg">
        <h2 className="text-headline-sm text-on-surface">Transfer History</h2>
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search transfers..."
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low py-2 pr-md pl-10 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="px-lg py-xl text-center text-body-md text-on-surface-variant">
          Loading transfers...
        </p>
      ) : (
        <>
          {/* Mobile */}
          <div className="space-y-sm p-md md:hidden">
            {transfers.length > 0 ? (
              transfers.map((transfer) => (
                <article
                  key={transfer.id}
                  className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-md"
                >
                  <div className="mb-sm flex items-start justify-between gap-sm">
                    <div>
                      <p className="text-label-md text-on-surface">{transfer.reference}</p>
                      <p className="text-label-sm text-on-surface-variant">
                        {transfer.type === "TRANSFER_OUT" ? "From" : "To"}: {transfer.accountName}
                      </p>
                      <p className="text-label-sm text-on-surface-variant">
                        {transfer.type === "TRANSFER_OUT" ? "To" : "From"}: {
                          transfer.type === "TRANSFER_OUT" 
                            ? transfer.destinationAccountName 
                            : transfer.sourceAccountName
                        }
                      </p>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        TYPE_CLASS[transfer.type] ?? TYPE_CLASS.TRANSFER_IN,
                      ].join(" ")}
                    >
                      {TYPE_LABEL[transfer.type]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-sm text-body-sm">
                    <div>
                      <p className="text-on-surface-variant">Opening</p>
                      <p className="font-medium text-on-surface">
                        {formatTransactionAmount(transfer.openingBalance, transfer.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant">Closing</p>
                      <p className="font-medium text-on-surface">
                        {formatTransactionAmount(transfer.closingBalance, transfer.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-sm flex items-center justify-between">
                    <span className={`font-semibold ${
                      transfer.type === "TRANSFER_IN" ? "text-emerald-600" : "text-blue-600"
                    }`}>
                      {transfer.type === "TRANSFER_IN" ? "+" : "-"}{formatTransactionAmount(transfer.amount, transfer.currency)}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      {formatDepositDate(transfer.createdAt)}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="py-xl text-center text-body-md text-on-surface-variant">
                No transfers found.
              </p>
            )}
          </div>

          {/* Desktop */}
          <div className="custom-scrollbar hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1200px] border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface">
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Reference
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Type
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Account
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Counter Account
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Opening Balance
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Amount
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Closing Balance
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Date
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Recorded By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {transfers.length > 0 ? (
                  transfers.map((transfer) => (
                    <tr key={transfer.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="px-lg py-4 font-mono text-body-sm text-on-surface">
                        {transfer.reference}
                      </td>
                      <td className="px-lg py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-label-sm font-medium",
                            TYPE_CLASS[transfer.type] ?? TYPE_CLASS.TRANSFER_IN,
                          ].join(" ")}
                        >
                          {TYPE_LABEL[transfer.type]}
                        </span>
                      </td>
                      <td className="px-lg py-4 text-label-md text-on-surface">
                        {transfer.accountName}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {transfer.type === "TRANSFER_OUT" 
                          ? transfer.destinationAccountName 
                          : transfer.sourceAccountName}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {formatTransactionAmount(transfer.openingBalance, transfer.currency)}
                      </td>
                      <td className={`px-lg py-4 font-semibold ${
                        transfer.type === "TRANSFER_IN" ? "text-emerald-600" : "text-blue-600"
                      }`}>
                        {transfer.type === "TRANSFER_IN" ? "+" : "-"}{formatTransactionAmount(transfer.amount, transfer.currency)}
                      </td>
                      <td className="px-lg py-4 text-body-sm font-medium text-on-surface">
                        {formatTransactionAmount(transfer.closingBalance, transfer.currency)}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {formatDepositDate(transfer.createdAt)}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {transfer.createdBy}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-lg py-xl text-center text-body-md text-on-surface-variant"
                    >
                      No transfers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <EmployeePagination
        page={page}
        totalPages={totalPages}
        from={from}
        to={to}
        total={total}
        onPageChange={onPageChange}
      />
    </section>
  );
}