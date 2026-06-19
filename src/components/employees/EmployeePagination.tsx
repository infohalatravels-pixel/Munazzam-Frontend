type EmployeePaginationProps = {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

export function EmployeePagination({
  page,
  totalPages,
  from,
  to,
  total,
  onPageChange,
}: EmployeePaginationProps) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-md border-t border-outline-variant p-md sm:flex-row sm:items-center sm:justify-between">
      <span className="text-body-sm text-on-surface-variant">
        Showing {from} to {to} of {total.toLocaleString()} results
      </span>

      <div className="flex items-center gap-xs">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-30"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}-${item}`} className="px-2 text-on-surface-variant">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={[
                "flex h-8 w-8 items-center justify-center rounded text-label-md transition-colors",
                item === page
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant text-on-surface hover:bg-surface-container",
              ].join(" ")}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-30"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
