"use client";

import Link from "next/link";
import type { VisaKpi } from "@/lib/visas/types";

type VisaKpiGridProps = {
  kpis: VisaKpi[];
};

export function VisaKpiGrid({ kpis }: VisaKpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) =>
        kpi.highlight ? (
          <div
            key={kpi.id}
            className="flex flex-col justify-between rounded-2xl border border-primary bg-primary-container p-md shadow-sm"
          >
            <p className="flex items-center gap-xs font-label-sm text-label-sm text-white/90">
              <span className="material-symbols-outlined text-[18px] text-white">{kpi.icon}</span>
              {kpi.label}
            </p>
            <div className="mt-md flex items-baseline gap-xs">
              <span className="font-display-lg text-display-lg text-white">{kpi.value}</span>
              <span className="text-xs font-bold text-on-primary-container">{kpi.sublabel}</span>
            </div>
          </div>
        ) : (
          <div
            key={kpi.id}
            className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
              <span
                className={[
                  "material-symbols-outlined text-[18px]",
                  kpi.trend === "positive" ? "text-[#065F46]" : "text-primary",
                ].join(" ")}
              >
                {kpi.icon}
              </span>
              {kpi.label}
            </p>
            <div className="mt-md flex items-baseline gap-xs">
              <span className="font-display-lg text-display-lg text-on-surface">{kpi.value}</span>
              <span
                className={[
                  "text-xs font-medium",
                  kpi.trend === "up" ? "font-bold text-secondary" : "text-on-surface-variant",
                  kpi.trend === "positive" ? "font-bold text-[#065F46]" : "",
                ].join(" ")}
              >
                {kpi.sublabel}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
