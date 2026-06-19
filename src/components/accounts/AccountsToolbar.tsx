"use client";

import { useRouter } from "next/navigation";

type AccountsToolbarProps = {
  lastSynchronized: string;
  onAddAccount: () => void;
};

export function AccountsToolbar({ lastSynchronized, onAddAccount }: AccountsToolbarProps) {
  const router = useRouter();

  return (
    <div className="mb-lg flex flex-col gap-md md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-sm sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={onAddAccount}
          className="flex min-h-11 w-full items-center justify-center gap-xs rounded-lg bg-primary px-md py-2.5 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98] sm:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Add Bank Account
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/accounts/list")}
          className="flex min-h-11 w-full items-center justify-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container active:scale-[0.98] sm:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">view_list</span>
          View Accounts
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/accounts/transactions")}
          className="flex min-h-11 w-full items-center justify-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container active:scale-[0.98] sm:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">sync_alt</span>
          Transfer Funds
        </button>
      </div>

      <div className="flex items-center justify-center rounded-lg bg-surface-container-low px-md py-2 text-label-sm text-on-surface-variant md:justify-end">
        <span className="material-symbols-outlined mr-1 text-[18px]">schedule</span>
        Last synchronized: {lastSynchronized}
      </div>
    </div>
  );
}
