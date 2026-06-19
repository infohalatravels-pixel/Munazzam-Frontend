"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import { fetchAccounts, type AccountRecord } from "@/lib/accounts/api";
import { fetchEligibleEmployees, createPayroll } from "@/lib/accounts/transactionsApi";
import type { EligibleEmployee, PayrollRecord } from "@/lib/accounts/transactionsApi";
import { inputClassName, selectClassName } from "@/components/employees/add-employee/formStyles";
import { formatTransactionAmount } from "@/lib/accounts/formatters";
import { EmployeeSelectionTable } from "./EmployeeSelectionTable";

type CreatePayrollModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { payroll: PayrollRecord }) => void;
};

enum ModalStep {
  EMPLOYEE_SELECTION = "employee_selection",
  PAYMENT_FORM = "payment_form",
}

function formatAccountLabel(account: AccountRecord) {
  const bank = account.bankName ? ` — ${account.bankName}` : "";
  const categoryLabel = account.category === "BANK" ? "Bank" : "Internal";
  return `${account.name}${bank} (${account.balance.toLocaleString()} ${account.currency}) [${categoryLabel}]`;
}

export function CreatePayrollModal({ open, onClose, onCreated }: CreatePayrollModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>(ModalStep.EMPLOYEE_SELECTION);
  const [employees, setEmployees] = useState<EligibleEmployee[]>([]);
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EligibleEmployee | null>(null);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canProceedToForm = selectedEmployee !== null;
  const canSubmit = !isLoadingAccounts && accounts.length > 0 && sourceAccountId && amount;

  // Filter accounts that have sufficient balance
  const eligibleAccounts = useMemo(() => {
    const payrollAmount = Number(amount) || 0;
    return accounts.filter((account) => account.balance >= payrollAmount);
  }, [accounts, amount]);

  useEffect(() => {
    if (!open) return;

    // Reset state
    setCurrentStep(ModalStep.EMPLOYEE_SELECTION);
    setSelectedEmployee(null);
    setSourceAccountId("");
    setAmount("");
    setDescription("");
    setError(null);
    setIsSaving(false);
    setIsLoadingEmployees(true);

    // Load eligible employees
    fetchEligibleEmployees()
      .then((result) => {
        setEmployees(result.employees);
      })
      .catch(() => {
        setEmployees([]);
        setError("Failed to load employees.");
      })
      .finally(() => setIsLoadingEmployees(false));
  }, [open]);

  const handleEmployeeSelected = (employee: EligibleEmployee) => {
    setSelectedEmployee(employee);
    setAmount(String(employee.salary));
    setCurrentStep(ModalStep.PAYMENT_FORM);
    setError(null);
    setIsLoadingAccounts(true);

    // Load accounts when moving to payment form
    fetchAccounts({ status: "ACTIVE" })
      .then((result) => {
        setAccounts(result);
        // Find first account with sufficient balance
        const eligible = result.filter(acc => acc.balance >= employee.salary);
        setSourceAccountId(eligible[0]?.id ?? "");
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
    setSourceAccountId("");
    setAmount("");
    setDescription("");
    setError(null);
  };

  const selectedSourceAccount = useMemo(
    () => accounts.find((account) => account.id === sourceAccountId) ?? null,
    [accounts, sourceAccountId]
  );

  async function handleSubmit() {
    if (!selectedEmployee) {
      setError("No employee selected.");
      return;
    }

    const parsedAmount = Number(amount);

    if (!sourceAccountId) {
      setError("Select the source account.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid salary amount greater than zero.");
      return;
    }

    if (selectedSourceAccount && parsedAmount > selectedSourceAccount.balance) {
      setError("Amount exceeds available balance in the source account.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createPayroll({
        employeeId: selectedEmployee.id,
        sourceAccountId,
        amount: parsedAmount,
        description: description.trim() || undefined,
      });

      onCreated(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process payroll.");
    } finally {
      setIsSaving(false);
    }
  }

  const getModalTitle = () => {
    switch (currentStep) {
      case ModalStep.EMPLOYEE_SELECTION:
        return "Process Payroll";
      case ModalStep.PAYMENT_FORM:
        return "Payment Details";
      default:
        return "Process Payroll";
    }
  };

  const getModalSubtitle = () => {
    switch (currentStep) {
      case ModalStep.EMPLOYEE_SELECTION:
        return "Select an eligible employee to process salary payment.";
      case ModalStep.PAYMENT_FORM:
        return "Configure payment details for the selected employee.";
      default:
        return "";
    }
  };

  return (
    <AppModal
      open={open}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      badge="Payroll"
      onClose={onClose}
      maxWidthClassName={currentStep === ModalStep.EMPLOYEE_SELECTION ? "max-w-4xl" : "max-w-xl"}
      footer={
        currentStep === ModalStep.PAYMENT_FORM ? (
          <ModalFooterActions
            onCancel={handleBackToEmployeeSelection}
            onSave={handleSubmit}
            cancelLabel="Back"
            saveLabel="Process Payroll"
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
        <EmployeeSelectionTable
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
                  <p className="text-on-surface-variant">Designation</p>
                  <p className="font-semibold text-on-surface">
                    {selectedEmployee.designation || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Salary</p>
                  <p className="font-semibold text-on-surface">
                    {formatTransactionAmount(selectedEmployee.salary, "QAR")}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {isLoadingAccounts ? (
            <p className="text-body-md text-on-surface-variant">Loading accounts...</p>
          ) : (
            <>
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
                  disabled={eligibleAccounts.length === 0}
                  className={selectClassName}
                >
                  {eligibleAccounts.length === 0 ? (
                    <option value="">No accounts with sufficient balance</option>
                  ) : (
                    eligibleAccounts.map((account) => (
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
            </>
          )}
        </div>
      )}
    </AppModal>
  );
}