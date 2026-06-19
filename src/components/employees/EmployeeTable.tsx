"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  bulkDeleteEmployees,
  downloadEmployeesCsv,
  fetchDepartments,
  fetchEmployees,
  VISA_STATUS_FILTER_OPTIONS,
  type Department,
  type EmployeeListQuery,
  type EmployeeRecord,
} from "@/lib/employees/api";
import { EmployeeFilterChips } from "./EmployeeFilterChips";
import { EmployeePagination } from "./EmployeePagination";
import { EmployeeTableRow } from "./EmployeeTableRow";

type EmployeeTableProps = {
  refreshKey?: number;
};

type ActiveFilter = {
  id: string;
  label: string;
  type: "department" | "visa";
};

export function EmployeeTable({ refreshKey = 0 }: EmployeeTableProps) {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
    from: 0,
    to: 0,
  });
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [visaStatus, setVisaStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const query = useMemo<EmployeeListQuery>(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      search: search.trim() || undefined,
      departmentId: departmentId || undefined,
      visaStatus: visaStatus || undefined,
    }),
    [pagination.page, pagination.limit, search, departmentId, visaStatus]
  );

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchEmployees(query);
      setEmployees(result.employees);
      setPagination(result.pagination);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadEmployees, refreshKey]);

  const activeFilters = useMemo(() => {
    const filters: ActiveFilter[] = [];
    if (departmentId) {
      const dept = departments.find((item) => item.id === departmentId);
      if (dept) filters.push({ id: "department", label: `Dept: ${dept.name}`, type: "department" });
    }
    if (visaStatus) {
      const visa = VISA_STATUS_FILTER_OPTIONS.find((item) => item.value === visaStatus);
      if (visa) filters.push({ id: "visa", label: `Visa: ${visa.label}`, type: "visa" });
    }
    return filters;
  }, [departmentId, visaStatus, departments]);

  const allSelected =
    employees.length > 0 && employees.every((employee) => selectedIds.has(employee.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(employees.map((employee) => employee.id)));
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeFilter(filter: ActiveFilter) {
    if (filter.type === "department") setDepartmentId("");
    if (filter.type === "visa") setVisaStatus("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  function clearAllFilters() {
    setDepartmentId("");
    setVisaStatus("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  async function handleExport() {
    try {
      await downloadEmployeesCsv({
        search: search.trim() || undefined,
        departmentId: departmentId || undefined,
        visaStatus: visaStatus || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) {
      setError("Select at least one employee to delete.");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await bulkDeleteEmployees(Array.from(selectedIds));
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-white card-shadow">
      {error ? (
        <div className="border-b border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col items-center justify-between gap-md border-b border-outline-variant p-md md:flex-row">
        <div className="flex w-full items-center gap-sm md:w-auto">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-sm text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder="Search by name, ID, or position..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pr-4 pl-10 text-body-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex shrink-0 items-center gap-xs rounded-lg border border-outline-variant px-md py-2 text-label-md transition-all hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filters
          </button>
        </div>

        <div className="flex w-full items-center justify-end gap-sm md:w-auto">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-xs rounded-lg border border-outline-variant px-md py-2 text-label-md transition-all hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
          <div className="mx-1 h-6 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={isDeleting || selectedIds.size === 0}
            className="rounded-lg p-2 text-on-surface-variant transition-all hover:bg-surface-container disabled:opacity-40"
            title="Bulk Delete"
            aria-label="Bulk delete"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      {showFilters ? (
        <div className="grid grid-cols-1 gap-md border-b border-outline-variant bg-surface-container-low px-md py-md md:grid-cols-2">
          <div>
            <label className="mb-xs block text-label-sm text-on-surface-variant">
              Department
            </label>
            <select
              value={departmentId}
              onChange={(event) => {
                setDepartmentId(event.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full rounded-lg border border-outline-variant bg-white px-md py-2 text-body-sm"
            >
              <option value="">All departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-xs block text-label-sm text-on-surface-variant">
              Visa Status
            </label>
            <select
              value={visaStatus}
              onChange={(event) => {
                setVisaStatus(event.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full rounded-lg border border-outline-variant bg-white px-md py-2 text-body-sm"
            >
              {VISA_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <EmployeeFilterChips
        filters={activeFilters}
        onRemove={(id) => {
          const filter = activeFilters.find((item) => item.id === id);
          if (filter) removeFilter(filter);
        }}
        onClearAll={clearAllFilters}
      />

      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface">
              <th className="w-10 px-md py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                  aria-label="Select all employees"
                />
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Employee ID
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Name
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Nationality
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Department
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Position
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Visa Status
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Joined Date
              </th>
              <th className="px-md py-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                Last Salary Transfer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-md py-xl text-center text-body-md text-on-surface-variant">
                  Loading employees...
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((employee) => (
                <EmployeeTableRow
                  key={employee.id}
                  employee={employee}
                  selected={selectedIds.has(employee.id)}
                  onToggleSelect={() => toggleSelect(employee.id)}
                  onNavigate={() => router.push(`/dashboard/employees/${employee.id}`)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-md py-xl text-center text-body-md text-on-surface-variant">
                  No employees match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EmployeePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        from={pagination.from}
        to={pagination.to}
        total={pagination.total}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );
}
