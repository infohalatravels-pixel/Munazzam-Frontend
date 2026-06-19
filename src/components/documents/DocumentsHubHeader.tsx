import Link from "next/link";

export function DocumentsHubHeader() {
  return (
    <div className="mb-xl flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
      <div>
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
            <li className="font-semibold text-primary">Documents</li>
          </ol>
        </nav>

        <h1 className="text-headline-lg text-on-surface">Documents Hub</h1>
        <p className="mt-xs max-w-2xl text-body-md text-on-surface-variant">
          Central repository for corporate registrations, operational licenses, and
          employee-related documentation for your organization.
        </p>
      </div>
    </div>
  );
}
