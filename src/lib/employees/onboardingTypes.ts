export type EmployeeType = "FREELANCER" | "PERMANENT" | "CONTRACT";

export type VisaType =
  | "WORK"
  | "BUSINESS"
  | "FAMILY"
  | "VISIT"
  | "TRANSIT";

export type AddEmployeeFormData = {
  departmentId: string;
  nameAsPassport: string;
  phoneNo: string;
  nationality: string;
  employeeType: EmployeeType;
  passportNo: string;
  passportExpiry: string;
  qidNo: string;
  qidExpiry: string;
  salary: string;
  joinDate: string;
  designation: string;
  visaType: VisaType;
  visaNumber: string;
  visaIssueDate: string;
  visaExpiryDate: string;
  sponsorFileNo: string;
  professionOnVisa: string;
  workPermitNo: string;
};

export const EMPLOYEE_WIZARD_STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Visa Details" },
  { id: 3, label: "Documents" },
] as const;

export const EMPLOYEE_TYPE_OPTIONS: { value: EmployeeType; label: string }[] = [
  { value: "FREELANCER", label: "Freelancer" },
  { value: "PERMANENT", label: "Permanent" },
  { value: "CONTRACT", label: "Contract" },
];

export const VISA_TYPE_OPTIONS: { value: VisaType; label: string }[] = [
  { value: "WORK", label: "Work Visa" },
  { value: "BUSINESS", label: "Business Visa" },
  { value: "FAMILY", label: "Family / Residence" },
  { value: "VISIT", label: "Visit Visa" },
  { value: "TRANSIT", label: "Transit Visa" },
];

export const EMPTY_ADD_EMPLOYEE_FORM: AddEmployeeFormData = {
  departmentId: "",
  nameAsPassport: "",
  phoneNo: "",
  nationality: "",
  employeeType: "PERMANENT",
  passportNo: "",
  passportExpiry: "",
  qidNo: "",
  qidExpiry: "",
  salary: "",
  joinDate: "",
  designation: "",
  visaType: "WORK",
  visaNumber: "",
  visaIssueDate: "",
  visaExpiryDate: "",
  sponsorFileNo: "",
  professionOnVisa: "",
  workPermitNo: "",
};
