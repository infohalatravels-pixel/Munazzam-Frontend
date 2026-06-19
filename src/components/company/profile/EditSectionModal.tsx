"use client";

import { useEffect, useState } from "react";
import {
  AppModal,
  ModalFooterActions,
  modalInputClassName,
  modalSelectClassName,
  ModalFieldLabel,
} from "@/components/ui/AppModal";
import {
  COMPANY_TYPE_OPTIONS,
  type OnboardingFormData,
} from "@/lib/company/types";
import {
  updateCompanyProfileSection,
  type ProfileSection,
} from "@/lib/company/profileApi";

type EditSectionModalProps = {
  open: boolean;
  section: ProfileSection | null;
  formData: OnboardingFormData;
  onClose: () => void;
  onSaved: (profile: OnboardingFormData) => void;
};

function updateField<K extends keyof OnboardingFormData>(
  form: OnboardingFormData,
  key: K,
  value: OnboardingFormData[K]
): OnboardingFormData {
  return { ...form, [key]: value };
}

export function EditSectionModal({
  open,
  section,
  formData,
  onClose,
  onSaved,
}: EditSectionModalProps) {
  const [form, setForm] = useState<OnboardingFormData>(formData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(formData);
      setError(null);
    }
  }, [open, formData]);

  const titles: Record<ProfileSection, string> = {
    identity: "Edit Company Identity",
    registration: "Edit Registration Details",
    signatory: "Edit Signatory & Establishment",
    contact: "Edit Contact & Address",
  };

  async function handleSave() {
    if (!section) return;

    setIsSaving(true);
    setError(null);

    try {
      const profile = await updateCompanyProfileSection(section, form);
      onSaved(profile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppModal
      open={open && Boolean(section)}
      title={section ? titles[section] : ""}
      subtitle="Update this section of your company profile."
      badge="Company Profile"
      onClose={onClose}
      maxWidthClassName="max-w-4xl"
      footer={
        <ModalFooterActions
          onCancel={onClose}
          onSave={handleSave}
          isSaving={isSaving}
          error={error}
        />
      }
    >
      {section === "identity" && (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
          <div>
            <ModalFieldLabel>Legal Name (EN)</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.legalNameEn || ""}
              onChange={(e) => setForm(updateField(form, "legalNameEn", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel align="right">Legal Name (AR)</ModalFieldLabel>
            <input
              className={`${modalInputClassName} rtl`}
              dir="rtl"
              value={form.legalNameAr || ""}
              onChange={(e) => setForm(updateField(form, "legalNameAr", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel>Company Type</ModalFieldLabel>
            <select
              className={modalSelectClassName}
              value={form.companyType || "PRO_AGENCY"}
              onChange={(e) =>
                setForm(
                  updateField(form, "companyType", e.target.value as OnboardingFormData["companyType"])
                )
              }
            >
              {COMPANY_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <ModalFieldLabel>Trade Name (EN)</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.tradeNameEn || ""}
              onChange={(e) => setForm(updateField(form, "tradeNameEn", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel align="right">Trade Name (AR)</ModalFieldLabel>
            <input
              className={`${modalInputClassName} rtl`}
              dir="rtl"
              value={form.tradeNameAr || ""}
              onChange={(e) => setForm(updateField(form, "tradeNameAr", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel>Industry</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.industry || ""}
              onChange={(e) => setForm(updateField(form, "industry", e.target.value))}
            />
          </div>
        </div>
      )}

      {section === "registration" && (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
          <div>
            <ModalFieldLabel>CR Number</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.crNumber || ""}
              onChange={(e) => setForm(updateField(form, "crNumber", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel>Issue Date</ModalFieldLabel>
            <input
              type="date"
              className={modalInputClassName}
              value={form.crIssueDate || ""}
              onChange={(e) => setForm(updateField(form, "crIssueDate", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel>Expiry Date</ModalFieldLabel>
            <input
              type="date"
              className={modalInputClassName}
              value={form.crExpiryDate || ""}
              onChange={(e) => setForm(updateField(form, "crExpiryDate", e.target.value))}
            />
          </div>
        </div>
      )}

      {section === "signatory" && (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <div>
            <ModalFieldLabel>Establishment Card No</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.establishmentCardNo || ""}
              onChange={(e) =>
                setForm(updateField(form, "establishmentCardNo", e.target.value))
              }
            />
          </div>
          <div>
            <ModalFieldLabel>Establishment Expiry</ModalFieldLabel>
            <input
              type="date"
              className={modalInputClassName}
              value={form.establishmentCardExpiry || ""}
              onChange={(e) =>
                setForm(updateField(form, "establishmentCardExpiry", e.target.value))
              }
            />
          </div>
          <div>
            <ModalFieldLabel>Sponsor File No</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.sponsorFileNo || ""}
              onChange={(e) => setForm(updateField(form, "sponsorFileNo", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel>Signatory Name</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.signatoryName || ""}
              onChange={(e) => setForm(updateField(form, "signatoryName", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel>QID (11 digits)</ModalFieldLabel>
            <input
              className={modalInputClassName}
              maxLength={11}
              value={form.signatoryQid || ""}
              onChange={(e) => setForm(updateField(form, "signatoryQid", e.target.value))}
            />
          </div>
          <div>
            <ModalFieldLabel>QID Expiry</ModalFieldLabel>
            <input
              type="date"
              className={modalInputClassName}
              value={form.signatoryQidExpiry || ""}
              onChange={(e) =>
                setForm(updateField(form, "signatoryQidExpiry", e.target.value))
              }
            />
          </div>
          <div className="md:col-span-2">
            <ModalFieldLabel>Signatory Phone</ModalFieldLabel>
            <input
              className={modalInputClassName}
              value={form.signatoryPhone || ""}
              onChange={(e) => setForm(updateField(form, "signatoryPhone", e.target.value))}
            />
          </div>
        </div>
      )}

      {section === "contact" && (
        <div className="space-y-lg">
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            <div>
              <ModalFieldLabel>Email</ModalFieldLabel>
              <input
                type="email"
                className={modalInputClassName}
                value={form.email || ""}
                onChange={(e) => setForm(updateField(form, "email", e.target.value))}
              />
            </div>
            <div>
              <ModalFieldLabel>Phone</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.phoneNo || ""}
                onChange={(e) => setForm(updateField(form, "phoneNo", e.target.value))}
              />
            </div>
            <div>
              <ModalFieldLabel>Website</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.website || ""}
                onChange={(e) => setForm(updateField(form, "website", e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-4">
            <div>
              <ModalFieldLabel>Building No</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.buildingNo || ""}
                onChange={(e) => setForm(updateField(form, "buildingNo", e.target.value))}
              />
            </div>
            <div>
              <ModalFieldLabel>Street No</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.streetNo || ""}
                onChange={(e) => setForm(updateField(form, "streetNo", e.target.value))}
              />
            </div>
            <div>
              <ModalFieldLabel>Zone No</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.zoneNo || ""}
                onChange={(e) => setForm(updateField(form, "zoneNo", e.target.value))}
              />
            </div>
            <div>
              <ModalFieldLabel>City</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.city || ""}
                onChange={(e) => setForm(updateField(form, "city", e.target.value))}
              />
            </div>
            <div>
              <ModalFieldLabel>Country</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.country || "Qatar"}
                onChange={(e) => setForm(updateField(form, "country", e.target.value))}
              />
            </div>
            <div className="md:col-span-2">
              <ModalFieldLabel>Area</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.area || ""}
                onChange={(e) => setForm(updateField(form, "area", e.target.value))}
              />
            </div>
            <div className="md:col-span-2">
              <ModalFieldLabel>P.O. Box</ModalFieldLabel>
              <input
                className={modalInputClassName}
                value={form.poBox || ""}
                onChange={(e) => setForm(updateField(form, "poBox", e.target.value))}
              />
            </div>
          </div>
          <div>
            <ModalFieldLabel>Full National Address</ModalFieldLabel>
            <textarea
              className={`${modalInputClassName} min-h-[100px] resize-y`}
              rows={3}
              value={form.nationalAddress || ""}
              onChange={(e) => setForm(updateField(form, "nationalAddress", e.target.value))}
            />
          </div>
        </div>
      )}
    </AppModal>
  );
}
