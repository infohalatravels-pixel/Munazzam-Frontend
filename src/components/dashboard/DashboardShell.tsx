"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CompanyOnboardingModal } from "@/components/onboarding/CompanyOnboardingModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { DashboardUserProvider } from "@/components/dashboard/DashboardUserContext";
import { useDashboardTitle } from "@/components/dashboard/useDashboardTitle";
import { fetchOnboardingState } from "@/lib/company/api";
import { logoutRequest, validateSession } from "@/lib/auth/api";
import {
  clearSession,
  getAccessToken,
  getSessionUser,
  updateSessionUser,
  type SessionUser,
} from "@/lib/auth/session";

type DashboardShellProps = {
  children: ReactNode;
  title?: string;
};

export function DashboardShell({ children, title: titleProp }: DashboardShellProps) {
  const router = useRouter();
  const dynamicTitle = useDashboardTitle();
  const title = titleProp ?? dynamicTitle;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = useCallback((updatedUser: SessionUser) => {
    updateSessionUser(updatedUser);
    setUser(updatedUser);
    setShowOnboarding(false);
  }, []);

  useEffect(() => {
    async function loadUser() {
      const sessionUser = (await validateSession()) || getSessionUser();
      if (!sessionUser) return;

      setUser(sessionUser);

      try {
        const onboarding = await fetchOnboardingState();
        if (!onboarding.isCompanySetup) {
          setShowOnboarding(true);
        } else if (!sessionUser.isCompanySetup) {
          handleOnboardingComplete({
            ...sessionUser,
            isCompanySetup: true,
            onboardingStep: onboarding.onboardingStep,
          });
        }
      } catch {
        if (!sessionUser.isCompanySetup) {
          setShowOnboarding(true);
        }
      }
    }

    loadUser();
  }, [handleOnboardingComplete]);

  async function handleSignOut() {
    const token = getAccessToken();
    if (token) {
      await logoutRequest(token);
    }
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {showOnboarding && user && (
        <CompanyOnboardingModal user={user} onComplete={handleOnboardingComplete} />
      )}

      <DashboardSidebar onSignOut={handleSignOut} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DashboardHeader user={user} title={title} />

        <div className="flex-1 overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <DashboardUserProvider user={user}>{children}</DashboardUserProvider>
        </div>

        <button
          type="button"
          className="fixed right-xl bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-all hover:scale-110 active:scale-95 md:flex"
          aria-label="Quick action"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>

        <MobileBottomNav onSignOut={handleSignOut} />
      </div>
    </div>
  );
}
