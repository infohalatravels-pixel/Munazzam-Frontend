"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  deleteEmployee,
  fetchEmployeeById,
  type EmployeeDetail,
} from "@/lib/employees/api";
import {
  downloadEmployeeDocument,
  type EmployeeDocument,
  type UploadEmployeeDocKey,
} from "@/lib/employees/documents";
import { formatDateTime } from "@/lib/employees/viewHelpers";
import { EmployeeDocumentViewModal } from "./view/EmployeeDocumentViewModal";
import { EmployeeIdentityCard } from "./view/EmployeeIdentityCard";
import { EmployeeLegalDocumentsCard } from "./view/EmployeeLegalDocumentsCard";
import { EmployeeProfessionalCard } from "./view/EmployeeProfessionalCard";
import { EmployeeUploadDocumentModal } from "./view/EmployeeUploadDocumentModal";
import { EmployeeExpenseHistoryModal } from "./view/EmployeeExpenseHistoryModal";
import { EmployeeViewHeader } from "./view/EmployeeViewHeader";
import { EmployeeVisaCard } from "./view/EmployeeVisaCard";

export function EmployeeViewPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewDocument, setViewDocument] = useState<EmployeeDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocKey, setUploadDocKey] = useState<UploadEmployeeDocKey | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const loadEmployee = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEmployeeById(employeeId);
      setEmployee(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employee.");
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const visaDocument = useMemo(
    () => employee?.documents.find((doc) => doc.id === "visa"),
    [employee?.documents]
  );

  function openUpload(docKey: UploadEmployeeDocKey) {
    setUploadDocKey(docKey);
    setShowUploadModal(true);
  }

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

  async function handleDelete() {
    if (!employee) return;
    const confirmed = window.confirm(
      `Delete ${employee.name}? This will remove the employee from your active list.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteEmployee(employeeId);
      router.push("/dashboard/employees");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl p-gutter md:p-gutter">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-body-md text-on-surface-variant">
          Loading employee profile...
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="mx-auto w-full max-w-7xl p-gutter md:p-gutter">
        <div className="rounded-xl border border-error/20 bg-error-container p-xl text-body-md text-on-error-container">
          {error || "Employee not found."}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-lg p-gutter md:p-gutter">
        {error ? (
          <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        ) : null}

        <EmployeeViewHeader
          employee={employee}
          onViewExpenses={() => setShowExpenseModal(true)}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
          <EmployeeIdentityCard employee={employee} onUpload={openUpload} />
          <EmployeeProfessionalCard employee={employee} />
          <EmployeeLegalDocumentsCard
            documents={employee.documents}
            onView={setViewDocument}
            onDownload={handleDownload}
            onUpload={openUpload}
          />
          <EmployeeVisaCard
            employee={employee}
            visaDocument={visaDocument}
            onUpload={openUpload}
            onView={setViewDocument}
            onDownload={handleDownload}
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-md border-t border-outline-variant py-lg sm:flex-row">
          <p className="text-label-sm text-on-surface-variant">
            Last updated: {formatDateTime(employee.updatedAt)} by {employee.createdByName}
          </p>
          <div className="flex gap-sm">
            <button
              type="button"
              disabled
              className="rounded-lg px-lg py-2 text-label-md text-on-surface-variant opacity-50"
              title="Coming soon"
            >
              Print Record
            </button>
            <button
              type="button"
              onClick={() => openUpload("passport")}
              className="rounded-lg bg-primary px-lg py-2 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container"
            >
              Upload Document
            </button>
          </div>
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

      <EmployeeExpenseHistoryModal
        open={showExpenseModal}
        employeeId={employeeId}
        employeeName={employee.name}
        employeeCode={employee.employeeCode}
        onClose={() => setShowExpenseModal(false)}
      />
    </>
  );
}
