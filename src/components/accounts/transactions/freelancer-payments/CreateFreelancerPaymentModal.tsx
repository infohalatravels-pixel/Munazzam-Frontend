"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
} from "@/components/ui/AppModal";
import { 
  FreelancerEmployee, 
  FreelancerPaymentRecord,
  fetchFreelancerEmployees, 
  CreateFreelancerPaymentPayload,
  createFreelancerPayment
} from "@/lib/accounts/transactionsApi";
import { AccountRecord, fetchAccounts } from "@/lib/accounts/api";
import { inputClassName, selectClassName } from "@/components/employees/add-employee/formStyles";

type CreateFreelancerPaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { payment: FreelancerPaymentRecord }) => void;
};

function formatAccountLabel(account: AccountRecord) {
  const bank = account.bankName ? ` — ${account.bankName}` : "";
  return `${account.name}${bank} (${account.balance.toLocaleString()} ${account.currency})`;
}

export function CreateFreelancerPaymentModal({ open, onClose, onCreated }: CreateFreelancerPaymentModalProps) {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [employees, setEmployees] = useState<FreelancerEmployee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = !isLoadingData && accounts.length > 0 && employees.length > 0;

  useEffect(() => {
    if (!open) return;

    setSelectedEmployeeId("");
    setDestinationAccountId("");
    setAmount("");
    setDescription("");
    setError(null);
    setIsSaving(false);
    setIsLoadingData(true);

    Promise.all([
      fetchAccounts({ status: "ACTIVE" }),
      fetchFreelancerEmployees()
    ])
      .then(([accountsResult, employeesResult]) => {
        setAccounts(accountsResult);
        setEmployees(employeesResult.employees);
        setDestinationAccountId(accountsResult[0]?.id ?? "");
        setSelectedEmployeeId(employeesResult.employees[0]?.id ?? "");
      })
      .catch(() => {
        setAccounts([]);
        setEmployees([]);
        setError("Failed to load data.");
      })
      .finally(() => setIsLoadingData(false));
  }, [open]);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === destinationAccountId) ?? null,
    [accounts, destinationAccountId]
  );

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId]
  );

  async function handleSubmit() {
    const parsedAmount = Number(amount);

    if (!selectedEmployeeId) {
      setError("Select a freelancer employee.");
      return;
    }

    if (!destinationAccountId) {
      setError("Select the destination account.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createFreelancerPayment({
        employeeId: selectedEmployeeId,
        destinationAccountId,
        amount: parsedAmount,
        description: description.trim() || undefined,
      });

      onCreated(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record freelancer payment.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppModal
      open={open}
      title="Record Freelancer Payment"
      subtitle="Record payment received from freelancer employees."
      badge="Freelancer Payment"
      onClose={onClose}
      maxWidthClassName="max-w-xl"
      footer={
        <ModalFooterActions
          onCancel={onClose}
          onSave={handleSubmit}
          saveLabel="Record Payment"
          savingLabel="Recording..."
          isSaving={isSaving}
          disabled={!canSubmit}
          error={error}
        />
      }
    >
      {isLoadingData ? (
        <p className="text-body-md text-on-surface-variant">Loading data...</p>
      ) : (
        <div className="space-y-lg">
          <div>
            <label className="mb-xs block text-label-sm font-semibold text-on-surface-variant">
              Freelancer Employee *
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(event) => {
                setSelectedEmployeeId(event.target.value);
                setError(null);
              }}
              disabled={employees.length === 0}
              className={selectClassName}
            >
              {employees.length === 0 ? (
                <option value="">No freelancer employees available</option>
              ) : (
                employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.nameAsPassport} ({employee.employeeCode})
                  </option>
                ))
              )}
            </select>
            {selectedEmployee ? (
              <div className="mt-sm rounded-lg border border-outline-variant bg-surface-container-low px-sm py-xs text-body-sm text-on-surface-variant">
                <div className="font-medium text-on-surface">{selectedEmployee.nameAsPassport}</div>
                <div>Code: {selectedEmployee.employeeCode}</div>
                {selectedEmployee.designation && <div>Designation: {selectedEmployee.designation}</div>}
              </div>
            ) : null}
          </div>

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