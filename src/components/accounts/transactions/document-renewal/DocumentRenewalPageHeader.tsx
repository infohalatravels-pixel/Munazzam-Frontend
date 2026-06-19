import Link from "next/link";

export function DocumentRenewalPageHeader() {
  return (
    <div className="mb-xl">
      <nav className="mb-sm">
        <ol className="flex flex-wrap items-center gap-xs text-label-sm text-on-surface-variant">
          <li>
            <Link href="/dashboard/accounts" className="transition-colors hover:text-primary">
              Accounts
            </Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </li>
          <li>
            <Link
              href="/dashboard/accounts/transactions"
              className="transition-colors hover:text-primary"
            >
              Transactions
            </Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </li>
          <li className="font-semibold text-primary">Document Renewal</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Document Renewal</h1>
          <p className="mt-xs max-w-2xl text-body-md text-on-surface-variant">
            Record employee document renewal expenses including visa, QID, and permit
            processing fees paid from company accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
