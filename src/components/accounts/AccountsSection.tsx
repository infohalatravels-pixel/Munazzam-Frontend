import type { BankAccount } from "@/lib/accounts/types";
import { AccountCard } from "./AccountCard";

type AccountsSectionProps = {
  title: string;
  accounts: BankAccount[];
  emptyMessage: string;
  onAddAccount?: () => void;
  addLabel?: string;
};

export function AccountsSection({
  title,
  accounts,
  emptyMessage,
  onAddAccount,
  addLabel = "Add Account",
}: AccountsSectionProps) {
  return (
    <section className="mb-lg space-y-md">
      <div className="flex items-center justify-between gap-sm">
        <h2 className="text-headline-sm text-on-surface">{title}</h2>
        {onAddAccount ? (
          <button
            type="button"
            onClick={onAddAccount}
            className="text-label-md text-primary transition-colors hover:underline"
          >
            {addLabel}
          </button>
        ) : null}
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-xl text-center">
          <p className="text-body-md text-on-surface-variant">{emptyMessage}</p>
          {onAddAccount ? (
            <button
              type="button"
              onClick={onAddAccount}
              className="mt-md inline-flex min-h-11 items-center gap-xs rounded-lg bg-primary px-md py-2.5 text-label-md text-on-primary active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              {addLabel}
            </button>
          ) : null}
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
