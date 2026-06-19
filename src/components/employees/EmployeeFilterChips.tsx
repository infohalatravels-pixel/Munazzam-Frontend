type EmployeeFilterChipsProps = {
  filters: { id: string; label: string }[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
};

export function EmployeeFilterChips({
  filters,
  onRemove,
  onClearAll,
}: EmployeeFilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-xs border-b border-outline-variant bg-surface-container-low px-md py-sm">
      <span className="mr-sm text-label-sm text-on-surface-variant">Active Filters:</span>
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="group flex items-center gap-xs rounded-full border border-outline-variant bg-white py-0.5 pr-1 pl-2 text-label-sm text-on-surface"
        >
          {filter.label}
          <button
            type="button"
            onClick={() => onRemove(filter.id)}
            className="transition-colors hover:text-error"
            aria-label={`Remove filter ${filter.label}`}
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-xs text-label-sm text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
