import type { AccountKpi } from "@/lib/accounts/types";
import { formatCurrency } from "@/lib/accounts/formatters";

type AccountsKpiGridProps = {
  kpis: AccountKpi[];
};

export function AccountsKpiGrid({ kpis }: AccountsKpiGridProps) {
  return (
    <div className="mb-lg grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const isCount = kpi.variant === "count";
        const { formatted, currency } = formatCurrency(kpi.value, kpi.currency);
        return (
          <div
            key={kpi.id}
            className="rounded-xl border border-outline-variant bg-white p-md card-shadow transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <div className="mb-sm flex items-center justify-between">
              <div className={`rounded-lg p-2 ${kpi.iconClassName}`}>
                <span className="material-symbols-outlined">{kpi.icon}</span>
              </div>
              {kpi.badge ? (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-label-sm",
                    kpi.badgeClassName ?? "text-on-surface-variant",
                  ].join(" ")}
                >
                  {kpi.badge}
                </span>
              ) : null}
            </div>
            <p className="text-label-md font-medium text-on-surface-variant">{kpi.label}</p>
            <h3 className="mt-xs text-headline-md text-on-surface">
              {isCount ? formatted : formatted}{" "}
              {!isCount ? (
                <span className="text-body-sm font-normal text-on-surface-variant">
                  {currency}
                </span>
              ) : null}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
