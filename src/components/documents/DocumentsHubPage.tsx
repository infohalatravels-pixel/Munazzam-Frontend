"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DOCUMENT_AREAS,
  DOCUMENT_AREA_ROUTES,
  type DocumentAreaConfig,
} from "@/lib/documents/documentAreas";
import { fetchDocumentsHub, type DocumentExpiryAlert, type DocumentsHubStats } from "@/lib/documents/api";
import { DocumentsHubHeader } from "./DocumentsHubHeader";
import { DocumentAreaCard } from "./DocumentAreaCard";
import { DocumentsExpiringSoonSection } from "./DocumentsExpiringSoonSection";

const DEFAULT_STATS: DocumentsHubStats = {
  totalAssets: 0,
  missingFiles: 0,
  complianceRate: 100,
  storageUsedMb: 0,
  companyDocSlots: 3,
  employeeDocTypes: 4,
  activeEmployees: 0,
  entitiesEnabled: 2,
};

function formatStorage(mb: number) {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb} MB`;
}

export function DocumentsHubPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DocumentsHubStats>(DEFAULT_STATS);
  const [alerts, setAlerts] = useState<DocumentExpiryAlert[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHub = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDocumentsHub();
      setStats(data.stats);
      setAlerts(data.alerts);
      setAlertCount(data.alertCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents hub.");
      setStats(DEFAULT_STATS);
      setAlerts([]);
      setAlertCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHub();
  }, [loadHub]);

  function handleSelectArea(config: DocumentAreaConfig) {
    const route = DOCUMENT_AREA_ROUTES[config.id];
    if (route) {
      router.push(route);
    }
  }

  const enabledAreas = DOCUMENT_AREAS.filter((area) => area.enabled);

  return (
    <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
      <DocumentsHubHeader />

      {error ? (
        <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <DocumentsExpiringSoonSection
        alerts={alerts}
        alertCount={alertCount}
        isLoading={isLoading}
      />

      <section className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
        {enabledAreas.map((config) => (
          <DocumentAreaCard key={config.id} config={config} onSelect={handleSelectArea} />
        ))}
      </section>

      <div className="mt-2xl grid grid-cols-2 gap-gutter md:grid-cols-4">
        <div className="rounded-xl border border-outline-variant bg-white p-md text-center card-shadow">
          <p className="mb-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
            Total Assets
          </p>
          <h4 className="text-headline-md font-bold text-on-surface">
            {isLoading ? "—" : stats.totalAssets.toLocaleString()}
          </h4>
        </div>
        <div className="rounded-xl border border-outline-variant bg-white p-md text-center card-shadow">
          <p className="mb-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
            Missing Files
          </p>
          <h4 className="text-headline-md font-bold text-error">
            {isLoading ? "—" : stats.missingFiles}
          </h4>
        </div>
        <div className="rounded-xl border border-outline-variant bg-white p-md text-center card-shadow">
          <p className="mb-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
            Compliance Rate
          </p>
          <h4 className="text-headline-md font-bold text-primary">
            {isLoading ? "—" : `${stats.complianceRate}%`}
          </h4>
        </div>
        <div className="rounded-xl border border-outline-variant bg-white p-md text-center card-shadow">
          <p className="mb-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
            Storage Used
          </p>
          <h4 className="text-headline-md font-bold text-on-surface">
            {isLoading ? "—" : formatStorage(stats.storageUsedMb)}
          </h4>
        </div>
      </div>
    </div>
  );
}
