"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MAIN_NAV_ITEMS } from "@/lib/dashboard/navigation";

export function useDashboardTitle() {
  const pathname = usePathname();

  if (pathname === "/dashboard") return "Dashboard";

  if (pathname === "/dashboard/accounts") return "Accounts & Finance";

  if (pathname.startsWith("/dashboard/visas/allocations")) {
    return "VP Allocations";
  }

  if (pathname.startsWith("/dashboard/visas/new")) {
    return "New Visa Application";
  }

  if (pathname.startsWith("/dashboard/visas/") && pathname !== "/dashboard/visas") {
    return "Visa Application";
  }

  if (pathname.startsWith("/dashboard/visas")) {
    return "Visas";
  }

  if (pathname.startsWith("/dashboard/accounts/list")) {
    return "All Accounts";
  }

  if (pathname.startsWith("/dashboard/accounts/") && pathname.endsWith("/ledger")) {
    return "Account Ledger";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/all")) {
    return "All Transactions";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/deposit")) {
    return "Deposit";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/transfer")) {
    return "Transfer";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/payroll-reversal")) {
    return "Payroll Reversal";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/payroll")) {
    return "Payroll";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/freelancer-payments")) {
    return "Freelancer Payments";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/expense")) {
    return "Expense Management";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions/document-renewal")) {
    return "Document Renewal";
  }

  if (pathname.startsWith("/dashboard/accounts/transactions")) {
    return "Transactions Hub";
  }

  if (pathname.startsWith("/dashboard/employees/") && pathname !== "/dashboard/employees") {
    return "Employee Profile";
  }

  if (pathname.startsWith("/dashboard/documents/employees/") && pathname !== "/dashboard/documents/employees") {
    return "Employee Document Records";
  }

  if (pathname.startsWith("/dashboard/documents/company")) {
    return "Company Documents";
  }

  if (pathname.startsWith("/dashboard/documents/employees")) {
    return "Employee Documents";
  }

  if (pathname.startsWith("/dashboard/documents")) {
    return "Documents Hub";
  }

  const section = pathname.split("/").pop();
  const match = MAIN_NAV_ITEMS.find((item) => item.id === section);
  return match?.label ?? "Dashboard";
}

export function DashboardTitleSync() {
  const title = useDashboardTitle();

  useEffect(() => {
    document.title = `${title} | Munazzam`;
  }, [title]);

  return null;
}
