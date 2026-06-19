"use client";

import { useRouter } from "next/navigation";
import {
  PENDING_TRANSACTIONS_DEMO,
  type TransactionTypeConfig,
} from "@/lib/accounts/transactionTypes";
import { PendingTransactionsPreview } from "./PendingTransactionsPreview";
import { TransactionTypesGrid } from "./TransactionTypesGrid";
import { TransactionsHubHeader } from "./TransactionsHubHeader";

const TYPE_ROUTES: Partial<Record<TransactionTypeConfig["id"], string>> = {
  deposit: "/dashboard/accounts/transactions/deposit",
  transfer: "/dashboard/accounts/transactions/transfer",
  payroll: "/dashboard/accounts/transactions/payroll",
  "payroll-reversal": "/dashboard/accounts/transactions/payroll-reversal",
  "freelancer-payments": "/dashboard/accounts/transactions/freelancer-payments",
  expense: "/dashboard/accounts/transactions/expense",
  "document-renewal": "/dashboard/accounts/transactions/document-renewal",
};

export function TransactionsHubPage() {
  const router = useRouter();

  function handleSelectType(config: TransactionTypeConfig) {
    const route = TYPE_ROUTES[config.id];
    if (route) {
      router.push(route);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
      <TransactionsHubHeader />
      <TransactionTypesGrid onSelectType={handleSelectType} />
      <PendingTransactionsPreview transactions={PENDING_TRANSACTIONS_DEMO} />

      <section className="relative mt-2xl hidden h-48 overflow-hidden rounded-3xl md:block lg:h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-container to-primary/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-center px-2xl">
          <h2 className="text-headline-md text-on-primary">Financial Precision</h2>
          <p className="mt-xs max-w-xl text-body-md text-on-primary/80">
            Manage deposits, payroll, expenses, and contractor payments from one unified
            transactions hub.
          </p>
        </div>
      </section>
    </div>
  );
}
