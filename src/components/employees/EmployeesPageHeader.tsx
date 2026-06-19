type EmployeesPageHeaderProps = {
  onAddEmployee: () => void;
};

export function EmployeesPageHeader({ onAddEmployee }: EmployeesPageHeaderProps) {
  return (
    <div className="mb-2xl flex flex-col justify-between gap-md md:flex-row md:items-center">
      <div>
        <h1 className="mb-xs text-headline-lg text-on-surface">Employees</h1>
        <p className="text-body-md text-on-surface-variant">
          Manage your workforce, visa statuses, and departmental assignments.
        </p>
      </div>

      <div className="flex items-center gap-sm">
        <button
          type="button"
          className="flex items-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface shadow-sm transition-all hover:bg-surface-container active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">upload</span>
          Import
        </button>
        <button
          type="button"
          onClick={onAddEmployee}
          className="flex items-center gap-xs rounded-lg bg-primary px-md py-2.5 text-label-md text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Add Employee
        </button>
      </div>
    </div>
  );
}
