import type { VisaStageItem } from "@/lib/visas/types";

type VisaStageTimelineProps = {
  stages: VisaStageItem[];
  currentStageIndex: number;
  totalStages: number;
};

export function VisaStageTimeline({ stages, currentStageIndex, totalStages }: VisaStageTimelineProps) {
  const remaining = Math.max(0, totalStages - stages.length);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-outline-variant bg-surface shadow-sm">
      <div className="flex items-center justify-between rounded-t-2xl border-b border-outline-variant bg-surface-container-lowest p-lg">
        <h4 className="flex items-center gap-md text-headline-sm text-primary">
          <span className="material-symbols-outlined">route</span>
          Processing Timeline
        </h4>
        <span className="text-label-sm text-on-surface-variant">
          Stage {currentStageIndex} of {totalStages}
        </span>
      </div>
      <div className="custom-scrollbar flex-grow space-y-0 overflow-y-auto p-lg">
        {stages.map((stage, index) => {
          const isComplete = stage.status === "COMPLETED";
          const isActive = stage.status === "IN_PROGRESS";
          const isLast = index === stages.length - 1 && remaining === 0;

          return (
            <div key={stage.key} className="relative flex gap-lg pb-md">
              {!isLast ? (
                <div
                  className={[
                    "absolute top-8 bottom-0 left-4 w-0.5",
                    isComplete ? "bg-secondary-container" : "border-l-2 border-dashed border-outline-variant",
                  ].join(" ")}
                />
              ) : null}
              <div
                className={[
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
                  isComplete
                    ? "bg-secondary text-on-secondary"
                    : isActive
                      ? "bg-primary-container text-on-primary ring-4 ring-primary/10"
                      : "border border-outline-variant bg-surface-container-high text-on-surface-variant",
                ].join(" ")}
              >
                {isComplete ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : isActive ? (
                  <span className="material-symbols-outlined animate-pulse text-sm">medical_services</span>
                ) : (
                  <span className="text-label-sm">{index + 1}</span>
                )}
              </div>
              <div
                className={[
                  "flex-grow",
                  isActive ? "rounded-xl border border-primary/10 bg-primary/5 p-md" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <p
                    className={[
                      "text-label-md",
                      isActive ? "font-bold text-primary" : "text-on-surface",
                    ].join(" ")}
                  >
                    {stage.label}
                  </p>
                  {stage.date ? (
                    <span className="text-xs text-on-surface-variant">{stage.date}</span>
                  ) : isActive ? (
                    <span className="text-xs text-primary/70">Awaiting...</span>
                  ) : null}
                </div>
                {stage.notes ? (
                  <p className="mt-1 text-body-sm text-on-surface-variant italic">{stage.notes}</p>
                ) : null}
              </div>
            </div>
          );
        })}
        {remaining > 0 ? (
          <div className="relative flex gap-lg pb-md opacity-40">
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">more_horiz</span>
            </div>
            <div className="flex-grow">
              <p className="text-label-md text-on-surface">Remaining {remaining} Stages...</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
