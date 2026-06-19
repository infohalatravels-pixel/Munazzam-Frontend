"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import {
  createAccount,
  type AccountCategory,
  type AccountType,
  type CreateAccountPayload,
} from "@/lib/accounts/api";
import {
  ACCOUNT_CATEGORY_OPTIONS,
  ACCOUNT_STATUS_OPTIONS,
  getAccountTypeOptions,
} from "@/lib/accounts/constants";
import { inputClassName, selectClassName } from "@/components/employees/add-employee/formStyles";

type AddAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

type FormState = {
  name: string;
  description: string;
  category: AccountCategory;
  accountType: AccountType;
  bankName: string;
  accountNumber: string;
  iban: string;
  openingBalance: string;
  currency: string;
  status: "ACTIVE" | "INACTIVE" | "CLOSED";
  isDefault: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  category: "BANK",
  accountType: "CURRENT",
  bankName: "",
  accountNumber: "",
  iban: "",
  openingBalance: "0",
  currency: "QAR",
  status: "ACTIVE",
  isDefault: false,
};

export function AddAccountModal({ open, onClose, onCreated }: AddAccountModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const accountTypeOptions = useMemo(
    () => getAccountTypeOptions(form.category),
    [form.category]
  );

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setError(null);
    setIsSaving(false);
  }, [open]);

  useEffect(() => {
    const validTypes = accountTypeOptions.map((item) => item.value);
    if (!validTypes.includes(form.accountType)) {
      setForm((prev) => ({
        ...prev,
        accountType: validTypes[0] as AccountType,
      }));
    }
  }, [accountTypeOptions, form.accountType]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError("Account name is required.");
      return;
    }

    if (form.category === "BANK" && !form.bankName.trim()) {
      setError("Bank name is required for bank accounts.");
      return;
    }

    const openingBalance = Number(form.openingBalance);
    if (Number.isNaN(openingBalance) || openingBalance < 0) {
      setError("Opening balance must be a valid number.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload: CreateAccountPayload = {
      name: form.name.trim(),
      category: form.category,
      accountType: form.accountType,
      description: form.description.trim() || undefined,
      currency: form.currency.trim() || "QAR",
      openingBalance,
      balance: openingBalance,
      status: form.status,
      isDefault: form.isDefault,
    };

    if (form.category === "BANK") {
      payload.bankName = form.bankName.trim();
      payload.accountNumber = form.accountNumber.trim() || undefined;
      payload.iban = form.iban.trim() || undefined;
    }

    try {
      await createAccount(payload);
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppModal
      open={open}
      title="Add Account"
      subtitle="Create a bank account or internal system account for your company."
      badge="Accounts & Finance"
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
      footer={
        <ModalFooterActions
          onCancel={onClose}
          onSave={handleSubmit}
          saveLabel="Create Account"
          savingLabel="Creating..."
          isSaving={isSaving}
          error={error}
        />
      }
    >
      <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Account Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="e.g. QNB Main Operating"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Category *
          </label>
          <select
            value={form.category}
            onChange={(event) =>
              updateField("category", event.target.value as AccountCategory)
            }
            className={selectClassName}
          >
            {ACCOUNT_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Account Type *
          </label>
          <select
            value={form.accountType}
            onChange={(event) =>
              updateField("accountType", event.target.value as AccountType)
            }
            className={selectClassName}
          >
            {accountTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {form.category === "BANK" ? (
          <>
            <div>
              <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
                Bank Name *
              </label>
              <input
                type="text"
                value={form.bankName}
                onChange={(event) => updateField("bankName", event.target.value)}
                placeholder="Qatar National Bank"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
                Account Number
              </label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(event) => updateField("accountNumber", event.target.value)}
                placeholder="1234567898820"
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
                IBAN
              </label>
              <input
                type="text"
                value={form.iban}
                onChange={(event) => updateField("iban", event.target.value)}
                placeholder="QA00 XXXX XXXX XXXX XXXX XXXX X"
                className={inputClassName}
              />
            </div>
          </>
        ) : null}

        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Opening Balance
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.openingBalance}
            onChange={(event) => updateField("openingBalance", event.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Currency
          </label>
          <input
            type="text"
            value={form.currency}
            onChange={(event) => updateField("currency", event.target.value.toUpperCase())}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Status
          </label>
          <select
            value={form.status}
            onChange={(event) =>
              updateField("status", event.target.value as FormState["status"])
            }
            className={selectClassName}
          >
            {ACCOUNT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-low px-md py-3">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) => updateField("isDefault", event.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-body-sm text-on-surface">Set as default account</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={3}
            placeholder="Optional notes about this account"
            className={`${inputClassName} resize-none`}
          />
        </div>
      </div>
    </AppModal>
  );
}
