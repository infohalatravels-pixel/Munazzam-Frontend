"use client";

import { useEffect, useState } from "react";
import { downloadVisaAlertsCsv, fetchVisaExpiringEmployees } from "@/lib/employees/api";
import { VisaAlertsModal } from "./VisaAlertsModal";

type EmployeeHighlightsProps = {
  onLaunchWizard: () => void;
  refreshKey?: number;
};

export function EmployeeHighlights({
  onLaunchWizard,
  refreshKey = 0,
}: EmployeeHighlightsProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertCount, setAlertCount] = useState<number | null>(null);

  useEffect(() => {
    fetchVisaExpiringEmployees(30)
      .then((rows) => setAlertCount(rows.length))
      .catch(() => setAlertCount(null));
  }, [refreshKey]);

  async function handleDownloadReport() {
    await downloadVisaAlertsCsv(30);
  }

  return (
    <>
      <div className="mt-2xl grid grid-cols-1 gap-lg lg:grid-cols-3">
        <div className="group relative min-w-0 w-full overflow-hidden rounded-xl border border-outline-variant bg-white p-xl shadow-sm lg:col-span-2">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8A1538_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
          <div className="relative z-10 min-w-0 w-full">
            <h3 className="mb-sm text-headline-sm text-on-surface">Visa Expiration Alerts</h3>
            <p className="mb-lg max-w-[36rem] text-body-md leading-relaxed text-on-surface-variant">
              {alertCount === null
                ? "Track employees whose Qatar visas are expiring soon and start renewals before penalties apply."
                : `There are ${alertCount} employee${alertCount === 1 ? "" : "s"} with visas expiring in the next 30 days. We recommend initiating renewal processes immediately.`}
            </p>
            <div className="flex flex-col gap-md sm:flex-row">
              <button
                type="button"
                onClick={() => setShowAlerts(true)}
                className="rounded-lg bg-primary px-lg py-2 text-label-md text-on-primary transition-all hover:opacity-90"
              >
                Review All{alertCount !== null ? ` ${alertCount}` : ""}
              </button>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="rounded-lg border border-outline-variant px-lg py-2 text-label-md transition-all hover:bg-surface-container"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 w-full flex-col justify-between rounded-xl bg-primary-container p-xl text-on-primary-container shadow-lg">
          <div>
            <span className="material-symbols-outlined mb-md block text-3xl">rocket_launch</span>
            <h3 className="mb-xs text-headline-sm">Fast Onboarding</h3>
            <p className="max-w-[20rem] text-body-sm leading-relaxed opacity-90">
              Add new hires in minutes with our guided wizard — capture identity, Qatar visa
              details, and compliance documents in one flow.
            </p>
          </div>
          <button
            type="button"
            onClick={onLaunchWizard}
            className="mt-lg w-full rounded-lg bg-white py-2.5 text-label-md text-primary transition-all hover:bg-surface-container-high"
          >
            Launch Wizard
          </button>
        </div>
      </div>

      <VisaAlertsModal open={showAlerts} onClose={() => setShowAlerts(false)} />
    </>
  );
}
