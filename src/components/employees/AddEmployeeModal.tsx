"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EmployeeStepperIndicator } from "@/components/employees/EmployeeStepperIndicator";
import { EmployeeDocumentsStep } from "@/components/employees/add-employee/EmployeeDocumentsStep";
import { EmployeePersonalStep } from "@/components/employees/add-employee/EmployeePersonalStep";
import { EmployeeVisaStep } from "@/components/employees/add-employee/EmployeeVisaStep";
import { createEmployee, fetchDepartments, type Department } from "@/lib/employees/api";
import {
  EMPTY_ADD_EMPLOYEE_FORM,
  EMPLOYEE_WIZARD_STEPS,
  type AddEmployeeFormData,
} from "@/lib/employees/onboardingTypes";

const TOTAL_STEPS = EMPLOYEE_WIZARD_STEPS.length;

type AddEmployeeModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export function AddEmployeeModal({ open, onClose, onCreated }: AddEmployeeModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachableStep, setMaxReachableStep] = useState(1);
  const [form, setForm] = useState<AddEmployeeFormData>(EMPTY_ADD_EMPLOYEE_FORM);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [visaFiles, setVisaFiles] = useState<File[]>([]);
  const [passportFiles, setPassportFiles] = useState<File[]>([]);
  const [qidFiles, setQidFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    setCurrentStep(1);
    setMaxReachableStep(1);
    setForm(EMPTY_ADD_EMPLOYEE_FORM);
    setPhotoFile(null);
    setPhotoPreview(null);
    setVisaFiles([]);
    setPassportFiles([]);
    setQidFiles([]);
    setError(null);
    setIsSaving(false);

    fetchDepartments()
      .then(setDepartments)
      .catch(() => setDepartments([]));
  }, [open]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function updateField<K extends keyof AddEmployeeFormData>(
    key: K,
    value: AddEmployeeFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function handlePhotoChange(file: File | null, preview: string | null) {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(preview);
  }

  function validateStep(step: number): string | null {
    if (step === 1) {
      if (!form.departmentId) return "Department is required.";
      if (!form.nameAsPassport.trim()) return "Full name (as on passport) is required.";
      if (!form.phoneNo.trim()) return "Phone number is required.";
      if (!form.nationality.trim()) return "Nationality is required.";
      if (!form.passportNo.trim()) return "Passport number is required.";
      if (!form.passportExpiry) return "Passport expiry date is required.";
      if (!form.salary.trim()) return "Salary is required.";
      if (!form.joinDate) return "Join date is required.";
    }

    if (step === 2) {
      if (!form.visaNumber.trim()) return "Visa number is required.";
      if (!form.visaIssueDate) return "Visa issue date is required.";
      if (!form.visaExpiryDate) return "Visa expiry date is required.";
      if (!form.professionOnVisa.trim()) return "Profession on visa is required.";
    }

    if (step === 3) {
      if (visaFiles.length === 0) return "Visa copy upload is required.";
      if (passportFiles.length === 0) return "Passport copy upload is required.";
    }

    return null;
  }

  async function handleNext() {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxReachableStep((prev) => Math.max(prev, nextStep));
      setError(null);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await createEmployee(form, {
        photo: photoFile,
        visa: visaFiles[0] || null,
        passport: passportFiles[0] || null,
        qid: qidFiles[0] || null,
      });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add employee.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
      setError(null);
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div className="app-modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-employee-title"
        className="app-modal-panel app-modal-panel--xl flex max-h-[92vh] flex-col"
      >
        <div className="shrink-0 border-b border-outline-variant px-xl py-lg">
          <div className="flex items-start justify-between gap-md">
            <div className="min-w-0 flex-1">
              <p className="text-label-sm text-primary">Employee Onboarding</p>
              <h2 id="add-employee-title" className="text-headline-sm text-on-surface">
                Add New Employee
              </h2>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Complete identity, Qatar visa details, and compliance documents.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-sm">
              <span className="rounded-full bg-primary/10 px-sm py-1 text-label-sm text-primary">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-xl pt-lg pb-md">
          <EmployeeStepperIndicator
            steps={EMPLOYEE_WIZARD_STEPS}
            currentStep={currentStep}
            maxReachableStep={maxReachableStep}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-xl pb-md">
          {error ? (
            <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
              {error}
            </div>
          ) : null}

          <div className="w-full min-w-0 rounded-2xl border border-outline-variant bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            {currentStep === 1 && (
              <EmployeePersonalStep
                form={form}
                departments={departments}
                photoFile={photoFile}
                photoPreview={photoPreview}
                onFieldChange={updateField}
                onPhotoChange={handlePhotoChange}
              />
            )}
            {currentStep === 2 && (
              <EmployeeVisaStep form={form} onFieldChange={updateField} />
            )}
            {currentStep === 3 && (
              <EmployeeDocumentsStep
                visaFiles={visaFiles}
                passportFiles={passportFiles}
                qidFiles={qidFiles}
                onVisaFilesChange={setVisaFiles}
                onPassportFilesChange={setPassportFiles}
                onQidFilesChange={setQidFiles}
              />
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-outline-variant bg-surface-container-low/50 px-xl py-lg">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isSaving}
            className="flex items-center gap-sm rounded-lg px-lg py-sm text-label-md text-on-surface-variant transition-all hover:bg-surface-container disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSaving}
            className="flex items-center gap-sm rounded-lg bg-primary px-xl py-sm text-label-md text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
          >
            {isSaving
              ? "Saving..."
              : currentStep === TOTAL_STEPS
                ? "Add Employee"
                : "Next"}
            <span className="material-symbols-outlined">
              {currentStep === TOTAL_STEPS ? "check_circle" : "arrow_forward"}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
