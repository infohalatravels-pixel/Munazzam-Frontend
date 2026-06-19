"use client";

import { useCallback, useEffect, useState } from "react";
import type { OnboardingFormData } from "@/lib/company/types";
import {
  DEMO_COMPLIANCE_DOCUMENTS,
  formatDisplayDate,
  getCompanyTypeBadges,
  getCrStatus,
  mapFormDataToProfile,
  type CompanyProfileView,
  type ComplianceDocument,
} from "@/lib/company/profile";
import {
  downloadComplianceDocument,
  fetchCompanyProfile,
  type ProfileSection,
} from "@/lib/company/profileApi";
import { ComplianceDocumentCard } from "./ComplianceDocumentCard";
import { ContactChannel, ProfileField, ProfileRow } from "./ProfileFields";
import { ProfileSectionCard } from "./ProfileSectionCard";
import { EditSectionModal } from "./EditSectionModal";
import { DocumentViewModal } from "./DocumentViewModal";
import { UploadDocumentModal } from "./UploadDocumentModal";

function CompanyTypeBadges({ type }: { type: CompanyProfileView["companyType"] }) {
  const badges = getCompanyTypeBadges(type);

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge}
          className={[
            "rounded-full px-3 py-1 text-[11px] font-bold",
            badge === "SPONSOR"
              ? "bg-primary-container text-on-primary-container"
              : "bg-secondary-container text-on-secondary-container",
          ].join(" ")}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

export function CompanyProfilePage() {
  const [rawProfile, setRawProfile] = useState<OnboardingFormData>({});
  const [profile, setProfile] = useState<CompanyProfileView | null>(null);
  const [documents, setDocuments] =
    useState<ComplianceDocument[]>(DEMO_COMPLIANCE_DOCUMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editSection, setEditSection] = useState<ProfileSection | null>(null);
  const [viewDocument, setViewDocument] = useState<ComplianceDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await fetchCompanyProfile();
      setRawProfile(data.profile);
      setProfile(mapFormDataToProfile(data.profile));
      setDocuments(data.documents);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load company profile."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function handleSectionSaved(updated: OnboardingFormData) {
    setRawProfile(updated);
    setProfile(mapFormDataToProfile(updated));
  }

  function handleDocumentUploaded(document: ComplianceDocument) {
    setDocuments((prev) =>
      prev.map((item) => (item.id === document.id ? document : item))
    );
  }

  async function handleDownload(document: ComplianceDocument) {
    try {
      await downloadComplianceDocument(document);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Download failed.");
    }
  }

  const crStatus = getCrStatus(profile?.crExpiryDate);

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-lg p-gutter md:p-xl">
      {loadError ? (
        <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {loadError}
        </div>
      ) : null}

      {isLoading || !profile ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-body-md text-on-surface-variant">
          Loading company profile...
        </div>
      ) : (
        <>
          <ProfileSectionCard
            icon="domain"
            title="Company Identity"
            onEdit={() => setEditSection("identity")}
          >
            <div className="space-y-6 p-md sm:p-lg">
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
                <ProfileField label="Legal Name (EN)" value={profile.legalNameEn} />
                <ProfileField
                  label="Legal Name (AR)"
                  value={profile.legalNameAr}
                  align="right"
                  dir="rtl"
                />
                <div>
                  <p className="mb-1 text-label-sm text-on-surface-variant">
                    Company Type
                  </p>
                  <CompanyTypeBadges type={profile.companyType} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
                <ProfileField label="Trade Name (EN)" value={profile.tradeNameEn} />
                <ProfileField
                  label="Trade Name (AR)"
                  value={profile.tradeNameAr}
                  align="right"
                  dir="rtl"
                />
                <ProfileField label="Industry" value={profile.industry} />
              </div>
            </div>
          </ProfileSectionCard>

          <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
            <ProfileSectionCard
              icon="app_registration"
              title="Registration Details"
              onEdit={() => setEditSection("registration")}
            >
              <div className="space-y-1 p-md sm:p-lg">
                <ProfileRow label="CR Number" value={profile.crNumber} bold />
                <ProfileRow
                  label="Issue Date"
                  value={formatDisplayDate(profile.crIssueDate)}
                />
                <ProfileRow
                  label="Expiry Date"
                  value={formatDisplayDate(profile.crExpiryDate)}
                  bold
                  bordered={false}
                  trailing={
                    <span
                      className={[
                        "rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tighter uppercase",
                        crStatus.className,
                      ].join(" ")}
                    >
                      {crStatus.label}
                    </span>
                  }
                />
              </div>
            </ProfileSectionCard>

            <ProfileSectionCard
              icon="verified_user"
              title="Signatory & Establishment"
              onEdit={() => setEditSection("signatory")}
            >
              <div className="space-y-1 p-md sm:p-lg">
                <ProfileRow
                  label="Establishment Card No"
                  value={profile.establishmentCardNo}
                  bold
                />
                <ProfileRow label="Signatory Name" value={profile.signatoryName} />
                <ProfileRow
                  label="QID"
                  value={profile.signatoryQid}
                  bordered={false}
                />
              </div>
            </ProfileSectionCard>
          </div>

          <ProfileSectionCard
            icon="location_on"
            title="Contact & Address"
            onEdit={() => setEditSection("contact")}
          >
            <div className="p-md sm:p-lg">
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                <ContactChannel icon="mail" label="Email" value={profile.email} />
                <ContactChannel icon="call" label="Phone" value={profile.phoneNo} />
                <ContactChannel
                  icon="language"
                  label="Website"
                  value={profile.website}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 rounded-lg bg-surface-container-low p-md md:grid-cols-2 md:p-lg">
                <div>
                  <p className="mb-2 text-label-sm text-on-surface-variant">
                    Physical Address
                  </p>
                  <p className="text-body-md leading-relaxed whitespace-pre-line">
                    {profile.physicalAddress}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-label-sm text-on-surface-variant">
                    National Address (العنوان الوطني)
                  </p>
                  <div className="rounded border border-outline-variant bg-surface p-3 font-mono text-sm break-all">
                    {profile.nationalAddressCode}
                  </div>
                </div>
              </div>
            </div>
          </ProfileSectionCard>

          <section>
            <div className="mb-4 flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  folder_open
                </span>
                <h3 className="text-headline-sm text-on-surface">
                  Compliance Documents
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center gap-2 text-label-md font-bold text-primary"
              >
                <span className="material-symbols-outlined text-[20px]">upload</span>
                Upload New
              </button>
            </div>

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
          </section>

          <footer className="pt-2xl pb-xl text-center text-label-sm text-on-surface-variant">
            © {new Date().getFullYear()} Munazzam Operations Management. All rights
            reserved. Doha, State of Qatar.
          </footer>
        </>
      )}

      <EditSectionModal
        open={Boolean(editSection)}
        section={editSection}
        formData={rawProfile}
        onClose={() => setEditSection(null)}
        onSaved={handleSectionSaved}
      />

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
    </div>
  );
}
