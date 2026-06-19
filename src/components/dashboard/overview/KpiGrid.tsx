import type { AccountStats } from "@/lib/accounts/api";
import type { DocumentsHubResponse } from "@/lib/documents/api";
import type { EmployeeStats } from "@/lib/employees/api";
import { formatDashboardBalance } from "@/lib/dashboard/overviewHelpers";

type KpiCardProps = {
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendColor: string;
  trendIcon: string;
};

function KpiCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  trendColor,
  trendIcon,
}: KpiCardProps) {
  return (
    <div className="kpi-card rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
      <div className="mb-md flex items-start justify-between">
        <div className={`rounded-lg p-sm ${iconBg} ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`flex items-center text-label-sm ${trendColor}`}>
          {trend}{" "}
          <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
        </span>
      </div>
      <h3 className="mb-xs text-label-sm text-on-surface-variant">{title}</h3>
      <p className="text-headline-md font-bold text-on-surface">{value}</p>
    </div>
  );
}

type KpiGridProps = {
  employeeStats: EmployeeStats | null;
  accountStats: AccountStats | null;
  documentsHub: DocumentsHubResponse | null;
  isLoading?: boolean;
};

export function KpiGrid({
  employeeStats,
  accountStats,
  documentsHub,
  isLoading = false,
}: KpiGridProps) {
  const expiringSoon = employeeStats?.expiringSoon ?? 0;
  const alertCount = documentsHub?.alertCount ?? 0;
  const complianceRate = documentsHub?.stats.complianceRate;

  const items: KpiCardProps[] = [
    {
      title: "Total Employees",
      value: isLoading ? "—" : String(employeeStats?.totalStaff ?? 0),
      icon: "group",
      iconBg: "bg-primary-fixed",
      iconColor: "text-primary",
      trend: employeeStats ? `${employeeStats.onLeave} on leave` : "—",
      trendColor: "text-on-surface-variant",
      trendIcon: "horizontal_rule",
    },
    {
      title: "Active Visas",
      value: isLoading ? "—" : String(employeeStats?.activeVisas ?? 0),
      icon: "verified_user",
      iconBg: "bg-secondary-fixed",
      iconColor: "text-secondary",
      trend: employeeStats?.activeVisaPct ?? "—",
      trendColor: "text-secondary",
      trendIcon: "trending_up",
    },
    {
      title: "Expiring Within 30 Days",
      value: isLoading ? "—" : String(expiringSoon),
      icon: "event_busy",
      iconBg: "bg-tertiary-fixed",
      iconColor: "text-tertiary",
      trend: expiringSoon > 0 ? "Renew now" : "Clear",
      trendColor: expiringSoon > 0 ? "text-error" : "text-emerald-600",
      trendIcon: expiringSoon > 0 ? "warning" : "check_circle",
    },
    {
      title: "Total Balance",
      value: isLoading
        ? "—"
        : `${formatDashboardBalance(accountStats)} ${accountStats?.currency ?? "QAR"}`,
      icon: "account_balance_wallet",
      iconBg: "bg-surface-container-highest",
      iconColor: "text-on-surface",
      trend:
        complianceRate !== undefined
          ? `${complianceRate}% compliant`
          : alertCount > 0
            ? `${alertCount} doc alerts`
            : "Live",
      trendColor: alertCount > 0 ? "text-error" : "text-on-surface-variant",
      trendIcon: alertCount > 0 ? "folder_open" : "sync",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 xl:grid-cols-4">
      {items.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
