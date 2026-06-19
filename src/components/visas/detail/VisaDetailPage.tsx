"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { VisaDetailTabs } from "./VisaDetailTabs";
import { VisaStageTimeline } from "./VisaStageTimeline";
import type { VisaDetail } from "@/lib/visas/types";

type VisaDetailPageProps = {
  visa: VisaDetail;
  isAdvancing?: boolean;
  isActivating?: boolean;
  onAdvanceStage?: () => void;
  onActivateEmployee?: () => void;
};

export function VisaDetailPage({
  visa,
  isAdvancing = false,
  isActivating = false,
  onAdvanceStage,
  onActivateEmployee,
}: VisaDetailPageProps) {
  const router = useRouter();
  const medicalRouteLabel =
    visa.medicalRoute === "HOME_COUNTRY_QMC"
      ? "Medical: Home country (QMC)"
      : "Medical: In Qatar (QMC)";

  const canActivate = visa.status === "COMPLETED" && Boolean(visa.linkedEmployeeCode);
  const canAdvance = visa.status === "IN_PROGRESS";

  return (
    <div className="flex min-h-full flex-col bg-surface-container-low">
      <div className="border-b border-outline-variant bg-surface px-gutter py-lg md:px-3xl">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-lg md:flex-row md:items-center">
          <div className="flex items-center gap-lg">
            <button
              type="button"
              onClick={() => router.push("/dashboard/visas")}
              className="rounded-full p-sm text-on-surface-variant hover:bg-surface-variant md:hidden"
              aria-label="Back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-highest">
              <span className="text-2xl font-bold text-primary">
                {visa.applicantName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div className="absolute -right-2 -bottom-2 rounded-lg bg-primary p-1 text-on-primary">
                <span className="material-symbols-outlined text-sm">verified_user</span>
              </div>
            </div>
            <div>
              <div className="mb-xs flex flex-wrap items-center gap-md">
                <h3 className="text-headline-lg text-on-surface">{visa.applicantName}</h3>
                <span className="rounded-full border border-primary/10 bg-surface-container-high px-md py-xs text-label-md text-primary">
                  {visa.visaTypeLabel}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-md text-body-sm text-on-surface-variant">
                <span className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">fingerprint</span>
                  {visa.vpNumber}
                </span>
                <span className="h-1 w-1 rounded-full bg-outline" />
                <span className="flex items-center gap-xs rounded-full bg-blue-100 px-md py-xs font-bold text-blue-800">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                  In Progress
                </span>
                <span className="h-1 w-1 rounded-full bg-outline" />
                <span className="rounded-full bg-tertiary-fixed px-md py-xs font-bold text-on-tertiary-fixed-variant">
                  {medicalRouteLabel}
                </span>
                {visa.linkedEmployeeCode ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-outline" />
                    <Link
                      href={visa.employeeId ? `/dashboard/employees/${visa.employeeId}` : "/dashboard/employees"}
                      className="text-primary hover:underline"
                    >
                      {visa.linkedEmployeeCode} · {visa.linkedEmployeeStatus}
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex gap-md">
            <button
              type="button"
              onClick={onAdvanceStage}
              disabled={!canAdvance || isAdvancing || !onAdvanceStage}
              className="flex items-center gap-md rounded-lg bg-primary px-lg py-md font-bold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">check_circle</span>
              {isAdvancing ? "Updating..." : "Mark Current Stage Complete"}
            </button>
            <button
              type="button"
              className="flex items-center gap-md rounded-lg border border-outline-variant bg-surface px-lg py-md font-bold text-on-surface transition-all hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
      </div>

      <div className="custom-scrollbar flex-grow overflow-y-auto p-gutter md:p-3xl">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-5">
            <VisaStageTimeline
              stages={visa.stages}
              currentStageIndex={visa.currentStageIndex}
              totalStages={visa.totalStages}
            />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <VisaDetailTabs visa={visa} />
          </div>
        </div>
      </div>

      <footer className="sticky bottom-0 z-40 border-t border-outline-variant bg-surface px-gutter py-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:px-3xl">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-md sm:flex-row">
          <div className="flex items-center gap-md text-on-surface-variant">
            <span className="material-symbols-outlined">update</span>
            <span className="text-body-sm">
              Last update: {visa.lastUpdatedAt} by{" "}
              <strong className="text-on-surface">{visa.lastUpdatedBy}</strong>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-md">
            <FooterAction icon="payments" label="Record Payment" />
            <FooterAction icon="receipt_long" label="Record Expense" />
            <FooterAction icon="upload_file" label="Upload Document" />
            <button
              type="button"
              onClick={onActivateEmployee}
              disabled={!canActivate || isActivating || !onActivateEmployee}
              className="flex items-center gap-md rounded-lg bg-primary px-lg py-md font-bold text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined">person_add</span>
              {isActivating ? "Activating..." : "Activate Employee"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterAction({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-md rounded-lg border border-outline bg-surface px-lg py-md font-bold text-on-surface transition-all hover:bg-surface-container-high"
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </button>
  );
}
