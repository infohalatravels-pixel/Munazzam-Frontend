"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAccounts } from "@/lib/accounts/api";
import { mapAccountToCard } from "@/lib/accounts/mappers";
import type { BankAccount } from "@/lib/accounts/types";
import { AccountCard } from "./AccountCard";

export function AllAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rows = await fetchAccounts({ status: "ACTIVE" });
      setAccounts(rows.map((account, index) => mapAccountToCard(account, index)));
    } catch (err) {
      setAccounts([]);
      setError(err instanceof Error ? err.message : "Failed to load accounts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return accounts;

    return accounts.filter(
      (account) =>
        account.shortName.toLowerCase().includes(term) ||
        account.fullName.toLowerCase().includes(term) ||
        account.accountType.toLowerCase().includes(term)
    );
  }, [accounts, search]);

  const bankAccounts = filtered.filter((account) => account.category === "BANK");
  const internalAccounts = filtered.filter((account) => account.category === "INTERNAL");

  return (
    <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
      <Link
        href="/dashboard/accounts"
        className="mb-md inline-flex items-center gap-xs text-label-md text-primary md:hidden"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Accounts
      </Link>

      <div className="mb-xl flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-sm hidden md:block">
            <ol className="flex flex-wrap items-center gap-xs text-label-sm text-on-surface-variant">
              <li>
                <Link href="/dashboard/accounts" className="hover:text-primary">
                  Accounts
                </Link>
              </li>
              <li>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </li>
              <li className="font-semibold text-primary">All Accounts</li>
            </ol>
          </nav>
          <h1 className="text-headline-lg text-on-surface">All Accounts</h1>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Bank accounts and internal system accounts in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/accounts")}
          className="hidden min-h-11 items-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container sm:inline-flex"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Overview
        </button>
      </div>

      {error ? (
        <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="mb-xl rounded-2xl border border-outline-variant bg-white p-md shadow-sm">
        <div className="relative">
          <span className="material-symbols-outlined absolute top-1/2 left-md -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, bank, or account type..."
            className="w-full rounded-xl border border-outline-variant bg-background py-sm pr-md pl-12 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="py-xl text-center text-body-md text-on-surface-variant">Loading accounts...</p>
      ) : (
        <div className="space-y-2xl">
          <section>
            <h2 className="mb-md text-headline-sm text-on-surface">
              Bank Accounts ({bankAccounts.length})
            </h2>
            {bankAccounts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-xl text-center text-body-md text-on-surface-variant">
                No bank accounts found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-lg md:grid-cols-2 xl:grid-cols-3">
                {bankAccounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-md text-headline-sm text-on-surface">
              Internal System Accounts ({internalAccounts.length})
            </h2>
            {internalAccounts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-xl text-center text-body-md text-on-surface-variant">
                No internal accounts found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-lg md:grid-cols-2 xl:grid-cols-3">
                {internalAccounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
