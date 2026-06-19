import type { ComplianceDocument } from "@/lib/company/profile";

type ComplianceDocumentCardProps = {
  document: ComplianceDocument;
  onView: (document: ComplianceDocument) => void;
  onDownload: (document: ComplianceDocument) => void;
};

export function ComplianceDocumentCard({
  document,
  onView,
  onDownload,
}: ComplianceDocumentCardProps) {
  const hasFile = Boolean(document.documentId);

  return (
    <div className="group flex flex-col rounded-xl border border-outline-variant bg-surface p-md card-shadow transition-all hover:border-primary sm:p-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-primary/5 p-3 text-primary">
          <span className="material-symbols-outlined text-[32px]">
            {document.icon}
          </span>
        </div>
        <span
          className={[
            "rounded-md px-2 py-1 text-[10px] font-bold tracking-tighter uppercase",
            document.statusClassName,
          ].join(" ")}
        >
          {document.status}
        </span>
      </div>

      <h4 className="text-label-md font-bold">{document.title}</h4>
      <p className="mb-6 text-label-sm text-on-surface-variant">
        {document.subtitle}
      </p>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={() => onView(document)}
          disabled={!hasFile}
          className="flex-1 rounded bg-surface-container-high py-2 text-label-sm font-bold transition-colors hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-50"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onDownload(document)}
          disabled={!hasFile}
          className="p-2 text-on-surface-variant transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Download ${document.title}`}
        >
          <span className="material-symbols-outlined">download</span>
        </button>
      </div>
    </div>
  );
}
