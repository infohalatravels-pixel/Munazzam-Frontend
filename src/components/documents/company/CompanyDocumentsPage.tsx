"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DEMO_COMPLIANCE_DOCUMENTS,
  type ComplianceDocument,
} from "@/lib/company/profile";
import {
  downloadComplianceDocument,
  fetchCompanyProfile,
} from "@/lib/company/profileApi";
import { summarizeCompanyDocuments } from "@/lib/documents/helpers";
import { ComplianceDocumentCard } from "@/components/company/profile/ComplianceDocumentCard";
import { DocumentViewModal } from "@/components/company/profile/DocumentViewModal";
import { UploadDocumentModal } from "@/components/company/profile/UploadDocumentModal";
import { CompanyDocumentsPageHeader } from "./CompanyDocumentsPageHeader";

export function CompanyDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] =
    useState<ComplianceDocument[]>(DEMO_COMPLIANCE_DOCUMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewDocument, setViewDocument] = useState<ComplianceDocument | null>(null);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCompanyProfile();
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load company documents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const summary = summarizeCompanyDocuments(documents);

  function handleDocumentUploaded(document: ComplianceDocument) {
    setDocuments((prev) =>
      prev.map((item) => (item.id === document.id ? document : item))
    );
  }

  async function handleDownload(document: ComplianceDocument) {
    try {
      await downloadComplianceDocument(document);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <Link
          href="/dashboard/documents"
          className="mb-md inline-flex items-center gap-xs text-label-md text-primary md:hidden"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Documents
        </Link>

        <CompanyDocumentsPageHeader />

        {error ? (
          <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <div className="mb-lg flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm text-body-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface">{summary.uploaded}</span> of{" "}
            <span className="font-semibold text-on-surface">{summary.total}</span> documents
            uploaded
            {summary.missing > 0 ? (
              <span className="text-error"> · {summary.missing} missing</span>
            ) : null}
          </div>

          <div className="flex gap-sm">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="flex min-h-11 items-center justify-center gap-xs rounded-lg bg-primary px-lg py-2.5 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">upload</span>
              Upload Document
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/documents")}
              className="hidden min-h-11 items-center gap-xs rounded-lg border border-outline-variant bg-white px-md py-2.5 text-label-md text-on-surface transition-all hover:bg-surface-container sm:inline-flex"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Back to Hub
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="py-xl text-center text-body-md text-on-surface-variant">
            Loading company documents...
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3 lg:gap-lg">
            {documents.map((document) => (
              <ComplianceDocumentCard
                key={document.id}
                document={document}
                onView={setViewDocument}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      <DocumentViewModal
        open={Boolean(viewDocument)}
        document={viewDocument}
        onClose={() => setViewDocument(null)}
      />

      <UploadDocumentModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={handleDocumentUploaded}
      />
    </>
  );
}
