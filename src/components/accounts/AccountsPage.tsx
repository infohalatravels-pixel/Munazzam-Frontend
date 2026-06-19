"use client";

import { useCallback, useEffect, useState } from "react";
import { AddAccountModal } from "./AddAccountModal";
import { AccountsKpiGrid } from "./AccountsKpiGrid";
import { AccountsPageHeader } from "./AccountsPageHeader";
import { AccountsSection } from "./AccountsSection";
import { AccountsToolbar } from "./AccountsToolbar";
import { TransactionsSection } from "./TransactionsSection";
import { fetchAccountStats, fetchAccounts } from "@/lib/accounts/api";
import {
  buildKpisFromStats,
  formatLastSynchronized,
  mapAccountToCard,
} from "@/lib/accounts/mappers";
import type { AccountKpi, BankAccount } from "@/lib/accounts/types";

export function AccountsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [internalAccounts, setInternalAccounts] = useState<BankAccount[]>([]);
  const [kpis, setKpis] = useState<AccountKpi[]>([]);
  const [lastSynchronized, setLastSynchronized] = useState("—");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [accounts, stats] = await Promise.all([
        fetchAccounts({ status: "ACTIVE" }),
        fetchAccountStats(),
      ]);

      const cards = accounts.map((account, index) => mapAccountToCard(account, index));
      setBankAccounts(cards.filter((account) => account.category === "BANK"));
      setInternalAccounts(cards.filter((account) => account.category === "INTERNAL"));
      setKpis(buildKpisFromStats(stats));
      setLastSynchronized(formatLastSynchronized(accounts));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load accounts.");
      setBankAccounts([]);
      setInternalAccounts([]);
      setKpis([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <AccountsPageHeader />

        {error ? (
          <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <AccountsToolbar
          lastSynchronized={lastSynchronized}
          onAddAccount={() => setShowAddModal(true)}
        />

        {isLoading ? (
          <div className="mb-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-body-md text-on-surface-variant">
            Loading accounts...
          </div>
        ) : (
          <>
            <AccountsKpiGrid kpis={kpis} />
            <AccountsSection
              title="Active Bank Accounts"
              accounts={bankAccounts}
              emptyMessage="No bank accounts yet. Add your first account to get started."
              onAddAccount={() => setShowAddModal(true)}
              addLabel="Add Bank Account"
            />
            <AccountsSection
              title="Internal System Accounts"
              accounts={internalAccounts}
              emptyMessage="No internal accounts configured yet."
            />
          </>
        )}

        <TransactionsSection />
      </div>

      <AddAccountModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={loadAccounts}
      />
    </>
  );
}
