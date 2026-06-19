"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { VisaApplicationsTable } from "./VisaApplicationsTable";
import { VisaKpiGrid } from "./VisaKpiGrid";
import { VisaQuotaCards } from "./VisaQuotaCards";
import { fetchVisaHub } from "@/lib/visas/api";
import type { VisaKpi, VisaQuotaCard } from "@/lib/visas/types";

const EMPTY_KPIS: VisaKpi[] = [
  { id: "in-progress", label: "In Progress", value: 0, sublabel: "—", icon: "pending_actions" },
  { id: "awaiting-medical", label: "Awaiting Medical", value: 0, sublabel: "—", icon: "medical_services" },
  { id: "medical-cleared", label: "Medical Cleared", value: 0, sublabel: "—", icon: "task_alt" },
  { id: "completed", label: "Completed (30d)", value: 0, sublabel: "—", icon: "history" },
  {
    id: "quota",
    label: "Quota Available",
    value: 0,
    sublabel: "No allocations",
    icon: "pie_chart",
    highlight: true,
  },
];

export function VisasHubPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<VisaKpi[]>(EMPTY_KPIS);
  const [quotaCards, setQuotaCards] = useState<VisaQuotaCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHub = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVisaHub();
      setKpis(data.kpis);
      setQuotaCards(data.quotaCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load visas hub.");
      setKpis(EMPTY_KPIS);
      setQuotaCards([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHub();
  }, [loadHub]);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-xl p-gutter md:p-lg">
      <div className="flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <nav className="mb-xs flex items-center gap-xs text-on-surface-variant">
            <Link href="/dashboard" className="text-label-sm hover:text-primary">
              Dashboard
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-label-sm font-bold text-primary">Visas</span>
          </nav>
          <h2 className="text-headline-lg text-on-surface">Visas</h2>
          <p className="text-body-md text-on-surface-variant">
            Track quota, applications, and residency pipeline
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => router.push("/dashboard/visas/allocations")}
            className="flex items-center gap-sm rounded-lg border border-outline-variant px-lg py-md font-bold text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">pie_chart</span>
            VP Allocations
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/visas/new")}
            className="flex items-center gap-sm rounded-lg bg-primary-container px-lg py-md font-bold text-on-primary shadow-md transition-opacity hover:opacity-90"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md">New Visa Application</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-body-md text-on-surface-variant">
          Loading summary...
        </div>
      ) : (
        <>
          <VisaKpiGrid kpis={kpis} />
          {quotaCards.length > 0 ? (
            <VisaQuotaCards quotas={quotaCards} />
          ) : (
            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-lg text-center">
              <p className="text-body-md text-on-surface-variant">
                No VP allocations yet.{" "}
                <Link href="/dashboard/visas/allocations" className="font-medium text-primary hover:underline">
                  Add your first allocation
                </Link>
              </p>
            </div>
          )}
        </>
      )}

      <VisaApplicationsTable vpNumbers={quotaCards.map((card) => card.vpNumber)} />
    </div>
  );
}
