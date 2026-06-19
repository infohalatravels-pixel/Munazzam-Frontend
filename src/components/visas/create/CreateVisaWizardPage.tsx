"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VisaWizardStepper } from "./VisaWizardStepper";
import {
  DEFAULT_PAYMENT_MILESTONES,
  HOME_COUNTRY_MEDICAL_CODES,
  NATIONALITY_OPTIONS,
} from "@/lib/visas/constants";
import { createVisaApplication, fetchVisaQuotaOptions, type VisaQuotaOption } from "@/lib/visas/api";
import type { VisaEmployeeType, VisaFinancialModel } from "@/lib/visas/types";

const TOTAL_STEPS = 6;

export function CreateVisaWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [financialModel, setFinancialModel] = useState<VisaFinancialModel>("CLIENT_PAYS");
  const [quotaOptions, setQuotaOptions] = useState<VisaQuotaOption[]>([]);
  const [quotaId, setQuotaId] = useState("");
  const [nationality, setNationality] = useState("PK");
  const [employeeType, setEmployeeType] = useState<VisaEmployeeType>("FREELANCER");
  const [createInactiveEmployee, setCreateInactiveEmployee] = useState(true);
  const [applicantName, setApplicantName] = useState("");
  const [profession, setProfession] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [qmcCenter, setQmcCenter] = useState("");
  const [qmcCity, setQmcCity] = useState("");
  const [qmcAppointment, setQmcAppointment] = useState("");
  const [isLoadingQuotas, setIsLoadingQuotas] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuotas = useCallback(async () => {
    setIsLoadingQuotas(true);
    try {
      const data = await fetchVisaQuotaOptions();
      setQuotaOptions(data.options);
      if (data.options[0]) setQuotaId(data.options[0].id);
    } catch {
      setQuotaOptions([]);
    } finally {
      setIsLoadingQuotas(false);
    }
  }, []);

  useEffect(() => {
    loadQuotas();
  }, [loadQuotas]);

  const selectedQuota = useMemo(
    () => quotaOptions.find((q) => q.id === quotaId) ?? quotaOptions[0] ?? null,
    [quotaId, quotaOptions]
  );

  const nationalityLabel =
    NATIONALITY_OPTIONS.find((n) => n.code === nationality)?.label ?? nationality;

  const showPakistanPanel = HOME_COUNTRY_MEDICAL_CODES.has(nationality);
  const isFreelancer = financialModel === "CLIENT_PAYS";
  const skipPaymentStep = !isFreelancer;

  async function submitApplication() {
    if (!applicantName.trim() || !passportNo.trim() || !passportExpiry || !profession.trim()) {
      setError("Complete applicant details before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createVisaApplication({
        financialModel,
        allocationId: quotaId || undefined,
        applicantName: applicantName.trim(),
        nationality: nationalityLabel,
        nationalityCode: nationality,
        passportNo: passportNo.trim(),
        passportExpiry,
        professionOnVisa: profession.trim(),
        employeeType,
        createInactiveEmployee,
        medicalCenterName: qmcCenter.trim() || undefined,
        medicalCenterCity: qmcCity.trim() || undefined,
        medicalAppointmentDate: qmcAppointment || undefined,
      });
      router.push(`/dashboard/visas/${result.application.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create visa application.");
      setIsSubmitting(false);
    }
  }

  function nextStep() {
    if (step === TOTAL_STEPS) {
      submitApplication();
      return;
    }
    let next = step + 1;
    if (next === 5 && skipPaymentStep) next = 6;
    setStep(next);
  }

  function prevStep() {
    if (step <= 1) return;
    let prev = step - 1;
    if (prev === 5 && skipPaymentStep) prev = 4;
    setStep(prev);
  }

  function handleFinancialModelChange(model: VisaFinancialModel) {
    setFinancialModel(model);
    if (model === "COMPANY_PAYS") {
      setEmployeeType("PERMANENT");
    } else {
      setEmployeeType("FREELANCER");
    }
  }

  const displayName = applicantName.trim() || "MOHAMMED AHMAD KHAN";
  const displayProfession = profession.trim() || "Software Engineer";
  const totalFees = DEFAULT_PAYMENT_MILESTONES.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="mx-auto max-w-[1000px] px-gutter py-xl">
      <div className="mb-xl">
        <nav className="mb-sm flex items-center gap-xs text-on-surface-variant">
          <Link href="/dashboard/visas" className="text-label-sm hover:text-primary">
            Visas
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-label-sm font-bold text-primary">New Application</span>
        </nav>
        <h2 className="text-headline-lg tracking-tight text-primary">Visa Issuance Wizard</h2>
        <p className="mt-xs text-body-md text-on-surface-variant">
          New Application — Create and manage employee residency documents.
        </p>
      </div>

      <VisaWizardStepper currentStep={step} />

      {error ? (
        <div className="mb-md rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="flex min-h-[500px] flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-2xl shadow-sm">
        <div className="flex-grow">
          {step === 1 && (
            <div className="space-y-lg">
              <h3 className="mb-md text-headline-sm text-on-surface">Select Visa Category</h3>
              <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                <label className="group relative block cursor-pointer">
                  <input
                    type="radio"
                    name="visa_type"
                    className="peer sr-only"
                    checked={financialModel === "CLIENT_PAYS"}
                    onChange={() => handleFinancialModelChange("CLIENT_PAYS")}
                  />
                  <div className="rounded-xl border-2 border-outline-variant p-lg transition-all group-hover:border-primary-container peer-checked:border-primary-container peer-checked:bg-primary/5">
                    <div className="mb-md flex items-start justify-between">
                      <span className="material-symbols-outlined text-[32px] text-primary">person_pin</span>
                    </div>
                    <h4 className="mb-xs text-headline-sm">Freelancer Visa</h4>
                    <p className="text-body-sm text-on-surface-variant">
                      The client is responsible for all associated fees and government charges.
                    </p>
                  </div>
                </label>
                <label className="group relative block cursor-pointer">
                  <input
                    type="radio"
                    name="visa_type"
                    className="peer sr-only"
                    checked={financialModel === "COMPANY_PAYS"}
                    onChange={() => handleFinancialModelChange("COMPANY_PAYS")}
                  />
                  <div className="rounded-xl border-2 border-outline-variant p-lg transition-all group-hover:border-primary-container peer-checked:border-primary-container peer-checked:bg-primary/5">
                    <div className="mb-md flex items-start justify-between">
                      <span className="material-symbols-outlined text-[32px] text-primary">business</span>
                    </div>
                    <h4 className="mb-xs text-headline-sm">Company Employee</h4>
                    <p className="text-body-sm text-on-surface-variant">
                      Company handles all fees through corporate account allocation.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-lg">
              <h3 className="mb-md text-headline-sm text-on-surface">Available Country Quota</h3>
              {isLoadingQuotas ? (
                <p className="text-body-sm text-on-surface-variant">Loading quota options...</p>
              ) : quotaOptions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-outline-variant p-md text-body-sm text-on-surface-variant">
                  No VP allocations available.{" "}
                  <Link href="/dashboard/visas/allocations" className="text-primary hover:underline">
                    Add an allocation first
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-xs block text-label-sm text-on-surface-variant">
                      Select Nationality Quota
                    </label>
                    <select
                      value={quotaId}
                      onChange={(e) => setQuotaId(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-on-surface"
                    >
                      {quotaOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label} ({opt.available} available)
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedQuota ? (
                    <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
                      <div className="rounded-lg border border-outline-variant bg-surface-container p-md">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Quota Reference
                        </p>
                        <p className="text-headline-sm text-primary">{selectedQuota.vpNumber}</p>
                      </div>
                      <div className="rounded-lg border border-outline-variant bg-surface-container p-md">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Total Slots
                        </p>
                        <p className="text-headline-sm text-on-surface">{selectedQuota.total}</p>
                      </div>
                      <div className="rounded-lg border-2 border-primary-container bg-primary-container/10 p-md">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Available</p>
                        <p className="text-headline-sm text-primary">{selectedQuota.available}</p>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-lg">
              <h3 className="mb-md text-headline-sm text-on-surface">Applicant Details</h3>
              <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-xs block text-label-sm text-on-surface-variant">
                    Full Name (As per Passport)
                  </label>
                  <input
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md"
                    placeholder="e.g. MOHAMMED AHMAD KHAN"
                  />
                </div>
                <div>
                  <label className="mb-xs block text-label-sm text-on-surface-variant">Nationality</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md"
                  >
                    {NATIONALITY_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-xs block text-label-sm text-on-surface-variant">
                    Profession on Visa
                  </label>
                  <input
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="mb-xs block text-label-sm text-on-surface-variant">
                    Passport Number
                  </label>
                  <input
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md"
                    placeholder="L12345678"
                  />
                </div>
                <div>
                  <label className="mb-xs block text-label-sm text-on-surface-variant">
                    Passport Expiry
                  </label>
                  <input
                    type="date"
                    value={passportExpiry}
                    onChange={(e) => setPassportExpiry(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md"
                  />
                </div>
              </div>

              {showPakistanPanel ? (
                <div className="mt-lg rounded-r-xl border-l-4 border-primary bg-surface-container-high p-lg">
                  <div className="mb-md flex items-start gap-md">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <div>
                      <p className="font-bold text-on-surface">Qatar Medical Center (QMC) Requirement</p>
                      <p className="text-body-sm text-on-surface-variant">
                        Applicants from this country require pre-entry medical screening at an approved
                        QMC center in their home country.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-on-surface-variant">
                        QMC CENTER
                      </label>
                      <input
                        value={qmcCenter}
                        onChange={(e) => setQmcCenter(e.target.value)}
                        className="w-full rounded-md border border-outline-variant p-sm text-body-sm"
                        placeholder="QMC Islamabad"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-on-surface-variant">CITY</label>
                      <input
                        value={qmcCity}
                        onChange={(e) => setQmcCity(e.target.value)}
                        className="w-full rounded-md border border-outline-variant p-sm text-body-sm"
                        placeholder="Islamabad"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-on-surface-variant">
                        APPOINTMENT DATE
                      </label>
                      <input
                        type="date"
                        value={qmcAppointment}
                        onChange={(e) => setQmcAppointment(e.target.value)}
                        className="w-full rounded-md border border-outline-variant p-sm text-body-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-lg">
              <h3 className="mb-md text-headline-sm text-on-surface">Employment Parameters</h3>
              <div className="space-y-xl">
                <div>
                  <label className="mb-md block text-label-sm text-on-surface-variant">Employee Type</label>
                  <div className="flex flex-wrap gap-md">
                    {(["FREELANCER", "PERMANENT", "CONTRACT"] as VisaEmployeeType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEmployeeType(type)}
                        className={[
                          "rounded-full px-lg py-sm text-body-sm font-medium transition-colors",
                          employeeType === type
                            ? "bg-primary font-bold text-on-primary"
                            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest",
                        ].join(" ")}
                      >
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-surface-container p-lg">
                  <div>
                    <p className="font-bold text-on-surface">Create inactive employee record</p>
                    <p className="text-body-sm text-on-surface-variant">
                      System will hold a shadow profile until the visa is issued.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={createInactiveEmployee}
                      onChange={(e) => setCreateInactiveEmployee(e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-outline-variant after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                  </label>
                </div>
                <div>
                  <label className="mb-xs block text-label-sm text-on-surface-variant">
                    Assigned Department (Optional)
                  </label>
                  <select className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
                    <option>Select Department...</option>
                    <option>Technology</option>
                    <option>Legal</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 5 && isFreelancer && (
            <div className="space-y-lg">
              <h3 className="mb-md text-headline-sm text-on-surface">Payment Schedule (Milestones)</h3>
              <div className="overflow-hidden rounded-xl border border-outline-variant shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-surface-container text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <tr>
                      <th className="px-lg py-md">Milestone</th>
                      <th className="px-lg py-md">Amount (QAR)</th>
                      <th className="px-lg py-md">Due Stage</th>
                      <th className="px-lg py-md">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant bg-white">
                    {DEFAULT_PAYMENT_MILESTONES.map((milestone) => (
                      <tr key={milestone.label}>
                        <td className="px-lg py-md font-medium">{milestone.label}</td>
                        <td className="px-lg py-md">{milestone.amount.toLocaleString()}.00</td>
                        <td className="px-lg py-md text-on-surface-variant">{milestone.dueStage}</td>
                        <td className="px-lg py-md">
                          <span
                            className={[
                              "rounded px-2 py-1 text-[10px] font-bold",
                              milestone.status === "PENDING"
                                ? "bg-secondary-fixed text-on-secondary-fixed"
                                : "bg-surface-container-highest text-on-surface-variant",
                            ].join(" ")}
                          >
                            {milestone.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-md pt-md">
                <p className="text-label-sm text-on-surface-variant">Accepted Payment Modes:</p>
                <div className="flex gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className="material-symbols-outlined">account_balance</span>
                  <span className="material-symbols-outlined">payments</span>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-lg">
              <h3 className="mb-md text-headline-sm text-on-surface">Review &amp; Submission</h3>
              <div className="grid grid-cols-1 gap-lg rounded-xl bg-surface-container p-lg md:grid-cols-2">
                <div>
                  <p className="mb-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Applicant
                  </p>
                  <p className="text-headline-sm">{displayName}</p>
                  <p className="text-body-sm text-on-surface-variant">{displayProfession}</p>
                </div>
                <div className="md:text-right">
                  <p className="mb-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Type
                  </p>
                  <p className="text-headline-sm text-primary">
                    {isFreelancer ? "Freelancer Visa" : "Company Employee"}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">{selectedQuota?.vpNumber ?? "—"}</p>
                </div>
                <div className="col-span-full mt-md border-t border-outline-variant pt-lg">
                  <div className="mb-2 flex items-center justify-between text-body-md">
                    <span>Total Estimated Fees</span>
                    <span className="font-bold">
                      {isFreelancer ? `${totalFees.toLocaleString()}.00 QAR` : "Company paid"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                    <span>Payment Responsibility</span>
                    <span>{isFreelancer ? "Freelancer Paid" : "Company Paid"}</span>
                  </div>
                  {showPakistanPanel ? (
                    <p className="mt-md text-body-sm text-primary">
                      Medical route: Home country (QMC)
                      {qmcCenter ? ` — ${qmcCenter}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-md rounded-lg border border-secondary-container bg-secondary-container/10 p-md">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <p className="text-body-sm text-on-secondary-container">
                  By clicking &apos;Start Application&apos;, you authorize the initiation of government
                  documentation.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2xl flex justify-between border-t border-outline-variant pt-lg">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="rounded-lg border border-outline-variant px-xl py-md font-bold text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={isSubmitting || (step === 2 && quotaOptions.length === 0)}
            className={[
              "rounded-lg px-3xl py-md font-bold text-on-primary shadow-md transition-all disabled:opacity-50",
              step === TOTAL_STEPS ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90",
            ].join(" ")}
          >
            {step === TOTAL_STEPS ? (isSubmitting ? "Starting..." : "Start Application") : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
