"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAccountStats, type AccountStats } from "@/lib/accounts/api";
import { fetchDocumentsHub, type DocumentsHubResponse } from "@/lib/documents/api";
import {
  fetchEmployeeStats,
  fetchEmployees,
  type EmployeeRecord,
  type EmployeeStats,
} from "@/lib/employees/api";

export type DashboardOverviewState = {
  employeeStats: EmployeeStats | null;
  accountStats: AccountStats | null;
  documentsHub: DocumentsHubResponse | null;
  employees: EmployeeRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useDashboardOverview(): DashboardOverviewState {
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
  const [documentsHub, setDocumentsHub] = useState<DocumentsHubResponse | null>(null);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [stats, accounts, hub, employeeList] = await Promise.all([
        fetchEmployeeStats(),
        fetchAccountStats(),
        fetchDocumentsHub(),
        fetchEmployees({ limit: 200, employmentStatus: "ACTIVE" }),
      ]);

      setEmployeeStats(stats);
      setAccountStats(accounts);
      setDocumentsHub(hub);
      setEmployees(employeeList.employees);
    } catch (err) {
      setEmployeeStats(null);
      setAccountStats(null);
      setDocumentsHub(null);
      setEmployees([]);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    employeeStats,
    accountStats,
    documentsHub,
    employees,
    isLoading,
    error,
    refresh: load,
  };
}
