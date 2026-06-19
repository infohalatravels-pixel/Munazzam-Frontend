export type DocumentAreaId = "company" | "employees" | "visas" | "assets";

export type DocumentAreaConfig = {
  id: DocumentAreaId;
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
  enabled: boolean;
  tags: string[];
  accentClass: string;
  iconBgClass: string;
};

export const DOCUMENT_AREAS: DocumentAreaConfig[] = [
  {
    id: "company",
    title: "Company Documents",
    description:
      "Manage official registrations, licenses, and corporate records. Maintain commercial compliance across all entities.",
    icon: "corporate_fare",
    actionLabel: "Open Company Docs",
    enabled: true,
    tags: ["Licenses", "Tax Cards", "Lease Deeds"],
    accentClass: "text-primary",
    iconBgClass: "bg-primary text-on-primary",
  },
  {
    id: "employees",
    title: "Employee Documents",
    description:
      "Access personal IDs, passports, and contracts for all staff. Securely manage digital folders for your workforce.",
    icon: "person_search",
    actionLabel: "Browse Employees",
    enabled: true,
    tags: ["QID & Passports", "Contracts", "Medical"],
    accentClass: "text-secondary",
    iconBgClass: "bg-secondary text-on-secondary",
  },
  {
    id: "visas",
    title: "Visa Documents",
    description: "Track visa applications, permits, and immigration compliance records.",
    icon: "badge",
    actionLabel: "Coming Soon",
    enabled: false,
    tags: ["Work Permits", "Entry Visas"],
    accentClass: "text-tertiary",
    iconBgClass: "bg-tertiary text-on-tertiary",
  },
  {
    id: "assets",
    title: "Asset Documents",
    description: "Store warranties, registrations, and ownership records for company assets.",
    icon: "inventory_2",
    actionLabel: "Coming Soon",
    enabled: false,
    tags: ["Vehicles", "Equipment"],
    accentClass: "text-on-surface-variant",
    iconBgClass: "bg-surface-container-high text-on-surface",
  },
];

export const DOCUMENT_AREA_ROUTES: Partial<Record<DocumentAreaId, string>> = {
  company: "/dashboard/documents/company",
  employees: "/dashboard/documents/employees",
};
