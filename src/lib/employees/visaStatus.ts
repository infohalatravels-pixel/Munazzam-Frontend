import type { VisaStatus } from "./types";

export const VISA_STATUS_LABEL: Record<VisaStatus, string> = {
  verified: "Verified",
  renewing: "Renewing",
  expired: "Expired",
  pending: "Pending",
};

export const VISA_STATUS_CLASS: Record<VisaStatus, string> = {
  verified: "bg-green-100 text-green-700",
  renewing: "bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-700",
  pending: "bg-blue-100 text-blue-700",
};
