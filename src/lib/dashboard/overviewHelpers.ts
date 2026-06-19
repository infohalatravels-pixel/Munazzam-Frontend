import type { AccountStats } from "@/lib/accounts/api";
import type { DocumentsHubResponse } from "@/lib/documents/api";
import type { EmployeeRecord, EmployeeStats } from "@/lib/employees/api";

export type WelcomeStatus = {
  label: string;
  message: string;
  toneClassName: string;
};

export type VisaStatusSlice = {
  label: string;
  count: number;
  percent: number;
  color: string;
};

export type DepartmentSlice = {
  name: string;
  count: number;
  percent: number;
};

export type GrowthMonth = {
  label: string;
  count: number;
  isCurrent: boolean;
};

export type PriorityFeedItem = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  icon: string;
  iconBg: string;
  href?: string;
};

const VISA_STATUS_META: Record<string, { label: string; color: string }> = {
  VERIFIED: { label: "Verified", color: "bg-primary" },
  RENEWING: { label: "Expiring Soon", color: "bg-secondary" },
  EXPIRED: { label: "Expired", color: "bg-error" },
  PENDING: { label: "Pending", color: "bg-outline" },
};

export function deriveWelcomeStatus(
  employeeStats: EmployeeStats | null,
  documentsHub: DocumentsHubResponse | null
): WelcomeStatus {
  const documentAlerts = documentsHub?.alertCount ?? 0;
  const visaExpiring = employeeStats?.expiringSoon ?? 0;
  const missingFiles = documentsHub?.stats.missingFiles ?? 0;
  const urgent = documentAlerts + visaExpiring;

  if (urgent === 0 && missingFiles === 0) {
    return {
      label: "Excellent",
      message: "Workforce, visa, and document compliance are in good standing.",
      toneClassName: "text-secondary",
    };
  }

  if (documentAlerts > 0 || visaExpiring > 0) {
    const parts: string[] = [];
    if (visaExpiring > 0) {
      parts.push(
        `${visaExpiring} visa${visaExpiring === 1 ? "" : "s"} expiring within 30 days`
      );
    }
    if (documentAlerts > 0) {
      parts.push(
        `${documentAlerts} document${documentAlerts === 1 ? "" : "s"} need attention`
      );
    }

    return {
      label: "Action Required",
      message: parts.join(" and ") + ".",
      toneClassName: "text-error",
    };
  }

  return {
    label: "Review Recommended",
    message: `${missingFiles} required document slot${missingFiles === 1 ? " is" : "s are"} still missing.`,
    toneClassName: "text-amber-700",
  };
}

export function buildVisaStatusBreakdown(employees: EmployeeRecord[]): VisaStatusSlice[] {
  const counts = new Map<string, number>();

  for (const employee of employees) {
    const key = employee.visaStatus || "PENDING";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const total = employees.length || 1;

  return ["VERIFIED", "RENEWING", "EXPIRED", "PENDING"]
    .map((status) => {
      const count = counts.get(status) ?? 0;
      const meta = VISA_STATUS_META[status];
      return {
        label: meta.label,
        count,
        percent: Math.round((count / total) * 100),
        color: meta.color,
      };
    })
    .filter((slice) => slice.count > 0);
}

export function buildDepartmentBreakdown(employees: EmployeeRecord[]): DepartmentSlice[] {
  const counts = new Map<string, number>();

  for (const employee of employees) {
    const name = employee.department?.trim() || "Unassigned";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const total = employees.length || 1;
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return sorted.map(([name, count]) => ({
    name,
    count,
    percent: Math.round((count / total) * 100),
  }));
}

export function buildEmployeeGrowthMonths(employees: EmployeeRecord[]): GrowthMonth[] {
  const now = new Date();
  const months: GrowthMonth[] = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const label = date.toLocaleDateString("en-GB", { month: "short" });
    const month = date.getMonth();
    const year = date.getFullYear();

    const count = employees.filter((employee) => {
      if (!employee.createdAt) return false;
      const created = new Date(employee.createdAt);
      return created.getMonth() === month && created.getFullYear() === year;
    }).length;

    months.push({
      label,
      count,
      isCurrent: offset === 0,
    });
  }

  return months;
}

function formatRelativeTime(value?: string | null) {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function buildPriorityFeed(
  employees: EmployeeRecord[],
  documentsHub: DocumentsHubResponse | null,
  employeeStats: EmployeeStats | null
): PriorityFeedItem[] {
  const items: PriorityFeedItem[] = [];

  for (const alert of documentsHub?.alerts.slice(0, 3) ?? []) {
    items.push({
      id: `alert-${alert.id}`,
      title: alert.title,
      description: alert.timeLabel,
      timeLabel: alert.severity === "expired" ? "Expired" : "Expiring",
      icon: alert.icon,
      iconBg:
        alert.severity === "expired"
          ? "bg-error-container text-on-error-container"
          : "bg-amber-100 text-amber-800",
      href: alert.resolveHref,
    });
  }

  if ((employeeStats?.expiringSoon ?? 0) > 0) {
    items.push({
      id: "visa-expiring-summary",
      title: "Visa renewals due",
      description: `${employeeStats?.expiringSoon} active employee${
        employeeStats?.expiringSoon === 1 ? "" : "s"
      } have visas expiring within 30 days.`,
      timeLabel: "Priority",
      icon: "event_busy",
      iconBg: "bg-secondary-fixed text-secondary",
      href: "/dashboard/employees",
    });
  }

  const recentHires = [...employees]
    .filter((employee) => employee.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 3);

  for (const employee of recentHires) {
    items.push({
      id: `hire-${employee.id}`,
      title: `${employee.nameAsPassport} joined`,
      description: `${employee.designation || employee.position || "Employee"} · ${employee.department || "Unassigned"}`,
      timeLabel: formatRelativeTime(employee.createdAt),
      icon: "person_add",
      iconBg: "bg-surface-container-high text-primary",
      href: `/dashboard/employees/${employee.id}`,
    });
  }

  return items.slice(0, 6);
}

export function formatDashboardBalance(stats: AccountStats | null) {
  if (!stats) return "—";
  return new Intl.NumberFormat("en-QA", {
    maximumFractionDigits: 0,
  }).format(stats.totalBalance);
}
