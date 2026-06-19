import { apiClient } from "@/lib/auth/apiClient";
import type {
  OnboardingFormData,
  OnboardingState,
  SaveOnboardingResult,
} from "./types";

export async function fetchOnboardingState(): Promise<OnboardingState> {
  return apiClient<OnboardingState>("/api/companies/onboarding", {
    method: "GET",
  });
}

export async function saveOnboardingStep(
  step: number,
  payload: OnboardingFormData
): Promise<SaveOnboardingResult> {
  return apiClient<SaveOnboardingResult>(
    `/api/companies/onboarding/step/${step}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export function getStepPayload(
  step: number,
  form: OnboardingFormData
): OnboardingFormData {
  switch (step) {
    case 1:
      return {
        legalNameEn: form.legalNameEn,
        legalNameAr: form.legalNameAr,
        tradeNameEn: form.tradeNameEn,
        tradeNameAr: form.tradeNameAr,
        companyType: form.companyType,
        legalForm: form.legalForm || undefined,
        industry: form.industry,
      };
    case 2:
      return {
        crNumber: form.crNumber,
        crIssueDate: form.crIssueDate,
        crExpiryDate: form.crExpiryDate,
      };
    case 3:
      return {
        email: form.email,
        phoneNo: form.phoneNo,
        mobileNo: form.mobileNo,
        website: form.website,
        poBox: form.poBox,
        buildingNo: form.buildingNo,
        streetNo: form.streetNo,
        zoneNo: form.zoneNo,
        area: form.area,
        city: form.city,
        country: form.country,
        nationalAddress: form.nationalAddress,
      };
    case 4:
      return {
        establishmentCardNo: form.establishmentCardNo,
        establishmentCardExpiry: form.establishmentCardExpiry,
        sponsorFileNo: form.sponsorFileNo,
        signatoryName: form.signatoryName,
        signatoryQid: form.signatoryQid,
        signatoryQidExpiry: form.signatoryQidExpiry,
        signatoryPhone: form.signatoryPhone,
      };
    case 5:
      return {
        visaAllocated: form.visaAllocated,
        maxEmployees: form.maxEmployees,
        maxStorageGb: form.maxStorageGb,
      };
    default:
      return form;
  }
}

export function validateStepClient(
  step: number,
  form: OnboardingFormData
): string | null {
  const required = (value: string | number | undefined | null) =>
    value === undefined || value === null || String(value).trim() === "";

  switch (step) {
    case 1:
      if (required(form.legalNameEn)) return "Legal name (English) is required.";
      if (required(form.legalNameAr)) return "Legal name (Arabic) is required.";
      if (required(form.companyType)) return "Company type is required.";
      return null;
    case 2:
      if (required(form.crNumber)) return "CR number is required.";
      if (required(form.crExpiryDate)) return "CR expiry date is required.";
      return null;
    case 3:
      if (required(form.email)) return "Email is required.";
      if (required(form.phoneNo)) return "Phone number is required.";
      if (required(form.city)) return "City is required.";
      if (required(form.country)) return "Country is required.";
      return null;
    case 4:
      return null;
    case 5:
      if (form.visaAllocated === undefined || form.visaAllocated < 0) {
        return "Visa allocation is required.";
      }
      return null;
    default:
      return null;
  }
}
