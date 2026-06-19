"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import {
  EMPLOYEE_TYPE_OPTIONS,
  type AddEmployeeFormData,
} from "@/lib/employees/onboardingTypes";
import type { Department } from "@/lib/employees/api";
import { FieldLabel } from "./FieldLabel";
import { inputClassName, selectClassName } from "./formStyles";

type EmployeePersonalStepProps = {
  form: AddEmployeeFormData;
  departments: Department[];
  photoFile: File | null;
  photoPreview: string | null;
  onFieldChange: <K extends keyof AddEmployeeFormData>(
    key: K,
    value: AddEmployeeFormData[K]
  ) => void;
  onPhotoChange: (file: File | null, preview: string | null) => void;
};

export function EmployeePersonalStep({
  form,
  departments,
  photoFile,
  photoPreview,
  onFieldChange,
  onPhotoChange,
}: EmployeePersonalStepProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoSelect(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    onPhotoChange(file, preview);
  }

  return (
    <div className="space-y-lg p-xl">
      <StepHeader
        title="Step 1: Personal & Employment"
        description="Enter employee identity and employment details exactly as shown on the passport."
      />

      <div className="flex flex-col gap-lg border-b border-outline-variant pb-lg md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-sm">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-outline-variant bg-surface-container-low">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Employee preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                person
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="text-label-sm text-primary hover:underline"
          >
            {photoFile ? "Change photo" : "Upload photo (optional)"}
          </button>
          {photoFile ? (
            <button
              type="button"
              onClick={() => onPhotoChange(null, null)}
              className="text-label-sm text-error hover:underline"
            >
              Remove
            </button>
          ) : null}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              handlePhotoSelect(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-lg md:grid-cols-2">
          <FieldGroup label="Full Name (as on passport)" className="md:col-span-2">
            <input
              className={inputClassName}
              placeholder="e.g. Ahmad Hassan Al-Mansouri"
              value={form.nameAsPassport}
              onChange={(event) => onFieldChange("nameAsPassport", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Phone No">
            <input
              className={inputClassName}
              placeholder="+974 XXXX XXXX"
              value={form.phoneNo}
              onChange={(event) => onFieldChange("phoneNo", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Nationality">
            <input
              className={inputClassName}
              placeholder="e.g. Qatari, Indian, British"
              value={form.nationality}
              onChange={(event) => onFieldChange("nationality", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Employee Type">
            <select
              className={selectClassName}
              value={form.employeeType}
              onChange={(event) =>
                onFieldChange(
                  "employeeType",
                  event.target.value as AddEmployeeFormData["employeeType"]
                )
              }
            >
              {EMPLOYEE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label="Passport No">
            <input
              className={inputClassName}
              placeholder="Passport number"
              value={form.passportNo}
              onChange={(event) => onFieldChange("passportNo", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Passport Expiry">
            <input
              type="date"
              className={inputClassName}
              value={form.passportExpiry}
              onChange={(event) => onFieldChange("passportExpiry", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="QID Number (optional)">
            <input
              className={inputClassName}
              placeholder="11-digit QID"
              maxLength={11}
              value={form.qidNo}
              onChange={(event) => onFieldChange("qidNo", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="QID Expiry (optional)">
            <input
              type="date"
              className={inputClassName}
              value={form.qidExpiry}
              onChange={(event) => onFieldChange("qidExpiry", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Salary (QAR)">
            <input
              type="number"
              min={0}
              className={inputClassName}
              placeholder="Monthly salary"
              value={form.salary}
              onChange={(event) => onFieldChange("salary", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Join Date">
            <input
              type="date"
              className={inputClassName}
              value={form.joinDate}
              onChange={(event) => onFieldChange("joinDate", event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Department">
            <select
              className={selectClassName}
              value={form.departmentId}
              onChange={(event) => onFieldChange("departmentId", event.target.value)}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label="Designation (optional)">
            <input
              className={inputClassName}
              placeholder="e.g. Site Supervisor"
              value={form.designation}
              onChange={(event) => onFieldChange("designation", event.target.value)}
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

function StepHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-outline-variant pb-md">
      <h3 className="text-headline-sm text-on-surface">{title}</h3>
      <p className="text-body-sm text-on-surface-variant">{description}</p>
    </div>
  );
}

function FieldGroup({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["space-y-xs", className].join(" ")}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}
