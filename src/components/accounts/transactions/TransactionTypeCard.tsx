"use client";

import type { TransactionTypeConfig } from "@/lib/accounts/transactionTypes";

type TransactionTypeCardProps = {
  config: TransactionTypeConfig;
  onSelect: (config: TransactionTypeConfig) => void;
};

export function TransactionTypeCard({ config, onSelect }: TransactionTypeCardProps) {
  if (!config.enabled) {
    return (
      <article className="cursor-not-allowed rounded-2xl border border-outline-variant/30 bg-surface-container p-lg opacity-60 grayscale">
        <div className="mb-md flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant">
              {config.icon}
            </span>
          </div>
          <span className="rounded px-sm py-0.5 text-[10px] font-bold tracking-wider text-on-surface-variant uppercase bg-outline-variant">
            Coming Soon
          </span>
        </div>
        <h3 className="mb-xs text-headline-sm text-on-surface">{config.title}</h3>
        <p className="text-body-sm text-on-surface-variant">{config.description}</p>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(config)}
      className="group relative w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg text-left transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(138,21,56,0.08)] active:scale-[0.98]"
    >
      {config.watermarkIcon ? (
        <div className="pointer-events-none absolute top-0 right-0 p-lg opacity-10 transition-opacity group-hover:opacity-20">
          <span className="material-symbols-outlined text-[64px] text-primary">
            {config.watermarkIcon}
          </span>
        </div>
      ) : null}

      <div className="mb-md flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed-dim/30 transition-colors group-hover:bg-primary">
        <span
          className="material-symbols-outlined text-on-primary-fixed-variant group-hover:text-on-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {config.icon}
        </span>
      </div>

      <h3 className="mb-xs text-headline-sm text-on-surface">{config.title}</h3>
      <p className="text-body-sm text-on-surface-variant">{config.description}</p>

      <div className="mt-xl flex items-center gap-xs text-label-md text-primary opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        {config.actionLabel}
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </div>
    </button>
  );
}
