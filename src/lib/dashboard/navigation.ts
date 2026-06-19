export type NavItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  mobileTab?: boolean;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard", mobileTab: true },
  { id: "company", label: "Company Profile", icon: "corporate_fare", href: "/dashboard/company" },
  { id: "employees", label: "Employees", icon: "group", href: "/dashboard/employees", mobileTab: true },
  { id: "visas", label: "Visas", icon: "fact_check", href: "/dashboard/visas", mobileTab: true },
  { id: "documents", label: "Documents", icon: "description", href: "/dashboard/documents" },
  { id: "tasks", label: "Tasks", icon: "assignment", href: "/dashboard/tasks", mobileTab: true },
  { id: "accounts", label: "Accounts", icon: "account_balance", href: "/dashboard/accounts" },
  { id: "assets", label: "Assets", icon: "inventory_2", href: "/dashboard/assets" },
  { id: "reports", label: "Reports", icon: "assessment", href: "/dashboard/reports" },
  { id: "notifications", label: "Notifications", icon: "notifications", href: "/dashboard/notifications" },
  { id: "settings", label: "Settings", icon: "settings", href: "/dashboard/settings" },
];

export const MOBILE_TAB_ITEMS = MAIN_NAV_ITEMS.filter((item) => item.mobileTab);

export const MORE_NAV_ITEMS = MAIN_NAV_ITEMS.filter((item) => !item.mobileTab);
