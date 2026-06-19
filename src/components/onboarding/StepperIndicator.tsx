"use client";

import { ONBOARDING_STEPS } from "@/lib/company/types";

type StepperIndicatorProps = {
  currentStep: number;
  maxReachableStep: number;
};

export function StepperIndicator({
  currentStep,
  maxReachableStep,
}: StepperIndicatorProps) {
  const progress =
    ONBOARDING_STEPS.length > 1
      ? ((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100
      : 0;

  return (
    <div className="relative mb-2xl flex items-start justify-between px-4">
      <div className="absolute top-5 right-10 left-10 -z-10 h-[2px] bg-surface-container-highest">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {ONBOARDING_STEPS.map((step) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isFuture = step.id > maxReachableStep;

        return (
          <div
            key={step.id}
            className="flex flex-col items-center gap-sm"
            aria-current={isActive ? "step" : undefined}
          >
            <div
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-md ring-4 ring-white transition-all",
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-primary text-white"
                    : "bg-surface-container-highest text-on-surface-variant",
                isFuture ? "opacity-60" : "",
              ].join(" ")}
            >
              {isCompleted ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                step.id
              )}
            </div>
            <span
              className={[
                "max-w-[88px] text-center text-label-sm",
                isCompleted
                  ? "text-green-600"
                  : isActive
                    ? "text-primary"
                    : "text-on-surface-variant",
              ].join(" ")}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
