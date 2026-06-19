"use client";

import { useEffect, useState } from "react";
import { fetchEmployeeStats, type EmployeeStats } from "@/lib/employees/api";

type EmployeeStatsGridProps = {
  refreshKey?: number;
};

export function EmployeeStatsGrid({ refreshKey = 0 }: EmployeeStatsGridProps) {
  const [stats, setStats] = useState<EmployeeStats | null>(null);

  useEffect(() => {
    fetchEmployeeStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, [refreshKey]);

  const items = [
    {
      label: "Total Staff",
      value: stats ? String(stats.totalStaff) : "—",
      suffix: stats ? "+12%" : undefined,
      suffixIcon: "trending_up",
      suffixClassName: "text-green-600",
    },
    {
      label: "Active Visas",
      value: stats ? String(stats.activeVisas) : "—",
      suffix: stats?.activeVisaPct,
      suffixClassName: "text-on-surface-variant",
    },
    {
      label: "Expiring Soon",
      value: stats ? String(stats.expiringSoon) : "—",
      suffix: "Critical",
      suffixClassName: "text-secondary",
      valueClassName: "text-secondary",
    },
    {
      label: "On Leave",
      value: stats ? String(stats.onLeave) : "—",
      suffix: "Current",
      suffixClassName: "text-on-surface-variant",
    },
  ];

  return (
    <div className="mb-2xl grid grid-cols-1 gap-lg md:grid-cols-2 xl:grid-cols-4">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-outline-variant bg-white p-md card-shadow"
        >
          <p className="mb-xs text-label-sm tracking-wider text-on-surface-variant uppercase">
            {stat.label}
          </p>
          <div className="flex items-end gap-sm">
            <span
              className={[
                "text-headline-md font-bold text-on-surface",
                stat.valueClassName ?? "",
              ].join(" ")}
            >
              {stat.value}
            </span>
            {stat.suffix ? (
              <span
                className={[
                  "flex items-center pb-1 text-label-sm",
                  stat.suffixClassName ?? "text-on-surface-variant",
                ].join(" ")}
              >
                {stat.suffixIcon ? (
                  <span className="material-symbols-outlined text-xs">{stat.suffixIcon}</span>
                ) : null}
                {stat.suffix}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
