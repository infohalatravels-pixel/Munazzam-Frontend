"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchTransfers } from "@/lib/accounts/transactionsApi";
import type { TransferRecord } from "@/lib/accounts/transactionsApi";
import { CreateTransferModal } from "./CreateTransferModal";
import { TransfersTable } from "./TransfersTable";
import { TransferPageHeader } from "./TransferPageHeader";

const PAGE_SIZE = 5;

export function TransferPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadTransfers = useCallback(async (nextPage: number, nextSearch: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchTransfers({
        page: nextPage,
        limit: PAGE_SIZE,
        search: nextSearch,
      });

      setTransfers(result.transfers);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      setTransfers([]);
      setTotal(0);
      setTotalPages(1);
      setError(err instanceof Error ? err.message : "Failed to load transfers.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransfers(page, search);
  }, [loadTransfers, page, search]);

  const handleTransferCreated = useCallback(
    (result: { transfer: { reference: string; transferOut: TransferRecord; transferIn: TransferRecord } }) => {
      const { transfer } = result;
      setSuccessMessage(
        `Transfer ${transfer.reference} completed: ${transfer.transferOut.amount.toLocaleString()} ${transfer.transferOut.currency} moved from ${transfer.transferOut.sourceAccountName} to ${transfer.transferIn.destinationAccountName}.`
      );
      if (page === 1) {
        loadTransfers(1, search);
      } else {
        setPage(1);
      }
    },
    [loadTransfers, page, search]
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

        <TransferPageHeader />

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
            <span className="material-symbols-outlined text-[20px]">sync_alt</span>
            Record Transfer
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

        <TransfersTable
          transfers={transfers}
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

      <CreateTransferModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleTransferCreated}
      />
    </>
  );
}
