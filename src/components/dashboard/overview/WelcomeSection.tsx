"use client";

import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth/session";
import { getGreeting } from "@/lib/dashboard/greeting";
import type { WelcomeStatus } from "@/lib/dashboard/overviewHelpers";

type WelcomeSectionProps = {
  user: SessionUser | null;
  status: WelcomeStatus;
};

export function WelcomeSection({ user, status }: WelcomeSectionProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-lg lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h2 className="mb-xs text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {getGreeting(user?.name)}
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Company status is{" "}
          <span className={`font-bold ${status.toneClassName}`}>{status.label}</span>.{" "}
          {status.message}
        </p>
      </div>

      <div className="flex flex-col gap-sm sm:flex-row sm:gap-md">
        <button
          type="button"
          onClick={() => router.push("/dashboard/employees")}
          className="flex items-center justify-center gap-sm rounded-xl bg-primary px-lg py-md text-label-md text-on-primary shadow-sm transition-all hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add Employee
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/documents")}
          className="flex items-center justify-center gap-sm rounded-xl border border-outline px-lg py-md text-label-md text-on-surface transition-all hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined">folder_open</span>
          Review Documents
        </button>
      </div>
    </div>
  );
}
