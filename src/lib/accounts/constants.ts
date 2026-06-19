export const ACCOUNT_CATEGORY_OPTIONS = [
  { value: "BANK", label: "Bank Account" },
  { value: "INTERNAL", label: "Internal / System Account" },
] as const;

export const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: "CURRENT", label: "Current" },
  { value: "SAVINGS", label: "Savings" },
  { value: "OTHER", label: "Other" },
] as const;

export const INTERNAL_ACCOUNT_TYPE_OPTIONS = [
  { value: "PETTY_CASH", label: "Petty Cash" },
  { value: "SALARY", label: "Salary / WPS" },
  { value: "OPERATING", label: "Operating" },
  { value: "REVENUE", label: "Revenue" },
  { value: "EXPENSE", label: "Expense" },
  { value: "OTHER", label: "Other" },
] as const;

export const ACCOUNT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "CLOSED", label: "Closed" },
] as const;

export function getAccountTypeOptions(category: "BANK" | "INTERNAL") {
  return category === "BANK"
    ? BANK_ACCOUNT_TYPE_OPTIONS
    : INTERNAL_ACCOUNT_TYPE_OPTIONS;
}

export function formatAccountTypeLabel(value: string) {
  const all = [...BANK_ACCOUNT_TYPE_OPTIONS, ...INTERNAL_ACCOUNT_TYPE_OPTIONS];
  return all.find((item) => item.value === value)?.label ?? value;
}
