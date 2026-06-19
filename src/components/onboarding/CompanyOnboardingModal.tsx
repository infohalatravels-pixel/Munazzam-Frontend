"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DocumentDropzone } from "@/components/onboarding/DocumentDropzone";
import { StepperIndicator } from "@/components/onboarding/StepperIndicator";
import {
  fetchOnboardingState,
  getStepPayload,
  saveOnboardingStep,
  validateStepClient,
} from "@/lib/company/api";
import {
  COMPANY_TYPE_OPTIONS,
  EMPTY_ONBOARDING_FORM,
  LEGAL_FORM_OPTIONS,
  type OnboardingFormData,
} from "@/lib/company/types";
import { updateSessionUser, type SessionUser } from "@/lib/auth/session";

type CompanyOnboardingModalProps = {
  user: SessionUser;
  onComplete: (user: SessionUser) => void;
};

const inputClassName =
  "w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-body-md text-on-surface transition-colors focus:border-primary focus:ring-3 focus:ring-primary/10";

const selectClassName = `${inputClassName} cursor-pointer`;

function FieldLabel({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <label
      className={[
        "block text-label-sm text-on-surface-variant",
        align === "right" ? "text-right" : "",
      ].join(" ")}
    >
      {children}
    </label>
  );
}

export function CompanyOnboardingModal({
  user,
  onComplete,
}: CompanyOnboardingModalProps) {
  const [form, setForm] = useState<OnboardingFormData>(EMPTY_ONBOARDING_FORM);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachableStep, setMaxReachableStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crDocuments, setCrDocuments] = useState<File[]>([]);
  const [establishmentDocuments, setEstablishmentDocuments] = useState<File[]>(
    []
  );
  const [signatoryDocuments, setSignatoryDocuments] = useState<File[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      try {
        const state = await fetchOnboardingState();
        if (cancelled) return;

        setForm({
          ...EMPTY_ONBOARDING_FORM,
          ...state.formData,
          email: state.formData.email || user.email,
          phoneNo: state.formData.phoneNo || user.phoneNo || "",
        });
        setCurrentStep(
          state.isCompanySetup
            ? 5
            : Math.min(Math.max(state.onboardingStep, 1), 5)
        );
        setMaxReachableStep(
          state.isCompanySetup
            ? 5
            : Math.min(Math.max(state.onboardingStep, 1), 5)
        );

        if (state.isCompanySetup) {
          const completedUser = {
            ...user,
            isCompanySetup: true,
            onboardingStep: state.onboardingStep,
          };
          updateSessionUser(completedUser);
          onCompleteRef.current(completedUser);
          return;
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load onboarding progress."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadState();

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  function updateField<K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  async function handleNext() {
    const validationError = validateStepClient(currentStep, form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await saveOnboardingStep(
        currentStep,
        getStepPayload(currentStep, form)
      );

      updateSessionUser(result.user);
      setForm({
        ...EMPTY_ONBOARDING_FORM,
        ...result.formData,
      });
      setMaxReachableStep(result.nextStep);

      if (result.completed) {
        onComplete(result.user);
        return;
      }

      setCurrentStep(result.nextStep);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save this step."
      );
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 p-md backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="flex max-h-[92vh] w-full min-w-0 max-w-5xl flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      >
        <div className="shrink-0 border-b border-outline-variant px-xl py-lg">
          <div className="flex items-start justify-between gap-md">
            <div>
              <p className="text-label-sm text-primary">Setup Mode</p>
              <h2
                id="onboarding-title"
                className="text-headline-sm text-on-surface"
              >
                Company Onboarding
              </h2>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Complete your company profile to unlock the dashboard.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-sm py-1 text-label-sm text-primary">
              Step {currentStep} of 5
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[320px] flex-1 items-center justify-center px-xl">
            <p className="text-body-md text-on-surface-variant">
              Loading your progress...
            </p>
          </div>
        ) : (
          <>
            <div className="shrink-0 px-xl pt-lg pb-md">
              <StepperIndicator
                currentStep={currentStep}
                maxReachableStep={maxReachableStep}
              />
            </div>

            <div className="min-h-0 w-full flex-1 overflow-y-auto px-xl pb-md">
              {error && (
                <div className="mb-lg rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
                  {error}
                </div>
              )}

              <div className="w-full min-w-0 rounded-2xl border border-outline-variant bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                {currentStep === 1 && (
                  <div className="space-y-lg p-xl">
                    <div className="border-b border-outline-variant pb-md">
                      <h3 className="text-headline-sm text-on-surface">
                        Step 1: Company Identity
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Define the legal and operational names of your entity.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                      <div className="space-y-xs">
                        <FieldLabel>Legal Name (English)</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="e.g. Al Mazrouei Enterprises"
                          value={form.legalNameEn || ""}
                          onChange={(event) =>
                            updateField("legalNameEn", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel align="right">
                          الاسم القانوني (عربي)
                        </FieldLabel>
                        <input
                          className={`${inputClassName} rtl`}
                          dir="rtl"
                          placeholder="مثال: مشاريع المزروعي"
                          value={form.legalNameAr || ""}
                          onChange={(event) =>
                            updateField("legalNameAr", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Trade Name (English)</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="e.g. Mazrouei Group"
                          value={form.tradeNameEn || ""}
                          onChange={(event) =>
                            updateField("tradeNameEn", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel align="right">الاسم التجاري (عربي)</FieldLabel>
                        <input
                          className={`${inputClassName} rtl`}
                          dir="rtl"
                          placeholder="مثال: مجموعة المزروعي"
                          value={form.tradeNameAr || ""}
                          onChange={(event) =>
                            updateField("tradeNameAr", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Company Type</FieldLabel>
                        <select
                          className={selectClassName}
                          value={form.companyType || "PRO_AGENCY"}
                          onChange={(event) =>
                            updateField(
                              "companyType",
                              event.target.value as OnboardingFormData["companyType"]
                            )
                          }
                        >
                          {COMPANY_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Legal Form</FieldLabel>
                        <select
                          className={selectClassName}
                          value={form.legalForm || ""}
                          onChange={(event) =>
                            updateField(
                              "legalForm",
                              event.target.value as OnboardingFormData["legalForm"]
                            )
                          }
                        >
                          <option value="">Select legal form</option>
                          {LEGAL_FORM_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-xs md:col-span-2">
                        <FieldLabel>Industry</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="e.g. Information Technology, Construction"
                          value={form.industry || ""}
                          onChange={(event) =>
                            updateField("industry", event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-lg p-xl">
                    <div className="border-b border-outline-variant pb-md">
                      <h3 className="text-headline-sm text-on-surface">
                        Step 2: Commercial Registration
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Enter your official CR details as registered with MOCI.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                      <div className="space-y-xs">
                        <FieldLabel>CR Number</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="123456"
                          value={form.crNumber || ""}
                          onChange={(event) =>
                            updateField("crNumber", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Issue Date</FieldLabel>
                        <input
                          className={inputClassName}
                          type="date"
                          value={form.crIssueDate || ""}
                          onChange={(event) =>
                            updateField("crIssueDate", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Expiry Date</FieldLabel>
                        <input
                          className={inputClassName}
                          type="date"
                          value={form.crExpiryDate || ""}
                          onChange={(event) =>
                            updateField("crExpiryDate", event.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DocumentDropzone
                      label="Commercial Registration Document"
                      hint="Upload a clear scan of your CR certificate"
                      files={crDocuments}
                      onFilesChange={setCrDocuments}
                    />
                    <div className="flex items-center gap-md rounded-xl bg-surface-container-low p-md">
                      <span className="material-symbols-outlined text-primary">
                        info
                      </span>
                      <p className="text-label-sm text-on-surface-variant">
                        Ensure dates match exactly as shown on the original
                        document.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-lg p-xl">
                    <div className="border-b border-outline-variant pb-md">
                      <h3 className="text-headline-sm text-on-surface">
                        Step 3: Address & Contact
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Provide communication channels and your physical national
                        address.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                      <div className="space-y-xs">
                        <FieldLabel>Email</FieldLabel>
                        <input
                          className={inputClassName}
                          type="email"
                          placeholder="contact@company.qa"
                          value={form.email || ""}
                          onChange={(event) =>
                            updateField("email", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Phone</FieldLabel>
                        <input
                          className={inputClassName}
                          type="tel"
                          placeholder="+974 4400 0000"
                          value={form.phoneNo || ""}
                          onChange={(event) =>
                            updateField("phoneNo", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Mobile</FieldLabel>
                        <input
                          className={inputClassName}
                          type="tel"
                          placeholder="+974 3300 0000"
                          value={form.mobileNo || ""}
                          onChange={(event) =>
                            updateField("mobileNo", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Website</FieldLabel>
                        <input
                          className={inputClassName}
                          type="url"
                          placeholder="https://www.company.qa"
                          value={form.website || ""}
                          onChange={(event) =>
                            updateField("website", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>P.O. Box</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="12345"
                          value={form.poBox || ""}
                          onChange={(event) =>
                            updateField("poBox", event.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-lg pt-md md:grid-cols-4">
                      <div className="space-y-xs">
                        <FieldLabel>Building No.</FieldLabel>
                        <input
                          className={inputClassName}
                          value={form.buildingNo || ""}
                          onChange={(event) =>
                            updateField("buildingNo", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Street No.</FieldLabel>
                        <input
                          className={inputClassName}
                          value={form.streetNo || ""}
                          onChange={(event) =>
                            updateField("streetNo", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Zone No.</FieldLabel>
                        <input
                          className={inputClassName}
                          value={form.zoneNo || ""}
                          onChange={(event) =>
                            updateField("zoneNo", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>City</FieldLabel>
                        <input
                          className={inputClassName}
                          value={form.city || "Doha"}
                          onChange={(event) =>
                            updateField("city", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs md:col-span-2">
                        <FieldLabel>Area</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="West Bay, Lusail, etc."
                          value={form.area || ""}
                          onChange={(event) =>
                            updateField("area", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs md:col-span-2">
                        <FieldLabel>Country</FieldLabel>
                        <input
                          className={`${inputClassName} cursor-not-allowed bg-surface-container-low text-on-surface-variant`}
                          readOnly
                          value={form.country || "Qatar"}
                        />
                      </div>
                    </div>
                    <div className="space-y-xs">
                      <FieldLabel>Full National Address</FieldLabel>
                      <textarea
                        className={`${inputClassName} min-h-[120px] resize-y`}
                        placeholder="Provide complete address description for official mail..."
                        rows={4}
                        value={form.nationalAddress || ""}
                        onChange={(event) =>
                          updateField("nationalAddress", event.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-lg p-xl">
                    <div className="border-b border-outline-variant pb-md">
                      <h3 className="text-headline-sm text-on-surface">
                        Step 4: Establishment & Signatory
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Identify the authorized signatory and establishment card
                        details.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                      <div className="space-y-xs">
                        <FieldLabel>Establishment Card No.</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="00-0000-00"
                          value={form.establishmentCardNo || ""}
                          onChange={(event) =>
                            updateField("establishmentCardNo", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Establishment Expiry</FieldLabel>
                        <input
                          className={inputClassName}
                          type="date"
                          value={form.establishmentCardExpiry || ""}
                          onChange={(event) =>
                            updateField(
                              "establishmentCardExpiry",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Sponsor File No.</FieldLabel>
                        <input
                          className={inputClassName}
                          value={form.sponsorFileNo || ""}
                          onChange={(event) =>
                            updateField("sponsorFileNo", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Signatory Name</FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="As per QID"
                          value={form.signatoryName || ""}
                          onChange={(event) =>
                            updateField("signatoryName", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>QID (11 digits)</FieldLabel>
                        <input
                          className={inputClassName}
                          maxLength={11}
                          placeholder="28000000000"
                          value={form.signatoryQid || ""}
                          onChange={(event) =>
                            updateField("signatoryQid", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>QID Expiry</FieldLabel>
                        <input
                          className={inputClassName}
                          type="date"
                          value={form.signatoryQidExpiry || ""}
                          onChange={(event) =>
                            updateField("signatoryQidExpiry", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-xs md:col-span-2">
                        <FieldLabel>Signatory Phone</FieldLabel>
                        <input
                          className={inputClassName}
                          type="tel"
                          value={form.signatoryPhone || ""}
                          onChange={(event) =>
                            updateField("signatoryPhone", event.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DocumentDropzone
                      label="Establishment Card Document"
                      files={establishmentDocuments}
                      onFilesChange={setEstablishmentDocuments}
                    />
                    <DocumentDropzone
                      label="Signatory QID Copy"
                      files={signatoryDocuments}
                      onFilesChange={setSignatoryDocuments}
                    />
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="w-full space-y-xl p-xl">
                    <div className="border-b border-outline-variant pb-md">
                      <h3 className="text-headline-sm text-on-surface">
                        Step 5: Operational Limits
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Configure initial system allocations for visas and storage.
                      </p>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-lg sm:grid-cols-3">
                      <div className="space-y-xs">
                        <FieldLabel>Initial Visa Allocation</FieldLabel>
                        <input
                          className={inputClassName}
                          type="number"
                          min={0}
                          value={form.visaAllocated ?? 10}
                          onChange={(event) =>
                            updateField(
                              "visaAllocated",
                              Number.parseInt(event.target.value, 10) || 0
                            )
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Max Employee Count</FieldLabel>
                        <input
                          className={inputClassName}
                          type="number"
                          min={1}
                          value={form.maxEmployees ?? 50}
                          onChange={(event) =>
                            updateField(
                              "maxEmployees",
                              Number.parseInt(event.target.value, 10) || 0
                            )
                          }
                        />
                      </div>
                      <div className="space-y-xs">
                        <FieldLabel>Storage Limit (GB)</FieldLabel>
                        <input
                          className={inputClassName}
                          type="number"
                          min={1}
                          value={form.maxStorageGb ?? 1024}
                          onChange={(event) =>
                            updateField(
                              "maxStorageGb",
                              Number.parseInt(event.target.value, 10) || 0
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="w-full rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-xl">
                      <div className="grid w-full grid-cols-[auto_1fr] items-center gap-lg">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-4xl">
                            task_alt
                          </span>
                        </div>
                        <div className="text-left">
                          <h4 className="text-headline-sm text-on-surface">
                            Ready to Finalize
                          </h4>
                          <p className="mt-sm text-body-sm leading-relaxed text-on-surface-variant">
                            By clicking complete, you confirm that all provided
                            information is accurate and matches official government
                            registrations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                disabled={isSaving || isLoading}
                className="flex items-center gap-sm rounded-lg bg-primary px-xl py-sm text-label-md text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : currentStep === 5
                    ? "Complete Onboarding"
                    : "Next"}
                <span className="material-symbols-outlined">
                  {currentStep === 5 ? "check_circle" : "arrow_forward"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
