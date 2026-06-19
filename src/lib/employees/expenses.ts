import { apiClient } from "@/lib/auth/apiClient";

export type EmployeeExpenseRecord = {
  id: string;
  reference: string;
  type: string;
  category: string;
  status: "Completed" | "Pending" | "Failed" | "Cancelled" | "Reversed";
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  sourceAccountId: string;
  sourceAccountName: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
  createdById: string;
};

export type EmployeeExpenseListResult = {
  employee: {
    id: string;
    employeeCode: string;
    name: string;
  };
  expenses: EmployeeExpenseRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  from: number;
  to: number;
};

export type EmployeeExpenseListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchEmployeeExpenses(
  employeeId: string,
  query: EmployeeExpenseListQuery = {}
): Promise<EmployeeExpenseListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<EmployeeExpenseListResult>(
    `/api/employees/${employeeId}/expenses${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}
