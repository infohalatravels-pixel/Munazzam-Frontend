import {
  VISA_TYPE_OPTIONS,
  type AddEmployeeFormData,
} from "@/lib/employees/onboardingTypes";
import { FieldLabel } from "./FieldLabel";
import { inputClassName, selectClassName } from "./formStyles";

type EmployeeVisaStepProps = {
  form: AddEmployeeFormData;
  onFieldChange: <K extends keyof AddEmployeeFormData>(
    key: K,
    value: AddEmployeeFormData[K]
  ) => void;
};

export function EmployeeVisaStep({ form, onFieldChange }: EmployeeVisaStepProps) {
  return (
    <div className="space-y-lg p-xl">
      <div className="border-b border-outline-variant pb-md">
        <h3 className="text-headline-sm text-on-surface">Step 2: Qatar Visa Details</h3>
        <p className="text-body-sm text-on-surface-variant">
          Provide visa information as registered with MOI Qatar and your company
          sponsorship records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
        <div className="space-y-xs">
          <FieldLabel>Visa Type</FieldLabel>
          <select
            className={selectClassName}
            value={form.visaType}
            onChange={(event) =>
              onFieldChange(
                "visaType",
                event.target.value as AddEmployeeFormData["visaType"]
              )
            }
          >
            {VISA_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-xs">
          <FieldLabel>Visa Number</FieldLabel>
          <input
            className={inputClassName}
            placeholder="Visa / RP number"
            value={form.visaNumber}
            onChange={(event) => onFieldChange("visaNumber", event.target.value)}
          />
        </div>

        <div className="space-y-xs">
          <FieldLabel>Visa Issue Date</FieldLabel>
          <input
            type="date"
            className={inputClassName}
            value={form.visaIssueDate}
            onChange={(event) => onFieldChange("visaIssueDate", event.target.value)}
          />
        </div>

        <div className="space-y-xs">
          <FieldLabel>Visa Expiry Date</FieldLabel>
          <input
            type="date"
            className={inputClassName}
            value={form.visaExpiryDate}
            onChange={(event) => onFieldChange("visaExpiryDate", event.target.value)}
          />
        </div>

        <div className="space-y-xs">
          <FieldLabel>Sponsor File No (optional)</FieldLabel>
          <input
            className={inputClassName}
            placeholder="Company sponsorship file number"
            value={form.sponsorFileNo}
            onChange={(event) => onFieldChange("sponsorFileNo", event.target.value)}
          />
        </div>

        <div className="space-y-xs">
          <FieldLabel>Profession on Visa</FieldLabel>
          <input
            className={inputClassName}
            placeholder="As listed on visa / work permit"
            value={form.professionOnVisa}
            onChange={(event) => onFieldChange("professionOnVisa", event.target.value)}
          />
        </div>

        <div className="space-y-xs md:col-span-2">
          <FieldLabel>Work Permit No (optional)</FieldLabel>
          <input
            className={inputClassName}
            placeholder="MOI work permit reference"
            value={form.workPermitNo}
            onChange={(event) => onFieldChange("workPermitNo", event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
        <div className="flex gap-md">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="text-body-sm leading-relaxed text-on-surface-variant">
            Ensure visa dates and profession match the official Qatar visa copy. Mismatches
            may delay approvals and compliance checks.
          </p>
        </div>
      </div>
    </div>
  );
}
