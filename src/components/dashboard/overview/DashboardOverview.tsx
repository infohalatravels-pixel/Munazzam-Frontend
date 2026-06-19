"use client";

import type { SessionUser } from "@/lib/auth/session";
import { buildKpisFromStats } from "@/lib/accounts/mappers";
import { AccountsKpiGrid } from "@/components/accounts/AccountsKpiGrid";
import { DocumentsExpiringSoonSection } from "@/components/documents/DocumentsExpiringSoonSection";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import {
  buildDepartmentBreakdown,
  buildEmployeeGrowthMonths,
  buildPriorityFeed,
  buildVisaStatusBreakdown,
  deriveWelcomeStatus,
} from "@/lib/dashboard/overviewHelpers";
import { ComplianceSummaryCard } from "./ComplianceSummaryCard";
import { DashboardPriorityFeed } from "./DashboardPriorityFeed";
import { DepartmentBreakdown } from "./DepartmentBreakdown";
import { EmployeeGrowthChart } from "./EmployeeGrowthChart";
import { KpiGrid } from "./KpiGrid";
import { VisaStatusCard } from "./VisaStatusCard";
import { WelcomeSection } from "./WelcomeSection";

type DashboardOverviewProps = {
  user: SessionUser | null;
};

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const {
    employeeStats,
    accountStats,
    documentsHub,
    employees,
    isLoading,
    error,
  } = useDashboardOverview();

  const welcomeStatus = deriveWelcomeStatus(employeeStats, documentsHub);
  const visaSlices = buildVisaStatusBreakdown(employees);
  const departments = buildDepartmentBreakdown(employees);
  const growthMonths = buildEmployeeGrowthMonths(employees);
  const priorityItems = buildPriorityFeed(employees, documentsHub, employeeStats);
  const accountKpis = accountStats ? buildKpisFromStats(accountStats) : [];

  return (
    <div className="space-y-xl p-gutter md:p-xl">
      <WelcomeSection user={user} status={welcomeStatus} />

      {error ? (
        <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <KpiGrid
        employeeStats={employeeStats}
        accountStats={accountStats}
        documentsHub={documentsHub}
        isLoading={isLoading}
      />

      <DocumentsExpiringSoonSection
        alerts={documentsHub?.alerts ?? []}
        alertCount={documentsHub?.alertCount ?? 0}
        isLoading={isLoading}
      />

      {accountKpis.length > 0 ? (
        <section>
          <div className="mb-md flex items-center justify-between">
            <div>
              <h3 className="text-headline-sm text-on-surface">Accounts & Finance</h3>
              <p className="text-body-sm text-on-surface-variant">
                Live balances across bank and internal accounts
              </p>
            </div>
          </div>
          <AccountsKpiGrid kpis={accountKpis} />
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-xl lg:grid-cols-12">
        <div className="space-y-xl lg:col-span-8">
          <EmployeeGrowthChart months={growthMonths} isLoading={isLoading} />

          <div className="grid grid-cols-1 gap-xl md:grid-cols-2">
            <VisaStatusCard
              slices={visaSlices}
              totalActive={employeeStats?.activeVisas ?? 0}
              isLoading={isLoading}
            />
            <DepartmentBreakdown departments={departments} isLoading={isLoading} />
          </div>

          <ComplianceSummaryCard
            stats={documentsHub?.stats ?? null}
            alertCount={documentsHub?.alertCount ?? 0}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-4">
          <DashboardPriorityFeed items={priorityItems} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
