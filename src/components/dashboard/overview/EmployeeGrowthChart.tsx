import type { GrowthMonth } from "@/lib/dashboard/overviewHelpers";

type EmployeeGrowthChartProps = {
  months: GrowthMonth[];
  isLoading?: boolean;
};

export function EmployeeGrowthChart({ months, isLoading = false }: EmployeeGrowthChartProps) {
  const maxCount = Math.max(...months.map((month) => month.count), 1);

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-xl">
      <div className="mb-xl flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-headline-sm text-on-surface">New Hires</h4>
          <p className="text-body-sm text-on-surface-variant">
            Employees added over the last 6 months
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-body-sm text-on-surface-variant">Loading hire trends...</p>
      ) : (
        <div className="relative flex h-64 w-full items-end justify-between gap-2 px-md pb-8 sm:gap-md">
          {months.map((month) => {
            const heightPercent = Math.max((month.count / maxCount) * 100, month.count > 0 ? 8 : 4);

            return (
              <div
                key={month.label}
                className="group relative flex-1 rounded-t-lg bg-primary-container/10"
                style={{ height: `${heightPercent}%` }}
              >
                <div
                  className={[
                    "absolute bottom-0 left-0 h-full w-full rounded-t-lg transition-all",
                    month.isCurrent
                      ? "bg-primary group-hover:bg-primary/90"
                      : "bg-primary/20 group-hover:bg-primary/30",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute -bottom-6 left-1/2 -translate-x-1/2 text-label-sm",
                    month.isCurrent ? "text-on-surface" : "text-on-surface-variant",
                  ].join(" ")}
                >
                  {month.label}
                </span>
                {month.count > 0 ? (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-on-surface-variant">
                    {month.count}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
