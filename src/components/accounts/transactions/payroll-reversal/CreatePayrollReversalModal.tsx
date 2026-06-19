"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import { fetchAccounts, type AccountRecord } from "@/lib/accounts/api";
import { fetchReversibleEmployees, createPayrollReversal } from "@/lib/accounts/transactionsApi";
import type { ReversibleEmployee, PayrollReversalRecord } from "@/lib/accounts/transactionsApi";
import { inputClassName, selectClassName } from "@/components/employees/add-employee/formStyles";
import { formatTransactionAmount } from "@/lib/accounts/formatters";
import { formatDepositDate } from "@/lib/accounts/deposits";
import { ReversibleEmployeeSelectionTable } from "./ReversibleEmployeeSelectionTable";

type CreatePayrollReversalModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { reversal: PayrollReversalRecord }) => void;
};

enum ModalStep {
  EMPLOYEE_SELECTION = "employee_selection",
  REVERSAL_FORM = "reversal_form",
}

function formatAccountLabel(account: AccountRecord) {
  const bank = account.bankName ? ` — ${account.bankName}` : "";
  const categoryLabel = account.category === "BANK" ? "Bank" : "Internal";
  return `${account.name}${bank} (${account.balance.toLocaleString()} ${account.currency}) [${categoryLabel}]`;
}

