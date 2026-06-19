const EMPLOYMENT_STATUS_CLASS: Record<string, string> = {
  ACTIVE: "bg-[#D1FAE5] text-[#065F46]",
  ON_LEAVE: "bg-amber-100 text-amber-800",
  TERMINATED: "bg-error-container text-on-error-container",
};

const EMPLOYEE_TYPE_CLASS = "bg-secondary text-on-secondary";

export function getEmploymentStatusClass(status: string) {
  return EMPLOYMENT_STATUS_CLASS[status] || "bg-surface-container-high text-on-surface-variant";
}

export function getEmployeeTypeClass() {
  return EMPLOYEE_TYPE_CLASS;
}

export function formatSalary(amount: number) {
  return new Intl.NumberFormat("en-QA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
