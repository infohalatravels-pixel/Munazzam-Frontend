import Link from "next/link";
import type { VisaQuotaCard } from "@/lib/visas/types";

type VisaQuotaCardsProps = {
  quotas: VisaQuotaCard[];
};

function quotaPercent(used: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

export function VisaQuotaCards({ quotas }: VisaQuotaCardsProps) {
  return (
    <section>
      <div className="mb-md flex items-center justify-between">
        <h3 className="text-headline-sm text-on-surface">Visa Quota by Country</h3>
        <Link href="/dashboard/visas/allocations" className="text-label-md text-primary hover:underline">
          Manage allocations
        </Link>
      </div>
      <div className="flex gap-md overflow-x-auto pb-sm">
        {quotas.map((quota) => {
          const percent = quotaPercent(quota.used, quota.total);
          const barColor = percent >= 85 ? "bg-primary" : "bg-secondary";

          return (
            <div
              key={quota.id}
              className="min-w-[280px] rounded-2xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm"
            >
              <div className="mb-sm flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className="flex h-6 w-8 items-center justify-center rounded bg-surface-container text-[10px] font-bold text-on-surface-variant">
                    {quota.countryCode}
                  </div>
                  <span className="text-label-md font-bold uppercase">{quota.country}</span>
                </div>
                <span className="rounded bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold uppercase text-on-surface-variant">
                  {quota.vpNumber}
                </span>
              </div>
              <div className="space-y-xs">
                <div className="flex justify-between text-label-sm">
                  <span className="text-on-surface-variant">Allocated</span>
                  <span className="font-bold">
                    {quota.used} / {quota.total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