export function CreatePayrollReversalModal({ open, onClose, onCreated }: CreatePayrollReversalModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>(ModalStep.EMPLOYEE_SELECTION);
  const [employees, setEmployees] = useState<ReversibleEmployee[]>([]);
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<ReversibleEmployee | null>(null);
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [deduction, setDeduction] = useState("0");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canProceedToForm = selectedEmployee !== null;
  const canSubmit = !isLoadingAccounts && accounts.length > 0 && destinationAccountId && amount;

  const netAmount = useMemo(() => {
    const amountVal = Number(amount) || 0;
    const deductionVal = Number(deduction) || 0;
    return Math.max(0, amountVal - deductionVal);
  }, [amount, deduction]);

  useEffect(() => {
    if (!open) return;

    // Reset state
    setCurrentStep(ModalStep.EMPLOYEE_SELECTION);
    setSelectedEmployee(null);
    setDestinationAccountId("");
    setAmount("");
    setDeduction("0");
    setDescription("");
    setError(null);
    setIsSaving(false);
    setIsLoadingEmployees(true);

    // Load reversible employees
    fetchReversibleEmployees()
      .then((result) => {
        setEmployees(result.employees);
      })
      .catch(() => {
        setEmployees([]);
        setError("Failed to load employees.");
      })
      .finally(() => setIsLoadingEmployees(false));
  }, [open]);

  const handleEmployeeSelected = (employee: ReversibleEmployee) => {
    setSelectedEmployee(employee);
    setAmount(String(employee.lastPayrollAmount));
    setCurrentStep(ModalStep.REVERSAL_FORM);
    setError(null);
    setIsLoadingAccounts(true);

    // Load accounts when moving to reversal form
    fetchAccounts({ status: "ACTIVE" })
      .then((result) => {
        setAccounts(result);
        setDestinationAccountId(result[0]?.id ?? "");
      })
      .catch(() => {
        setAccounts([]);
        setError("Failed to load accounts.");
      })
      .finally(() => setIsLoadingAccounts(false));
  };

  const handleBackToEmployeeSelection = () => {
    setCurrentStep(ModalStep.EMPLOYEE_SELECTION);
    setSelectedEmployee(null);
    setDestinationAccountId("");
    setAmount("");
    setDeduction("0");
    setDescription("");
    setError(null);
  };

  const selectedDestinationAccount = useMemo(
    () => accounts.find((account) => account.id === destinationAccountId) ?? null,
    [accounts, destinationAccountId]
  );

  async function handleSubmit() {
    if (!selectedEmployee) {
      setError("No employee selected.");
      return;
    }

    const parsedAmount = Number(amount);
    const parsedDeduction = Number(deduction);

    if (!destinationAccountId) {
      setError("Select the destination account.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid reversal amount greater than zero.");
      return;
    }

    if (Number.isNaN(parsedDeduction) || parsedDeduction < 0) {
      setError("Deduction amount must be zero or positive.");
      return;
    }

    if (parsedAmount > selectedEmployee.lastPayrollAmount) {
      setError(`Reversal amount cannot exceed last payroll amount (${selectedEmployee.lastPayrollAmount.toLocaleString()}).`);
      return;
    }

    if (parsedDeduction >= parsedAmount) {
      setError("Deduction cannot be equal to or greater than the reversal amount.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createPayrollReversal({
        employeeId: selectedEmployee.id,
        destinationAccountId,
        amount: parsedAmount,
        deduction: parsedDeduction,
        description: description.trim() || undefined,
      });

      onCreated(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process payroll reversal.");
    } finally {
      setIsSaving(false);
    }
  }

  const getModalTitle = () => {
    switch (currentStep) {
      case ModalStep.EMPLOYEE_SELECTION:
        return "Payroll Reversal";
      case ModalStep.REVERSAL_FORM:
        return "Reversal Details";
      default:
        return "Payroll Reversal";
    }
  };

  const getModalSubtitle = () => {
    switch (currentStep) {
      case ModalStep.EMPLOYEE_SELECTION:
        return "Select an employee with recent payroll to process a reversal.";
      case ModalStep.REVERSAL_FORM:
        return "Configure the payroll reversal amount and deductions.";
      default:
        return "";
    }
  };

  return (
    <AppModal
      open={open}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      badge="Reversal"
      onClose={onClose}
      maxWidthClassName={currentStep === ModalStep.EMPLOYEE_SELECTION ? "max-w-4xl" : "max-w-xl"}
      footer={
        currentStep === ModalStep.REVERSAL_FORM ? (
          <ModalFooterActions
            onCancel={handleBackToEmployeeSelection}
            onSave={handleSubmit}
            cancelLabel="Back"
            saveLabel="Process Reversal"
            savingLabel="Processing..."
            isSaving={isSaving}
            disabled={!canSubmit}
            error={error}
          />
        ) : (
          <div className="flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container"
            >
              Cancel
            </button>
          </div>
        )
      }
    >
      {currentStep === ModalStep.EMPLOYEE_SELECTION ? (
        <ReversibleEmployeeSelectionTable
          employees={employees}
          isLoading={isLoadingEmployees}
          onSelectEmployee={handleEmployeeSelected}
        />
      ) : (
        <div className="space-y-lg">
          {/* Selected Employee Info */}
          {selectedEmployee ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-md">
              <p className="mb-sm text-label-sm font-semibold text-primary uppercase">
                Selected Employee
              </p>
              <div className="grid grid-cols-2 gap-md text-body-sm">
                <div>
                  <p className="text-on-surface-variant">Name</p>
                  <p className="font-semibold text-on-surface">{selectedEmployee.nameAsPassport}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Employee Code</p>
                  <p className="font-semibold text-on-surface">{selectedEmployee.employeeCode}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Last Payroll Amount</p>
                  <p className="font-semibold text-on-surface">
                    {formatTransactionAmount(selectedEmployee.lastPayrollAmount, "QAR")}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Payroll Date</p>
                  <p className="font-semibold text-on-surface">
                    {formatDepositDate(selectedEmployee.lastPayrollDate)}
                  </p>
                </div>
              </div>
              {selectedEmployee.lastPayrollReference && (
                <div className="mt-sm">
                  <p className="text-on-surface-variant">Reference</p>
                  <p className="font-mono text-body-sm font-semibold text-on-surface">
                    {selectedEmployee.lastPayrollReference}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {isLoadingAccounts ? (
            <p className="text-body-md text-on-surface-variant">Loading accounts...</p>
          ) : (
            <>
              <div>
                <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
                  Destination Account *
                </label>
                <select
                  value={destinationAccountId}
                  onChange={(event) => {
                    setDestinationAccountId(event.target.value);
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
                {selectedDestinationAccount ? (
                  <div className="mt-sm rounded-lg bg-surface-container px-sm py-xs text-body-sm text-on-surface-variant">
                    Current balance:{" "}
                    <span className="font-semibold text-on-surface">
                      {selectedDestinationAccount.balance.toLocaleString()} {selectedDestinationAccount.currency}
                    </span>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
                  Reversal Amount *
                </label>
                <input
                  type="number"
                  min="0.01"
                  max={selectedEmployee?.lastPayrollAmount}
                  step="0.01"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError(null);
                  }}
                  placeholder="0.00"
                  className={inputClassName}
                />
                {selectedEmployee && (
                  <div className="mt-xs text-body-sm text-on-surface-variant">
                    Maximum: {formatTransactionAmount(selectedEmployee.lastPayrollAmount, "QAR")}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
                  Deduction Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deduction}
                  onChange={(event) => {
                    setDeduction(event.target.value);
                    setError(null);
                  }}
                  placeholder="0.00"
                  className={inputClassName}
                />
                <div className="mt-xs text-body-sm text-on-surface-variant">
                  Amount to be kept as deduction (optional)
                </div>
              </div>

              {/* Net Amount Display */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-md">
                <p className="mb-xs text-label-sm font-semibold text-emerald-800 uppercase">
                  Net Reversal Amount
                </p>
                <p className="text-headline-md font-semibold text-emerald-800">
                  {formatTransactionAmount(netAmount, "QAR")}
                </p>
                <p className="text-body-sm text-emerald-700">
                  This amount will be added to the destination account
                </p>
              </div>

              <div>
                <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
                  Notes
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={2}
                  placeholder="Optional reason for reversal"
                  className={`${inputClassName} resize-none`}
                />
              </div>
            </>
          )}
        </div>
      )}
    </AppModal>
  );
}