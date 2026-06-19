"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchEmployeeById, type EmployeeDetail } from "@/lib/employees/api";
import {
  downloadEmployeeDocument,
  type EmployeeDocument,
  type UploadEmployeeDocKey,
} from "@/lib/employees/documents";
import { groupEmployeeDocuments } from "@/lib/documents/helpers";
import { EmployeeDocumentViewModal } from "@/components/employees/view/EmployeeDocumentViewModal";
import { EmployeeUploadDocumentModal } from "@/components/employees/view/EmployeeUploadDocumentModal";
import { EmployeeDocumentsTable } from "./EmployeeDocumentsTable";

export function EmployeeDocumentRecordsPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId as string;

  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewDocument, setViewDocument] = useState<EmployeeDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocKey, setUploadDocKey] = useState<UploadEmployeeDocKey | null>(null);

  const loadEmployee = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEmployeeById(employeeId);
      setEmployee(data);
    } catch (err) {
      setEmployee(null);
      setError(err instanceof Error ? err.message : "Failed to load employee documents.");
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const sections = useMemo(
    () => (employee ? groupEmployeeDocuments(employee.documents) : []),
    [employee]
  );

  const verifiedCount = useMemo(
    () => employee?.documents.filter((doc) => doc.hasFile).length ?? 0,
    [employee]
  );

  function handleDocumentUploaded(document: EmployeeDocument) {
    setEmployee((prev) => {
      if (!prev) return prev;
      const documents = prev.documents.map((item) =>
        item.id === document.id ? document : item
      );
      const hasPhoto = document.id === "photo" ? true : prev.hasPhoto;
      return { ...prev, documents, hasPhoto };
    });
  }

  async function handleDownload(document: EmployeeDocument) {
    try {
      await downloadEmployeeDocument(employeeId, document);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <p className="py-xl text-center text-body-md text-on-surface-variant">
          Loading document records...
        </p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <div className="rounded-xl border border-error/20 bg-error-container p-xl text-body-md text-on-error-container">
          {error || "Employee not found."}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <nav className="mb-md">
          <ol className="flex flex-wrap items-center gap-xs text-label-sm text-on-surface-variant">
            <li>
              <Link href="/dashboard/documents" className="hover:text-primary">
                Documents
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </li>
            <li>
              <Link href="/dashboard/documents/employees" className="hover:text-primary">
                Employees
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </li>
            <li className="font-semibold text-primary">{employee.nameAsPassport}</li>
          </ol>
        </nav>

        <div className="mb-xl flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-md">
            <button
              type="button"
              onClick={() => router.push("/dashboard/documents/employees")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-white shadow-sm transition-all hover:bg-surface-container-low active:scale-95"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <div>
              <h2 className="text-headline-lg text-on-surface">
                {employee.nameAsPassport}: Document Records
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Centralized repository for administrative and legal compliance files.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setUploadDocKey("passport");
              setShowUploadModal(true);
            }}
            className="flex min-h-11 items-center justify-center gap-xs rounded-lg bg-primary px-lg py-2.5 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">upload</span>
            Upload New
          </button>
        </div>

        {error ? (
          <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <div className="mb-xl flex flex-col gap-lg rounded-2xl border border-outline-variant bg-white/80 p-md shadow-sm backdrop-blur-sm lg:flex-row lg:items-center">
          <div className="flex items-center gap-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-white bg-surface-container-low text-primary shadow-sm">
              <span className="material-symbols-outlined text-[32px]">person</span>
            </div>
            <div>
              <h3 className="text-headline-sm text-on-surface">{employee.nameAsPassport}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded bg-surface-container-high px-2 py-0.5 text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">badge</span>
                  {employee.employeeCode}
                </span>
                <span className="flex items-center gap-1.5 rounded bg-surface-container-high px-2 py-0.5 text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
                  {employee.department || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden h-12 w-px bg-outline-variant lg:block" />

          <div className="grid flex-1 grid-cols-1 gap-md sm:grid-cols-3">
            <div>
              <p className="mb-1 text-label-sm uppercase tracking-wider text-on-surface-variant">
                Status
              </p>
              <span className="inline-flex items-center gap-1 text-label-md text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {employee.employmentStatus}
              </span>
            </div>
            <div>
              <p className="mb-1 text-label-sm uppercase tracking-wider text-on-surface-variant">
                Joining Date
              </p>
              <p className="text-label-md font-semibold">{employee.joinDate}</p>
            </div>
            <div>
              <p className="mb-1 text-label-sm uppercase tracking-wider text-on-surface-variant">
                Total Records
              </p>
              <p className="text-label-md font-semibold">{verifiedCount} Verified</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-xl">
          {sections.map((section) => (
            <EmployeeDocumentsTable
              key={section.id}
              title={section.title}
              icon={section.icon}
              documents={section.documents}
              onView={setViewDocument}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </div>

      <EmployeeDocumentViewModal
        open={Boolean(viewDocument)}
        employeeId={employeeId}
        document={viewDocument}
        onClose={() => setViewDocument(null)}
      />

      <EmployeeUploadDocumentModal
        open={showUploadModal}
        employeeId={employeeId}
        initialDocKey={uploadDocKey}
        onClose={() => {
          setShowUploadModal(false);
          setUploadDocKey(null);
        }}
        onUploaded={handleDocumentUploaded}
      />
    </>
  );
}
