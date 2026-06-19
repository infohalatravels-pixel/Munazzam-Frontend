"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FreelancerPaymentRecord,
  CreateFreelancerPaymentPayload,
  fetchFreelancerPayments,
  createFreelancerPayment,
} from "@/lib/accounts/transactionsApi";
import { FreelancerPaymentsPageHeader } from "./FreelancerPaymentsPageHeader";
import { FreelancerPaymentsTable } from "./FreelancerPaymentsTable";
import { CreateFreelancerPaymentModal } from "./CreateFreelancerPaymentModal";

const PAGE_SIZE = 5;

export function FreelancerPaymentsPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [payments, setPayments] = useState<FreelancerPaymentRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadPayments = useCallback(async (nextPage: number, nextSearch: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFreelancerPayments({
        page: nextPage,
        limit: PAGE_SIZE,
        search: nextSearch,
      });

      setPayments(result.payments);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      setPayments([]);
      setTotal(0);
      setTotalPages(1);
      setError(err instanceof Error ? err.message : "Failed to load freelancer payments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments(page, search);
  }, [loadPayments, page, search]);

  const handlePaymentCreated = useCallback(
    (result: { payment: FreelancerPaymentRecord }) => {
      const { payment } = result;
      setSuccessMessage(
        `Payment of ${payment.amount.toLocaleString()} ${payment.currency} from ${payment.employeeName} recorded. Account balance updated.`
      );
      if (page === 1) {
        loadPayments(1, search);
      } else {
        setPage(1);
      }
    },
    [loadPayments, page, search]
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <Link
          href="/dashboard/accounts/transactions"
          className="mb-md inline-flex items-center gap-xs text-label-md text-primary md:hidden"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Transactions
        </Link>

        <FreelancerPaymentsPageHeader />

        {successMessage ? (
          <div className="mb-lg rounded-lg border border-emerald-200 bg-emerald-50 px-md py-sm text-body-sm text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        {error ? (
          <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <div className="mb-lg flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setSuccessMessage(null);
              setShowModal(true);
            }}
            className="flex min-h-11 w-full items-center justify-center gap-xs rounded-lg bg-primary px-lg py-2.5 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98] sm:w-auto"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Record Payment
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard/accounts/transactions")}
            className="hidden min-h-11 items-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container sm:inline-flex"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to Hub
          </button>
        </div>

        <FreelancerPaymentsTable
          payments={payments}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          total={total}
          search={search}
          onPageChange={setPage}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      </div>

      <CreateFreelancerPaymentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handlePaymentCreated}
      />
    </>
  );
}