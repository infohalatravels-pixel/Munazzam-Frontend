import type { BankAccount } from "@/lib/accounts/types";
import { AccountCard } from "./AccountCard";

type BankAccountsSectionProps = {
  accounts: BankAccount[];
  onAddAccount: () => void;
};

/** @deprecated Use AccountsSection instead */
export function BankAccountsSection({ accounts, onAddAccount }: BankAccountsSectionProps) {
  return (
    <section className="mb-lg space-y-md">
      <div className="flex items-center justify-between gap-sm">
        <h2 className="text-headline-sm text-on-surface">Active Bank Accounts</h2>
        <button
          type="button"
          onClick={onAddAccount}
          className="text-label-md text-primary transition-colors hover:underline"
        >
          Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-xl text-center">
          <p className="text-body-md text-on-surface-variant">
            No bank accounts yet. Add your first account to get started.
          </p>
        </div>
      ) : (
        <div className="-mx-gutter flex gap-md overflow-x-auto px-gutter pb-sm snap-x snap-mandatory scrollbar-none md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="w-[85vw] max-w-sm shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
