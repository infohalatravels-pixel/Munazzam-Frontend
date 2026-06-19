"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import { fetchAccounts, type AccountRecord } from "@/lib/accounts/api";
import { createDeposit } from "@/lib/accounts/transactionsApi";
import type { DepositRecord } from "@/lib/accounts/deposits";
import { inputClassName, selectClassName } from "@/components/employees/add-employee/formStyles";

type CreateDepositModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { deposit: DepositRecord }) => void;
};

function formatAccountLabel(account: AccountRecord) {
  const bank = account.bankName ? ` — ${account.bankName}` : "";
  return `${account.name}${bank} (${account.balance.toLocaleString()} ${account.currency})`;
}

export function CreateDepositModal({ open, onClose, onCreated }: CreateDepositModalProps) {
  const [bankAccounts, setBankAccounts] = useState<AccountRecord[]>([]);
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = !isLoadingAccounts && bankAccounts.length > 0;

  useEffect(() => {
    if (!open) return;

    setDestinationAccountId("");
    setAmount("");
    setDescription("");
    setError(null);
    setIsSaving(false);
    setIsLoadingAccounts(true);

    fetchAccounts({ status: "ACTIVE", category: "BANK" })
      .then((result) => {
        setBankAccounts(result);
        setDestinationAccountId(result[0]?.id ?? "");
      })
      .catch(() => {
        setBankAccounts([]);
        setError("Failed to load bank accounts.");
      })
      .finally(() => setIsLoadingAccounts(false));
  }, [open]);

  useEffect(() => {
    if (!bankAccounts.length) {
      setDestinationAccountId("");
      return;
    }

    if (!bankAccounts.some((account) => account.id === destinationAccountId)) {
      setDestinationAccountId(bankAccounts[0].id);
    }
  }, [bankAccounts, destinationAccountId]);

  const selectedAccount = useMemo(
    () => bankAccounts.find((account) => account.id === destinationAccountId) ?? null,
    [bankAccounts, destinationAccountId]
  );

  async function handleSubmit() {
    const parsedAmount = Number(amount);

    if (!destinationAccountId) {
      setError("Select the bank account to deposit into.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid deposit amount greater than zero.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createDeposit({
        destinationAccountId,
        amount: parsedAmount,
        description: description.trim() || undefined,
      });

      onCreated(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record deposit.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppModal
      open={open}
      title="Record Deposit"
      subtitle="Deposit funds directly into a bank account."
      badge="Deposit"
      onClose={onClose}
      maxWidthClassName="max-w-xl"
      footer={
        <ModalFooterActions
          onCancel={onClose}
          onSave={handleSubmit}
          saveLabel="Submit Deposit"
          savingLabel="Submitting..."
          isSaving={isSaving}
          disabled={!canSubmit}
          error={error}
        />
      }
    >
      {isLoadingAccounts ? (
        <p className="text-body-md text-on-surface-variant">Loading bank accounts...</p>
      ) : (
        <div className="space-y-lg">
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Destination Bank Account *
            </label>
            <select
              value={destinationAccountId}
              onChange={(event) => {
                setDestinationAccountId(event.target.value);
                setError(null);
              }}
              disabled={bankAccounts.length === 0}
              className={selectClassName}
            >
              {bankAccounts.length === 0 ? (
                <option value="">No active bank accounts available</option>
              ) : (
                bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {formatAccountLabel(account)}
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedAccount ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm text-body-sm text-on-surface-variant">
              Current balance:{" "}
              <span className="font-semibold text-on-surface">
                {selectedAccount.balance.toLocaleString()} {selectedAccount.currency}
              </span>
            </div>
          ) : null}

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
