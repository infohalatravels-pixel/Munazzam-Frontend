import Link from "next/link";

export function TransferPageHeader() {
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
          <li className="font-semibold text-primary">Transfer</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Transfer</h1>
          <p className="mt-xs max-w-2xl text-body-md text-on-surface-variant">
            Move funds between bank and internal system accounts. Each transfer creates
            matching debit and credit entries for complete audit trails.
          </p>
        </div>
      </div>
    </div>
  );
}