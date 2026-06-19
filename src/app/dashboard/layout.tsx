"use client";

import { AuthRedirect } from "@/components/auth/AuthRedirect";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRedirect redirectIfGuest="/login" validateSessionOnLoad>
      <DashboardShell>{children}</DashboardShell>
    </AuthRedirect>
  );
}
