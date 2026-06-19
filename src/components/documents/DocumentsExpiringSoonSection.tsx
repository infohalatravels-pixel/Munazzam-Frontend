"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DocumentExpiryAlert } from "@/lib/documents/api";

type DocumentsExpiringSoonSectionProps = {
  alerts: DocumentExpiryAlert[];
  alertCount: number;
  isLoading?: boolean;
};

export function DocumentsExpiringSoonSection({
  alerts,
  alertCount,
  isLoading = false,
}: DocumentsExpiringSoonSectionProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <section className="mb-2xl">
        <div className="mb-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-error"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <h3 className="text-headline-sm text-on-surface">Documents Expiring Soon</h3>
          </div>
        </div>
        <p className="text-body-sm text-on-surface-variant">Loading alerts...</p>
      </section>
    );
  }

  if (alerts.length === 0) {
    return (
      <section className="mb-2xl">
        <div className="mb-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">verified</span>
            <h3 className="text-headline-sm text-on-surface">Documents Expiring Soon</h3>
          </div>
        </div>
        <div className="rounded-xl border border-outline-variant bg-white p-lg text-body-sm text-on-surface-variant card-shadow">
          All documents are up to date. No expiring or expired records in the next 30 days.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-2xl">
      <div className="mb-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-error"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <h3 className="text-headline-sm text-on-surface">Documents Expiring Soon</h3>
        </div>
        {alertCount > alerts.length ? (
          <Link
            href="/dashboard/documents/employees"
            className="flex items-center text-label-sm font-semibold text-primary hover:underline"
          >
            View All Alerts
            <span className="material-symbols-outlined ml-1 text-[16px]">arrow_forward</span>
          </Link>
        ) : null}
      </div>

      <div className="custom-scrollbar flex space-x-gutter overflow-x-auto pb-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="group relative flex min-w-[320px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-white p-md card-shadow transition-all hover:-translate-y-1 hover:border-primary-fixed-dim"
          >
            <div className={`absolute top-0 left-0 h-full w-1 ${alert.accentClass}`} />

            <div className="mb-md flex items-start justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  alert.severity === "expired"
                    ? "bg-error/10 text-error"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <span className="material-symbols-outlined">{alert.icon}</span>
              </div>
              <span
                className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${
                  alert.severity === "expired"
                    ? "bg-error/10 text-error"
                    : "bg-secondary-container/20 text-on-secondary-fixed-variant"
                }`}
              >
                {alert.badgeLabel}
              </span>
            </div>

            <h4 className="mb-1 text-label-md text-on-surface">{alert.title}</h4>
            <p className="mb-4 text-label-sm text-on-surface-variant">{alert.subtitle}</p>

            <div className="mt-auto flex items-center justify-between">
              <div
                className={`flex items-center ${
                  alert.severity === "expired" ? "text-error" : "text-secondary"
                }`}
              >
                <span className="material-symbols-outlined mr-1 text-[18px]">
                  {alert.severity === "expired" ? "history" : "event"}
                </span>
                <span className="text-label-sm font-semibold">{alert.timeLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => router.push(alert.resolveHref)}
                className={`rounded-lg px-4 py-1.5 text-label-sm font-semibold transition-opacity hover:opacity-90 ${
                  alert.severity === "expired"
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
