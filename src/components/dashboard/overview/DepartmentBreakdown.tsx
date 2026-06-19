import type { DepartmentSlice } from "@/lib/dashboard/overviewHelpers";

type DepartmentBreakdownProps = {
  departments: DepartmentSlice[];
  isLoading?: boolean;
};

export function DepartmentBreakdown({
  departments,
  isLoading = false,
}: DepartmentBreakdownProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl">
      <h4 className="mb-lg text-headline-sm text-on-surface">Departments</h4>

      {isLoading ? (
        <p className="text-body-sm text-on-surface-variant">Loading departments...</p>
      ) : departments.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant">No department data available yet.</p>
      ) : (
        <div className="space-y-md">
          {departments.map((dept) => (
            <div key={dept.name}>
              <div className="mb-xs flex justify-between text-label-sm">
                <span>{dept.name}</span>
                <span>{dept.count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-low">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(dept.percent, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
