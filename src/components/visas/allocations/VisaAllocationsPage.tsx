"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppModal } from "@/components/ui/AppModal";
import { PROFESSION_CATEGORIES } from "@/lib/visas/constants";
import { createVisaAllocation, fetchVisaAllocations } from "@/lib/visas/api";
import type { QuotaSummary, VisaAllocation } from "@/lib/visas/types";

const ALLOCATION_STATUS_CLASS: Record<VisaAllocation["status"], string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  FULL: "bg-red-50 text-red-700 border-red-100",
  INACTIVE: "bg-surface-container text-on-surface-variant border-outline-variant",
};

const COUNTRY_OPTIONS = [
  { label: "India", code: "IN" },
  { label: "Pakistan", code: "PK" },
  { label: "Philippines", code: "PH" },
  { label: "Egypt", code: "EG" },
  { label: "United Kingdom", code: "UK" },
  { label: "Qatar", code: "QA" },
];

const EMPTY_SUMMARY: QuotaSummary = {
  totalSlots: 0,
  usedSlots: 0,
  availableSlots: 0,
  percentRemaining: 0,
  countryCount: 0,
};

export function VisaAllocationsPage() {
  const [showModal, setShowModal] = useState(false);
  const [allocations, setAllocations] = useState<VisaAllocation[]>([]);
  const [summary, setSummary] = useState<QuotaSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVisaAllocations({ limit: 50 });
      setAllocations(data.allocations);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load allocations.");
      setAllocations([]);
      setSummary(EMPTY_SUMMARY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllocations();
  }, [loadAllocations]);

  return (
    <>
      <div className="mx-auto max-w-[1440px] p-gutter md:p-xl">
        <nav className="mb-lg flex items-center gap-xs text-on-surface-variant">
          <Link href="/dashboard" className="text-label-sm hover:text-primary">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/dashboard/visas" className="text-label-sm hover:text-primary">
            Visas
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-label-sm font-bold text-primary">Allocations</span>
        </nav>

        <div className="mb-xl flex flex-col justify-between gap-md sm:flex-row sm:items-end">
          <div>
            <h1 className="mb-xs text-headline-lg text-on-surface">VP Allocations</h1>
            <p className="text-body-md text-on-surface-variant">
              Manage and monitor government visa quota allocations for your enterprise.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-sm rounded-lg bg-primary px-lg py-md font-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Add Allocation
          </button>
        </div>

        {error ? (
          <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <div className="relative mb-2xl flex flex-col items-center gap-xl overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-xl md:flex-row">
          <div className="relative z-10 flex-1">
            <p className="mb-xs font-label-sm uppercase tracking-widest text-white/80">Total Company Quota</p>
            <div className="flex items-baseline gap-md">
              <span className="font-display-lg text-display-lg text-white">{summary.totalSlots.toLocaleString()}</span>
              <span className="text-headline-sm text-on-primary-container">Slots Total</span>
            </div>
          </div>
          <div className="relative z-10 hidden h-16 w-px bg-white/20 md:block" />
          <div className="relative z-10 flex gap-xl">
            <div>
              <p className="mb-xs font-label-sm text-white/80">Used Quota</p>
              <p className="text-headline-md text-white">{summary.usedSlots}</p>
              <div className="mt-xs h-1 w-32 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-secondary-container"
                  style={{
                    width: `${summary.totalSlots ? (summary.usedSlots / summary.totalSlots) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <p className="mb-xs font-label-sm text-white/80">Available</p>
              <p className="text-headline-md text-secondary-container">{summary.availableSlots}</p>
              <p className="font-label-sm text-white/60">{summary.percentRemaining}% Remaining</p>
            </div>
          </div>
          <div className="relative z-10 rounded-lg border border-white/20 bg-white/10 p-md backdrop-blur-md">
            <span
              className="material-symbols-outlined mb-xs text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <p className="font-label-md text-white">Status: Optimal</p>
            <p className="text-[10px] text-white/60">Across {summary.countryCount} countries</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg py-md">
            <h2 className="text-headline-sm text-on-surface">Allocation Details</h2>
            <div className="flex gap-sm">
              <button
                type="button"
                className="flex items-center gap-xs rounded-lg border border-outline-variant px-md py-xs text-body-sm hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filter
              </button>
              <button
                type="button"
                className="flex items-center gap-xs rounded-lg border border-outline-variant px-md py-xs text-body-sm hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="bg-surface-bright">
                  {[
                    "Country",
                    "VP Number",
                    "Profession Category",
                    "Quota (Total/Used)",
                    "Available",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className={[
                        "px-lg py-md font-label-sm uppercase tracking-wider text-on-surface-variant",
                        col === "Actions" ? "text-right" : "",
                      ].join(" ")}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                      Loading allocations...
                    </td>
                  </tr>
                ) : allocations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-lg py-xl text-center text-body-md text-on-surface-variant">
                      No allocations yet. Add your first VP allocation.
                    </td>
                  </tr>
                ) : (
                  allocations.map((row) => {
                  const available = row.totalQuota - row.usedQuota;
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className="flex h-6 w-8 items-center justify-center rounded border border-outline-variant bg-surface-container text-[10px] font-bold">
                            {row.countryCode}
                          </div>
                          <span className="text-body-md text-on-surface">{row.country}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md text-body-sm text-on-surface-variant">{row.vpNumber}</td>
                      <td className="px-lg py-md">
                        <span className="rounded bg-surface-container px-sm py-xs text-label-sm text-on-surface-variant">
                          {row.professionCategory}
                        </span>
                      </td>
                      <td className="px-lg py-md text-body-md">
                        <div className="flex items-center gap-md">
                          <span className="font-bold text-on-surface">{row.totalQuota}</span>
                          <span className="text-on-surface-variant">/</span>
                          <span className="font-medium text-secondary">{row.usedQuota}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <span
                          className={[
                            "text-headline-sm",
                            available === 0 ? "text-on-surface-variant opacity-40" : "text-primary",
                          ].join(" ")}
                        >
                          {available}
                        </span>
                      </td>
                      <td className="px-lg py-md">
                        <span
                          className={[
                            "flex w-fit items-center gap-xs rounded-full border px-md py-xs text-label-sm font-bold",
                            ALLOCATION_STATUS_CLASS[row.status],
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "h-1.5 w-1.5 rounded-full",
                              row.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500",
                            ].join(" ")}
                          />
                          {row.status === "FULL" ? "Full" : row.status.charAt(0) + row.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <button type="button" className="p-xs text-on-surface-variant hover:text-primary">
                          <span className="material-symbols-outlined">edit_square</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-lg py-md">
            <p className="text-body-sm text-on-surface-variant">
              Showing {allocations.length} allocation{allocations.length === 1 ? "" : "s"}
            </p>
            <div className="flex gap-sm">
              <button
                type="button"
                disabled
                className="rounded border border-outline-variant p-xs hover:bg-surface-container disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                className="rounded border border-outline-variant p-xs hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddAllocationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => {
          setShowModal(false);
          loadAllocations();
        }}
      />
    </>
  );
}

function AddAllocationModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [countryCode, setCountryCode] = useState("PK");
  const [vpNumber, setVpNumber] = useState("");
  const [professionCategory, setProfessionCategory] = useState("");
  const [totalQuota, setTotalQuota] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const country = COUNTRY_OPTIONS.find((c) => c.code === countryCode)?.label ?? countryCode;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);
    try {
      await createVisaAllocation({
        country,
        countryCode,
        vpNumber: vpNumber.trim(),
        professionCategory: professionCategory || undefined,
        totalQuota: Number.parseInt(totalQuota, 10),
        notes: notes.trim() || undefined,
      });
      setVpNumber("");
      setTotalQuota("");
      setNotes("");
      onCreated();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create allocation.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppModal open={open} title="Add New Allocation" onClose={onClose} maxWidthClassName="max-w-lg">
      <form className="space-y-md p-lg" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {formError}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-label-sm uppercase text-on-surface-variant">Country</label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="rounded-lg border border-outline-variant px-md py-sm"
            >
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-label-sm uppercase text-on-surface-variant">VP Number</label>
            <input
              type="text"
              value={vpNumber}
              onChange={(e) => setVpNumber(e.target.value)}
              placeholder="VP-2023-XXXX"
              className="rounded-lg border border-outline-variant px-md py-sm"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-label-sm uppercase text-on-surface-variant">Profession Category</label>
          <select
            value={professionCategory}
            onChange={(e) => setProfessionCategory(e.target.value)}
            className="rounded-lg border border-outline-variant px-md py-sm"
          >
            <option value="">Select Category</option>
            {PROFESSION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-label-sm uppercase text-on-surface-variant">Total Slots Quota</label>
          <input
            type="number"
            min={1}
            value={totalQuota}
            onChange={(e) => setTotalQuota(e.target.value)}
            placeholder="Enter amount"
            className="rounded-lg border border-outline-variant px-md py-sm"
            required
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-label-sm uppercase text-on-surface-variant">Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information..."
            className="rounded-lg border border-outline-variant px-md py-sm"
          />
        </div>
        <div className="flex gap-md pt-md">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-outline-variant px-lg py-md font-label-md hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-lg bg-primary px-lg py-md font-label-md text-on-primary shadow-lg hover:bg-primary-container disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Confirm Allocation"}
          </button>
        </div>
      </form>
    </AppModal>
  );
}
