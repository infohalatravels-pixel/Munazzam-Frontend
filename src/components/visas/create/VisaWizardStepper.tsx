"use client";

import { WIZARD_STEPS } from "@/lib/visas/constants";

type VisaWizardStepperProps = {
  currentStep: number;
};

export function VisaWizardStepper({ currentStep }: VisaWizardStepperProps) {
  const progressWidth = ((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100;

  return (
    <div className="relative mb-3xl flex items-start justify-between">
      <div className="absolute top-5 -z-10 h-[2px] w-full bg-surface-container-highest" />
      <div
        className="absolute top-5 -z-10 h-[2px] bg-primary transition-all duration-500"
        style={{ width: `${progressWidth}%` }}
      />
      {WIZARD_STEPS.map((step) => {
        const isActive = step.id === currentStep;
        const isComplete = step.id < currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center gap-sm">
            <div
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-md transition-all duration-300",
                isComplete
                  ? "bg-primary-container text-on-primary"
                  : isActive
                    ? "scale-110 bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant",
              ].join(" ")}
            >
              {isComplete ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                step.id
              )}
            </div>
            <span
              className={[
                "text-label-sm",
                isActive || isComplete ? "font-bold text-primary" : "text-on-surface-variant",
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
