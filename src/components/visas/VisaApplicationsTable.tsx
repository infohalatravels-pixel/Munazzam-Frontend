"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { fetchVisaApplications } from "@/lib/visas/api";
import {
  EMPLOYEE_TYPE_CLASS,
  EMPLOYEE_TYPE_LABEL,
  PAYMENT_STATUS_CLASS,
  STAGE_FILTER_OPTIONS,
  STAGE_FILTER_QUERY,
  TYPE_FILTER_OPTIONS,
  TYPE_FILTER_QUERY,
} from "@/lib/visas/constants";
import type { VisaApplication } from "@/lib/visas/types";

const PAGE_SIZE = 10;

type VisaApplicationsTableProps = {
  vpNumbers?: string[];
  refreshKey?: number;
};

export function VisaApplicationsTable({ vpNumbers = [], refreshKey = 0 }: VisaApplicationsTableProps) {
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [stageFilter, setStageFilter] = useState<string>(STAGE_FILTER_OPTIONS[0]);
  const [typeFilter, setTypeFilter] = useState<string>(TYPE_FILTER_OPTIONS[0]);
  const [vpFilter, setVpFilter] = useState("All VP");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const vpOptions = useMemo(() => {
    const unique = Array.from(new Set(vpNumbers.filter(Boolean)));
    return ["All VP", ...unique];
  }, [vpNumbers]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [stageFilter, typeFilter, vpFilter, debouncedSearch]);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchVisaApplications({
        page,
        limit: PAGE_SIZE,
        status: "ALL",
        search: debouncedSearch || undefined,
        employeeType: TYPE_FILTER_QUERY[typeFilter],
        stageContains: STAGE_FILTER_QUERY[stageFilter],
        vpNumber: vpFilter === "All VP" ? undefined : vpFilter,
      });

      setApplications(result.applications);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setFrom(result.from);
      setTo(result.to);
    } catch (err) {
      setApplications([]);
      setTotal(0);
      setTotalPages(1);
      setFrom(0);
      setTo(0);
      setError(err instanceof Error ? err.message : "Failed to load visa applications.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, stageFilter, typeFilter, vpFilter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications, refreshKey]);

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-md border-b border-outline-variant bg-surface-container-lowest p-md">
        <div className="flex flex-wrap items-center gap-sm">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
              <span className="material-symbols-outlined">filter_list</span>
            </span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="appearance-none rounded-lg border-none bg-surface-container-low py-2 pr-8 pl-10 text-sm font-label-md"
            >
              {STAGE_FILTER_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none rounded-lg border-none bg-surface-container-low px-4 py-2 text-sm font-label-md"
          >
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <select
            value={vpFilter}
            onChange={(e) => setVpFilter(e.target.value)}
            className="appearance-none rounded-lg border-none bg-surface-container-low px-4 py-2 text-sm font-label-md"
          >
            {vpOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
            <span className="material-symbols-outlined">search</span>
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant..."
            className="w-full rounded-lg border-none bg-surface-container-low py-2 pr-4 pl-10 text-sm"
          />
        </div>
      </div>

      {error ? (
        <div className="border-b border-outline-variant bg-error-container/30 px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low">
              {[
                "Reference",
                "Applicant",
                "Type",
                "Nationality",
                "VP Number",
                "Current Stage",
                "Days",
                "Payment",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-md py-sm text-label-sm uppercase text-on-surface-variant"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-md py-xl text-center text-body-md text-on-surface-variant">
                  Loading applications...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-md py-xl text-center">
                  <p className="text-body-md text-on-surface-variant">No visa applications found.</p>
                  <Link
                    href="/dashboard/visas/new"
                    className="mt-sm inline-flex items-center gap-1 text-label-md font-bold text-primary hover:underline"
                  >
                    Create your first application
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-surface-container">
                  <td className="px-md py-md font-mono text-label-sm text-on-surface">{app.reference}</td>
                  <td className="px-md py-md">
                    <div className="flex items-center gap-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-xs font-bold text-primary">
                        {app.avatarInitials}
                      </div>
                      <span className="text-label-md font-bold">{app.applicantName}</span>
                    </div>
                  </td>
                  <td className="px-md py-md">
                    <span
                      className={[
                        "rounded px-2 py-1 text-[10px] font-bold uppercase",
                        EMPLOYEE_TYPE_CLASS[app.employeeType],
                      ].join(" ")}
                    >
                      {EMPLOYEE_TYPE_LABEL[app.employeeType]}
                    </span>
                  </td>
                  <td className="px-md py-md text-body-sm">{app.nationality}</td>
                  <td className="px-md py-md text-body-sm">{app.vpNumber}</td>
                  <td className="px-md py-md">
                    <span className="rounded-full bg-secondary-container px-3 py-1 text-[11px] font-bold text-on-secondary-container">
                      {app.currentStage}
                    </span>
                  </td>
                  <td
                    className={[
                      "px-md py-md text-body-sm font-bold",
                      app.daysInStage >= 10 ? "text-secondary" : "",
                    ].join(" ")}
                  >
                    {app.daysInStage} Days
                  </td>
                  <td className="px-md py-md">
                    <span
                      className={[
                        "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                        PAYMENT_STATUS_CLASS[app.paymentStatus],
                      ].join(" ")}
                    >
                      {app.paymentStatus}
                    </span>
                  </td>
                  <td className="px-md py-md">
                    <Link
                      href={`/dashboard/visas/${app.id}`}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      View
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EmployeePagination
        page={page}
        totalPages={totalPages}
        from={from}
        to={to}
        total={total}
        onPageChange={setPage}
      />
    </section>
  );
}
