"use client";

import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { formatTransactionAmount } from "@/lib/accounts/formatters";
import { formatDepositDate } from "@/lib/accounts/deposits";
import { FreelancerPaymentRecord } from "@/lib/accounts/transactionsApi";

const STATUS_CLASS: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Failed: "bg-error-container text-on-error-container border border-error/20",
  Cancelled: "bg-surface-container text-on-surface-variant border border-outline-variant",
  Reversed: "bg-surface-container text-on-surface-variant border border-outline-variant",
};

type FreelancerPaymentsTableProps = {
  payments: FreelancerPaymentRecord[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  search: string;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
};

export function FreelancerPaymentsTable({
  payments,
  isLoading = false,
  page,
  totalPages,
  total,
  search,
  onPageChange,
  onSearchChange,
}: FreelancerPaymentsTableProps) {
  const from = total === 0 ? 0 : (page - 1) * 5 + 1;
  const to = Math.min(page * 5, total);

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant bg-white card-shadow">
      <div className="flex flex-col gap-md border-b border-outline-variant p-md sm:flex-row sm:items-center sm:justify-between sm:px-lg">
        <h2 className="text-headline-sm text-on-surface">Payment History</h2>
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search payments..."
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low py-2 pr-md pl-10 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="px-lg py-xl text-center text-body-md text-on-surface-variant">
          Loading freelancer payments...
        </p>
      ) : (
        <>
          {/* Mobile */}
          <div className="space-y-sm p-md md:hidden">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <article
                  key={payment.id}
                  className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-md"
                >
                  <div className="mb-sm flex items-start justify-between gap-sm">
                    <div>
                      <p className="text-label-md text-on-surface">{payment.employeeName}</p>
                      <p className="text-label-sm text-on-surface-variant">{payment.reference}</p>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        STATUS_CLASS[payment.status] ?? STATUS_CLASS.Completed,
                      ].join(" ")}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div className="mb-sm">
                    <p className="text-body-sm text-on-surface-variant">Account</p>
                    <p className="text-body-sm font-medium text-on-surface">
                      {payment.destinationAccountName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-sm text-body-sm">
                    <div>
                      <p className="text-on-surface-variant">Opening</p>
                      <p className="font-medium text-on-surface">
                        {formatTransactionAmount(payment.openingBalance, payment.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant">Closing</p>
                      <p className="font-medium text-on-surface">
                        {formatTransactionAmount(payment.closingBalance, payment.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-sm flex items-center justify-between">
                    <span className="font-semibold text-emerald-600">
                      +{formatTransactionAmount(payment.amount, payment.currency)}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      {formatDepositDate(payment.createdAt)}
                    </span>
                  </div>
                  {payment.description && (
                    <div className="mt-sm pt-sm border-t border-outline-variant/40">
                      <p className="text-body-sm text-on-surface-variant">{payment.description}</p>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="py-xl text-center text-body-md text-on-surface-variant">
                No freelancer payments found.
              </p>
            )}
          </div>

          {/* Desktop */}
          <div className="custom-scrollbar hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface">
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Reference
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Freelancer
                  </th>
                  <th className="px-lg py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                    Account
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
                    Status
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
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="px-lg py-4 font-mono text-body-sm text-on-surface">
                        {payment.reference}
                      </td>
                      <td className="px-lg py-4">
                        <div>
                          <div className="text-label-md text-on-surface">{payment.employeeName}</div>
                          <div className="text-label-sm text-on-surface-variant">
                            Code: {payment.employeeCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-4 text-label-md text-on-surface">
                        {payment.destinationAccountName}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {formatTransactionAmount(payment.openingBalance, payment.currency)}
                      </td>
                      <td className="px-lg py-4 font-semibold text-emerald-600">
                        +{formatTransactionAmount(payment.amount, payment.currency)}
                      </td>
                      <td className="px-lg py-4 text-body-sm font-medium text-on-surface">
                        {formatTransactionAmount(payment.closingBalance, payment.currency)}
                      </td>
                      <td className="px-lg py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-label-sm font-medium",
                            STATUS_CLASS[payment.status] ?? STATUS_CLASS.Completed,
                          ].join(" ")}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {formatDepositDate(payment.createdAt)}
                      </td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                        {payment.createdBy}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-lg py-xl text-center text-body-md text-on-surface-variant"
                    >
                      No freelancer payments found.
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