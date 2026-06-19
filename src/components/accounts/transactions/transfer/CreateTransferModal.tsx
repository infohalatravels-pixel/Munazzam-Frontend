"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import { fetchAccounts, type AccountRecord } from "@/lib/accounts/api";
import { createTransfer } from "@/lib/accounts/transactionsApi";
import type { TransferRecord } from "@/lib/accounts/transactionsApi";
import { inputClassName, selectClassName } from "@/components/employees/add-employee/formStyles";

type CreateTransferModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { transfer: { reference: string; transferOut: TransferRecord; transferIn: TransferRecord } }) => void;
};

function formatAccountLabel(account: AccountRecord) {
  const bank = account.bankName ? ` — ${account.bankName}` : "";
  const categoryLabel = account.category === "BANK" ? "Bank" : "Internal";
  return `${account.name}${bank} (${account.balance.toLocaleString()} ${account.currency}) [${categoryLabel}]`;
}

export function CreateTransferModal({ open, onClose, onCreated }: CreateTransferModalProps) {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = !isLoadingAccounts && accounts.length > 0;

  useEffect(() => {
    if (!open) return;

    setSourceAccountId("");
    setDestinationAccountId("");
    setAmount("");
    setDescription("");
    setError(null);
    setIsSaving(false);
    setIsLoadingAccounts(true);

    fetchAccounts({ status: "ACTIVE" })
      .then((result) => {
        setAccounts(result);
        // Set first available account as source
        setSourceAccountId(result[0]?.id ?? "");
        // Set second account as destination, or first if only one account
        setDestinationAccountId(result[1]?.id ?? result[0]?.id ?? "");
      })
      .catch(() => {
        setAccounts([]);
        setError("Failed to load accounts.");
      })
      .finally(() => setIsLoadingAccounts(false));
  }, [open]);

  const selectedSourceAccount = useMemo(
    () => accounts.find((account) => account.id === sourceAccountId) ?? null,
    [accounts, sourceAccountId]
  );

  const selectedDestinationAccount = useMemo(
    () => accounts.find((account) => account.id === destinationAccountId) ?? null,
    [accounts, destinationAccountId]
  );

  // Available destination accounts (exclude the selected source)
  const availableDestinationAccounts = useMemo(
    () => accounts.filter((account) => account.id !== sourceAccountId),
    [accounts, sourceAccountId]
  );

  // Update destination if it becomes unavailable
  useEffect(() => {
    if (destinationAccountId && !availableDestinationAccounts.some(acc => acc.id === destinationAccountId)) {
      setDestinationAccountId(availableDestinationAccounts[0]?.id ?? "");
    }
  }, [destinationAccountId, availableDestinationAccounts]);

  async function handleSubmit() {
    const parsedAmount = Number(amount);

    if (!sourceAccountId) {
      setError("Select the source account.");
      return;
    }

    if (!destinationAccountId) {
      setError("Select the destination account.");
      return;
    }

    if (sourceAccountId === destinationAccountId) {
      setError("Source and destination accounts must be different.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid transfer amount greater than zero.");
      return;
    }

    if (selectedSourceAccount && parsedAmount > selectedSourceAccount.balance) {
      setError("Amount exceeds available balance in the source account.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createTransfer({
        sourceAccountId,
        destinationAccountId,
        amount: parsedAmount,
        description: description.trim() || undefined,
      });

      onCreated(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete transfer.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppModal
      open={open}
      title="Record Transfer"
      subtitle="Move funds between bank and internal system accounts."
      badge="Transfer"
      onClose={onClose}
      maxWidthClassName="max-w-xl"
      footer={
        <ModalFooterActions
          onCancel={onClose}
          onSave={handleSubmit}
          saveLabel="Complete Transfer"
          savingLabel="Processing..."
          isSaving={isSaving}
          disabled={!canSubmit}
          error={error}
        />
      }
    >
      {isLoadingAccounts ? (
        <p className="text-body-md text-on-surface-variant">Loading accounts...</p>
      ) : (
        <div className="space-y-lg">
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <p className="mb-md text-label-sm font-semibold text-on-surface-variant uppercase">
              Transfer From (Source)
            </p>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Source Account *
            </label>
            <select
              value={sourceAccountId}
              onChange={(event) => {
                setSourceAccountId(event.target.value);
                setError(null);
              }}
              disabled={accounts.length === 0}
              className={selectClassName}
            >
              {accounts.length === 0 ? (
                <option value="">No active accounts available</option>
              ) : (
                accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {formatAccountLabel(account)}
                  </option>
                ))
              )}
            </select>
            {selectedSourceAccount ? (
              <div className="mt-sm rounded-lg bg-surface-container px-sm py-xs text-body-sm text-on-surface-variant">
                Available balance:{" "}
                <span className="font-semibold text-on-surface">
                  {selectedSourceAccount.balance.toLocaleString()} {selectedSourceAccount.currency}
                </span>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-md">
            <p className="mb-md text-label-sm font-semibold text-primary uppercase">
              Transfer To (Destination)
            </p>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Destination Account *
            </label>
            <select
              value={destinationAccountId}
              onChange={(event) => {
                setDestinationAccountId(event.target.value);
                setError(null);
              }}
              disabled={availableDestinationAccounts.length === 0}
              className={selectClassName}
            >
              {availableDestinationAccounts.length === 0 ? (
                <option value="">No other accounts available</option>
              ) : (
                availableDestinationAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {formatAccountLabel(account)}
                  </option>
                ))
              )}
            </select>
            {selectedDestinationAccount ? (
              <div className="mt-sm rounded-lg bg-primary-container/30 px-sm py-xs text-body-sm text-on-surface-variant">
                Current balance:{" "}
                <span className="font-semibold text-on-surface">
                  {selectedDestinationAccount.balance.toLocaleString()} {selectedDestinationAccount.currency}
                </span>
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Amount *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError(null);
              }}
              placeholder="0.00"
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Notes
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              placeholder="Optional description"
              className={`${inputClassName} resize-none`}
            />
          </div>
        </div>
      )}
    </AppModal>
  );
}