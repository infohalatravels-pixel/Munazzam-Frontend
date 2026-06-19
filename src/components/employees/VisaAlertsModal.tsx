"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  downloadVisaAlertsCsv,
  fetchVisaExpiringEmployees,
  type EmployeeRecord,
} from "@/lib/employees/api";
import { EmployeeAvatar } from "./EmployeeAvatar";

type VisaAlertsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function VisaAlertsModal({ open, onClose }: VisaAlertsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    setIsLoading(true);
    setError(null);

    fetchVisaExpiringEmployees(30)
      .then(setEmployees)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load visa alerts.");
        setEmployees([]);
      })
      .finally(() => setIsLoading(false));
  }, [open]);

  async function handleDownload() {
    try {
      await downloadVisaAlertsCsv(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div className="app-modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        className="app-modal-panel app-modal-panel--lg flex max-h-[92vh] flex-col"
      >
        <div className="shrink-0 border-b border-outline-variant px-xl py-lg">
          <div className="flex items-start justify-between gap-md">
            <div>
              <p className="text-label-sm text-primary">Compliance Alert</p>
              <h2 className="text-headline-sm text-on-surface">Visa Expiration Alerts</h2>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Employees with visas expiring in the next 30 days.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-xl py-xl">
          {error ? (
            <div className="mb-md rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <p className="text-body-md text-on-surface-variant">Loading alerts...</p>
          ) : employees.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              No employees have visas expiring in the next 30 days.
            </p>
          ) : (
            <div className="space-y-sm">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between gap-md rounded-xl border border-outline-variant bg-white p-md"
                >
                  <div className="flex min-w-0 items-center gap-md">
                    <EmployeeAvatar
                      employeeId={employee.id}
                      name={employee.name}
                      hasPhoto={employee.hasPhoto}
                      size={40}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-label-md font-bold text-on-surface">
                        {employee.name}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        {employee.employeeCode} · {employee.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[11px] font-label-sm uppercase",
                        employee.visaStatusClassName,
                      ].join(" ")}
                    >
                      {employee.visaStatusLabel}
                    </span>
                    <p className="mt-xs text-body-sm text-on-surface-variant">
                      Expires {employee.visaExpiryDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-sm border-t border-outline-variant px-xl py-lg">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-lg py-sm text-label-md text-on-surface-variant hover:bg-surface-container"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg border border-outline-variant px-lg py-sm text-label-md hover:bg-surface-container"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
