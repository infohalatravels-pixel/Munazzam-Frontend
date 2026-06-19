import type { BankAccount } from "@/lib/accounts/types";
import { formatCurrency } from "@/lib/accounts/formatters";

type BankAccountCardProps = {
  account: BankAccount;
};

export function BankAccountCard({ account }: BankAccountCardProps) {
  const { formatted, currency } = formatCurrency(account.balance, account.currency);

  return (
    <article className="group flex h-full min-w-[280px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-outline-variant bg-white card-shadow sm:min-w-0">
      <div className={`h-2 ${account.accentClassName}`} />
      <div className="flex flex-1 flex-col p-lg">
        <div className="mb-lg flex items-start justify-between">
          <div>
            <h4 className="text-headline-sm text-on-surface">{account.shortName}</h4>
            <p className="text-body-sm text-on-surface-variant">{account.fullName}</p>
          </div>
          <div className="rounded-lg bg-surface-container p-2">
            <span className={`material-symbols-outlined ${account.iconClassName}`}>
              {account.icon}
            </span>
          </div>
        </div>

        <div className="mb-lg space-y-md">
          <div className="flex items-end justify-between gap-sm">
            <div className="text-label-sm text-on-surface-variant">ACCOUNT NUMBER</div>
            <div className="font-mono text-on-surface">{account.accountNumberMasked}</div>
          </div>
          <div className="flex items-end justify-between gap-sm">
            <div className="text-label-sm text-on-surface-variant">ACCOUNT TYPE</div>
            <div className="rounded bg-surface-container-highest px-2 py-0.5 text-label-sm text-on-surface">
              {account.accountType}
            </div>
          </div>
          <div className="border-t border-outline-variant/30 pt-md">
            <div className="mb-xs text-label-sm text-on-surface-variant">AVAILABLE BALANCE</div>
            <div className="text-headline-md text-on-surface">
              {formatted}{" "}
              <span className="text-label-md font-normal">{currency}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-auto w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 text-label-md text-primary transition-all group-hover:shadow-sm hover:bg-primary hover:text-on-primary active:scale-[0.98]"
        >
          View Ledger
        </button>
      </div>
    </article>
  );
}
