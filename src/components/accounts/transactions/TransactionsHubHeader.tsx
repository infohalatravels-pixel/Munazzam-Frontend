"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function TransactionsHubHeader() {
  const router = useRouter();

  return (
    <div className="mb-xl flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
      <div>
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
            <li className="font-semibold text-primary">Transactions</li>
          </ol>
        </nav>

        <button
          type="button"
          onClick={() => router.push("/dashboard/accounts")}
          className="mb-sm inline-flex items-center gap-xs text-label-md text-primary md:hidden"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Accounts
        </button>

        <h1 className="text-headline-lg text-on-surface md:text-headline-lg">
          Transactions Hub
        </h1>
        <p className="mt-xs max-w-2xl text-body-md text-on-surface-variant">
          Select a transaction type to begin or manage your financial operations.
        </p>
      </div>

      <button
        type="button"
        disabled
        className="flex min-h-11 w-full items-center justify-center gap-xs rounded-lg bg-primary-container px-lg py-sm text-label-md text-on-primary shadow-md opacity-60 sm:w-auto"
        title="Select a transaction type below"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        New Transaction
      </button>
    </div>
  );
}
