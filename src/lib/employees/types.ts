export type VisaStatus = "verified" | "renewing" | "expired" | "pending";

export type Employee = {
  id: string;
  employeeId: string;
  name: string;
  avatarUrl: string;
  nationality: string;
  department: string;
  position: string;
  visaStatus: VisaStatus;
  joinedDate: string;
};

export type EmployeeStat = {
  label: string;
  value: string;
  suffix?: string;
  suffixIcon?: string;
  suffixClassName?: string;
  valueClassName?: string;
};

export type ActiveFilter = {
  id: string;
  label: string;
};
