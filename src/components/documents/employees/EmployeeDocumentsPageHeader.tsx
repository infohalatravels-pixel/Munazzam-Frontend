import Link from "next/link";

export function EmployeeDocumentsPageHeader() {
  return (
    <div className="mb-xl">
      <nav className="mb-sm">
        <ol className="flex flex-wrap items-center gap-xs text-label-sm text-on-surface-variant">
          <li>
            <Link href="/dashboard" className="transition-colors hover:text-primary">
              Dashboard
            </Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </li>
          <li>
            <Link href="/dashboard/documents" className="transition-colors hover:text-primary">
              Documents
            </Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </li>
          <li className="font-semibold text-primary">Employees</li>
        </ol>
      </nav>

      <h1 className="text-headline-lg text-on-surface">Employee Documents</h1>
      <p className="mt-xs max-w-2xl text-body-md text-on-surface-variant">
        Central directory for managing and auditing individual staff records.
      </p>
    </div>
  );
}
