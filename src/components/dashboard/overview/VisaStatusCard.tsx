import type { VisaStatusSlice } from "@/lib/dashboard/overviewHelpers";

type VisaStatusCardProps = {
  slices: VisaStatusSlice[];
  totalActive: number;
  isLoading?: boolean;
};

function buildDonutSegments(slices: VisaStatusSlice[]) {
  let offset = 0;
  return slices.map((slice) => {
    const segment = {
      ...slice,
      dashArray: `${slice.percent}, 100`,
      dashOffset: -offset,
    };
    offset += slice.percent;
    return segment;
  });
}

const STROKE_COLORS: Record<string, string> = {
  "bg-primary": "#670024",
  "bg-secondary": "#a23952",
  "bg-error": "#ba1a1a",
  "bg-outline": "#8a7174",
};

export function VisaStatusCard({ slices, totalActive, isLoading = false }: VisaStatusCardProps) {
  const segments = buildDonutSegments(slices);
  const verified = slices.find((slice) => slice.label === "Verified");

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl">
      <h4 className="mb-lg text-headline-sm text-on-surface">Visa Status</h4>

      {isLoading ? (
        <p className="text-body-sm text-on-surface-variant">Loading visa breakdown...</p>
      ) : slices.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant">No active employees to display.</p>
      ) : (
        <div className="flex flex-col items-center gap-xl sm:flex-row sm:items-center">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              {segments.map((segment) => (
                <path
                  key={segment.label}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={STROKE_COLORS[segment.color] ?? "#670024"}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  strokeWidth="3"
                />
              ))}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-bold">{verified?.count ?? totalActive}</span>
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                Verified
              </span>
            </div>
          </div>

          <div className="w-full flex-1 space-y-sm">
            {slices.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-xs">
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-label-sm">{item.label}</span>
                </div>
                <span className="text-label-sm">
                  {item.count} ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
