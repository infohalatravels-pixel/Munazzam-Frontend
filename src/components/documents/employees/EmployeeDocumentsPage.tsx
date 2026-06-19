"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchEmployees, type EmployeeRecord } from "@/lib/employees/api";
import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { EmployeeDocumentsPageHeader } from "./EmployeeDocumentsPageHeader";
import { EmployeeDocumentCard } from "./EmployeeDocumentCard";

const PAGE_SIZE = 12;

export function EmployeeDocumentsPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async (nextPage: number, nextSearch: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchEmployees({
        page: nextPage,
        limit: PAGE_SIZE,
        search: nextSearch || undefined,
        employmentStatus: "ACTIVE",
      });

      setEmployees(result.employees);
      setPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (err) {
      setEmployees([]);
      setTotal(0);
      setTotalPages(1);
      setError(err instanceof Error ? err.message : "Failed to load employees.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees(page, search);
  }, [loadEmployees, page, search]);

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
      <Link
        href="/dashboard/documents"
        className="mb-md inline-flex items-center gap-xs text-label-md text-primary md:hidden"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Documents
      </Link>

      <EmployeeDocumentsPageHeader />

      {error ? (
        <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="mb-xl flex flex-col gap-md rounded-2xl border border-outline-variant bg-surface p-md shadow-sm sm:flex-row sm:items-center">
        <div className="relative min-w-[280px] flex-1">
          <span className="material-symbols-outlined absolute top-1/2 left-md -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search employees by name, ID, or department..."
            className="w-full rounded-xl border border-outline-variant bg-background py-sm pr-md pl-12 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/documents")}
          className="hidden min-h-11 items-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container sm:inline-flex"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Hub
        </button>
      </div>

      {isLoading ? (
        <p className="py-xl text-center text-body-md text-on-surface-variant">
          Loading employees...
        </p>
      ) : employees.length === 0 ? (
        <p className="py-xl text-center text-body-md text-on-surface-variant">
          No employees found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {employees.map((employee) => (
            <EmployeeDocumentCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}

      <EmployeePagination
        page={page}
        totalPages={totalPages}
        from={from}
        to={to}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
