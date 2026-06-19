"use client";

import Link from "next/link";
import type { DocumentsHubStats } from "@/lib/documents/api";

type ComplianceSummaryCardProps = {
  stats: DocumentsHubStats | null;
  alertCount: number;
  isLoading?: boolean;
};

function formatStorage(mb: number) {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

export function ComplianceSummaryCard({
  stats,
  alertCount,
  isLoading = false,
}: ComplianceSummaryCardProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-white p-xl card-shadow">
      <div className="mb-md flex items-center justify-between">
        <h4 className="text-headline-sm text-on-surface">Compliance Snapshot</h4>
        <Link href="/dashboard/documents" className="text-label-sm text-primary hover:underline">
          Open Hub
        </Link>
      </div>

      {isLoading || !stats ? (
        <p className="text-body-sm text-on-surface-variant">Loading compliance data...</p>
      ) : (
        <div className="grid grid-cols-2 gap-md">
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant">Uploaded Files</p>
            <p className="text-headline-sm font-bold text-on-surface">{stats.totalAssets}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant">Missing Slots</p>
            <p className="text-headline-sm font-bold text-error">{stats.missingFiles}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant">Compliance</p>
            <p className="text-headline-sm font-bold text-primary">{stats.complianceRate}%</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant">Open Alerts</p>
            <p className="text-headline-sm font-bold text-secondary">{alertCount}</p>
          </div>
        </div>
      )}

      {stats ? (
        <p className="mt-md text-body-sm text-on-surface-variant">
          Storage used: {formatStorage(stats.storageUsedMb)} across company and employee records.
        </p>
      ) : null}
    </div>
  );
}
