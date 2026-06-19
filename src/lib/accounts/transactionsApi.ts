import { apiClient } from "@/lib/auth/apiClient";
import type { DepositRecord } from "@/lib/accounts/deposits";

export type DepositListResult = {
  deposits: DepositRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateDepositPayload = {
  destinationAccountId: string;
  amount: number;
  description?: string;
};

export type CreateDepositResult = {
  deposit: DepositRecord;
  account: {
    id: string;
    balance: number;
    currency: string;
  };
};

export type DepositListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchDeposits(
  query: DepositListQuery = {}
): Promise<DepositListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<DepositListResult>(
    `/api/transactions/deposits${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function createDeposit(
  payload: CreateDepositPayload
): Promise<CreateDepositResult> {
  return apiClient<CreateDepositResult>("/api/transactions/deposits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type TransferRecord = {
  id: string;
  reference: string;
  type: "TRANSFER_IN" | "TRANSFER_OUT";
  status: "Completed" | "Pending" | "Failed" | "Cancelled" | "Reversed";
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  accountId: string;
  accountName: string;
  accountCategory: "BANK" | "INTERNAL";
  sourceAccountId: string;
  sourceAccountName: string;
  destinationAccountId: string;
  destinationAccountName: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
  createdById: string;
};

export type TransferListResult = {
  transfers: TransferRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateTransferPayload = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
};

export type CreateTransferResult = {
  transfer: {
    reference: string;
    transferOut: TransferRecord;
    transferIn: TransferRecord;
  };
  accounts: {
    source: {
      id: string;
      balance: number;
      currency: string;
    };
    destination: {
      id: string;
      balance: number;
      currency: string;
    };
  };
};

export type TransferListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchTransfers(
  query: TransferListQuery = {}
): Promise<TransferListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<TransferListResult>(
    `/api/transactions/transfers${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function createTransfer(
  payload: CreateTransferPayload
): Promise<CreateTransferResult> {
  return apiClient<CreateTransferResult>("/api/transactions/transfers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type EligibleEmployee = {
  id: string;
  employeeCode: string;
  nameAsPassport: string;
  designation: string | null;
  salary: number;
  lastSalaryTransferDate: string | null;
  daysSinceLastTransfer: number | null;
  isEligible: boolean;
  daysRemaining: number;
};

export type PayrollRecord = {
  id: string;
  reference: string;
  type: string;
  status: "Completed" | "Pending" | "Failed" | "Cancelled" | "Reversed";
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  sourceAccountId: string;
  sourceAccountName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
  createdById: string;
};

export type PayrollListResult = {
  payrolls: PayrollRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreatePayrollPayload = {
  employeeId: string;
  sourceAccountId: string;
  amount: number;
  description?: string;
};

export type CreatePayrollResult = {
  payroll: PayrollRecord;
  account: {
    id: string;
    balance: number;
    currency: string;
  };
  employee: {
    id: string;
    lastSalaryTransferDate: string;
  };
};

export type PayrollListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchEligibleEmployees(): Promise<{ employees: EligibleEmployee[] }> {
  return apiClient<{ employees: EligibleEmployee[] }>("/api/transactions/employees/eligible", {
    method: "GET"
  });
}

export async function fetchPayrolls(
  query: PayrollListQuery = {}
): Promise<PayrollListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<PayrollListResult>(
    `/api/transactions/payroll${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function createPayroll(
  payload: CreatePayrollPayload
): Promise<CreatePayrollResult> {
  return apiClient<CreatePayrollResult>("/api/transactions/payroll", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type ReversibleEmployee = {
  id: string;
  employeeCode: string;
  nameAsPassport: string;
  designation: string | null;
  salary: number;
  lastSalaryTransferDate: string;
  lastPayrollAmount: number;
  lastPayrollReference: string | null;
  lastPayrollDate: string;
};

export type PayrollReversalRecord = {
  id: string;
  reference: string;
  type: string;
  status: "Completed" | "Pending" | "Failed" | "Cancelled" | "Reversed";
  amount: number;
  deduction: number;
  netAmount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  destinationAccountId: string;
  destinationAccountName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
  createdById: string;
};

export type PayrollReversalListResult = {
  reversals: PayrollReversalRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreatePayrollReversalPayload = {
  employeeId: string;
  destinationAccountId: string;
  amount: number;
  deduction?: number;
  description?: string;
};

export type CreatePayrollReversalResult = {
  reversal: PayrollReversalRecord;
  account: {
    id: string;
    balance: number;
    currency: string;
  };
};

export type PayrollReversalListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchReversibleEmployees(): Promise<{ employees: ReversibleEmployee[] }> {
  return apiClient<{ employees: ReversibleEmployee[] }>("/api/transactions/employees/reversible", {
    method: "GET"
  });
}

export async function fetchPayrollReversals(
  query: PayrollReversalListQuery = {}
): Promise<PayrollReversalListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<PayrollReversalListResult>(
    `/api/transactions/payroll-reversal${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function createPayrollReversal(
  payload: CreatePayrollReversalPayload
): Promise<CreatePayrollReversalResult> {
  return apiClient<CreatePayrollReversalResult>("/api/transactions/payroll-reversal", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type FreelancerEmployee = {
  id: string;
  employeeCode: string;
  nameAsPassport: string;
  designation: string | null;
  nationality: string | null;
  phoneNo: string;
  joinDate: string;
  visaNumber: string;
  visaExpiryDate: string;
};

export type FreelancerPaymentRecord = {
  id: string;
  reference: string;
  type: string;
  status: "Completed" | "Pending" | "Failed" | "Cancelled" | "Reversed";
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  destinationAccountId: string;
  destinationAccountName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
  createdById: string;
};

export type FreelancerPaymentListResult = {
  payments: FreelancerPaymentRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateFreelancerPaymentPayload = {
  employeeId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
};

export type CreateFreelancerPaymentResult = {
  payment: FreelancerPaymentRecord;
  account: {
    id: string;
    balance: number;
    currency: string;
  };
};

export type FreelancerPaymentListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchFreelancerEmployees(): Promise<{ employees: FreelancerEmployee[] }> {
  return apiClient<{ employees: FreelancerEmployee[] }>("/api/transactions/employees/freelancers", {
    method: "GET"
  });
}

export async function fetchFreelancerPayments(
  query: FreelancerPaymentListQuery = {}
): Promise<FreelancerPaymentListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<FreelancerPaymentListResult>(
    `/api/transactions/freelancer-payments${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function createFreelancerPayment(
  payload: CreateFreelancerPaymentPayload
): Promise<CreateFreelancerPaymentResult> {
  return apiClient<CreateFreelancerPaymentResult>("/api/transactions/freelancer-payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type ExpenseRecord = {
  id: string;
  reference: string;
  type: string;
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

export type ExpenseListResult = {
  expenses: ExpenseRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateExpensePayload = {
  sourceAccountId: string;
  amount: number;
  description?: string;
};

export type CreateExpenseResult = {
  expense: ExpenseRecord;
  account: {
    id: string;
    balance: number;
    currency: string;
  };
};

export type ExpenseListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchExpenses(
  query: ExpenseListQuery = {}
): Promise<ExpenseListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<ExpenseListResult>(
    `/api/transactions/expenses${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function createExpense(
  payload: CreateExpensePayload
): Promise<CreateExpenseResult> {
  return apiClient<CreateExpenseResult>("/api/transactions/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type DocumentRenewalEmployee = {
  id: string;
  employeeCode: string;
  nameAsPassport: string;
  designation: string | null;
  nationality: string | null;
  visaNumber: string;
  visaExpiryDate: string;
};

export type DocumentRenewalRecord = {
  id: string;
  reference: string;
  type: string;
  status: "Completed" | "Pending" | "Failed" | "Cancelled" | "Reversed";
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  sourceAccountId: string;
  sourceAccountName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
  createdById: string;
};

export type DocumentRenewalListResult = {
  renewals: DocumentRenewalRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateDocumentRenewalPayload = {
  employeeId: string;
  sourceAccountId: string;
  amount: number;
  description?: string;
};

export type CreateDocumentRenewalResult = {
  renewal: DocumentRenewalRecord;
  account: {
    id: string;
    balance: number;
    currency: string;
  };
};

export type DocumentRenewalListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function fetchDocumentRenewalEmployees(): Promise<{
  employees: DocumentRenewalEmployee[];
}> {
  return apiClient<{ employees: DocumentRenewalEmployee[] }>(
    "/api/transactions/employees/document-renewal",
    { method: "GET" }
  );
}

export async function fetchDocumentRenewals(
  query: DocumentRenewalListQuery = {}
): Promise<DocumentRenewalListResult> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return apiClient<DocumentRenewalListResult>(
    `/api/transactions/document-renewal${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function createDocumentRenewal(
  payload: CreateDocumentRenewalPayload
): Promise<CreateDocumentRenewalResult> {
  return apiClient<CreateDocumentRenewalResult>("/api/transactions/document-renewal", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
