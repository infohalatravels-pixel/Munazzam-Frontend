"use client";

import { useDashboardUser } from "@/components/dashboard/DashboardUserContext";
import { DashboardOverview } from "@/components/dashboard/overview/DashboardOverview";

export default function DashboardPage() {
  const user = useDashboardUser();

  return <DashboardOverview user={user} />;
}
