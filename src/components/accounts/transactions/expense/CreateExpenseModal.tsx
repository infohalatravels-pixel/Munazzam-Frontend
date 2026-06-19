"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import { CreateExpensePayload, ExpenseRecord, createExpense } from "@/lib/accounts/transactionsApi";
import { AccountRecord, fetchAccounts } from "@/lib/accounts/api";
import { inputClassName, selectClassName } from "@/components/employees/add-employee/formStyles";

type CreateExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { expense: ExpenseRecord }) => void;
};

function formatAccountLabel(account: AccountRecord) {
  const bank = account.bankName ? ` — ${account.bankName}` : "";
  return `${account.name}${bank} (${account.balance.toLocaleString()} ${account.currency})`;
}

export function CreateExpenseModal({ open, onClose, onCreated }: CreateExpenseModalProps) {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = !isLoadingAccounts && accounts.length > 0;

  useEffect(() => {
    if (!open) return;

    setSourceAccountId("");
    setAmount("");
    setDescription("");
    setError(null);
    setIsSaving(false);
    setIsLoadingAccounts(true);

    fetchAccounts({ status: "ACTIVE" })
      .then((result) => {
        setAccounts(result);
        setSourceAccountId(result[0]?.id ?? "");
      })
      .catch(() => {
        setAccounts([]);
        setError("Failed to load accounts.");
      })
      .finally(() => setIsLoadingAccounts(false));
  }, [open]);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === sourceAccountId) ?? null,
    [accounts, sourceAccountId]
  );

  async function handleSubmit() {
    const parsedAmount = Number(amount);

    if (!sourceAccountId) {
      setError("Select the source account.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid expense amount greater than zero.");
      return;
    }

    if (!description.trim()) {
      setError("Enter a description for the expense.");
      return;
    }

    if (selectedAccount && parsedAmount > selectedAccount.balance) {
      setError("Amount exceeds available balance in the source account.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createExpense({
        sourceAccountId,
        amount: parsedAmount,
        description: description.trim(),
      });

      onCreated(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record expense.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppModal
      open={open}
      title="Record Expense"
      subtitle="Record business expenses and operational costs."
      badge="Expense"
      onClose={onClose}
      maxWidthClassName="max-w-xl"
      footer={
        <ModalFooterActions
          onCancel={onClose}
          onSave={handleSubmit}
          saveLabel="Record Expense"
          savingLabel="Recording..."
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
          <div>
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
          </div>

          {selectedAccount ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm text-body-sm text-on-surface-variant">
              Available balance:{" "}
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
              Description *
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              placeholder="e.g., Office rent, utilities, supplies..."
              className={`${inputClassName} resize-none`}
              required
            />
          </div>
        </div>
      )}
    </AppModal>
  );
}