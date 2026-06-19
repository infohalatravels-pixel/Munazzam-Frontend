import type { ActiveFilter, Employee, EmployeeStat } from "./types";

export const EMPLOYEE_STATS: EmployeeStat[] = [
  {
    label: "Total Staff",
    value: "1,248",
    suffix: "+12%",
    suffixIcon: "trending_up",
    suffixClassName: "text-green-600",
  },
  {
    label: "Active Visas",
    value: "1,192",
    suffix: "95.5%",
    suffixClassName: "text-on-surface-variant",
  },
  {
    label: "Expiring Soon",
    value: "34",
    suffix: "Critical",
    suffixClassName: "text-secondary",
    valueClassName: "text-secondary",
  },
  {
    label: "On Leave",
    value: "42",
    suffix: "Current",
    suffixClassName: "text-on-surface-variant",
  },
];

export const DEMO_ACTIVE_FILTERS: ActiveFilter[] = [
  { id: "dept-ops", label: "Dept: Operations" },
  { id: "visa-active", label: "Visa: Active" },
];

export const DEMO_EMPLOYEES: Employee[] = [
  {
    id: "1",
    employeeId: "#QO-2024-001",
    name: "Ahmad Al-Mansour",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAft2EV6dpOILW9TmSqV8VTLk3bmgI3vfDON-CNhsB9Set6ItXS62JdPRZjaXtIrwUvX1kRMlIrPij1ElhHfJWTP3hurI7S6-qTty9aKhbztBls9EbxODT0-BeUigwW5vh_Kn9a3OeeuWOJqMQ1GW0Vq9UBh1TNzLVuCICy7h_8PlbbdSm4PU3v589KgDLMAFS1oTHPZ5N43D80XiTX0Qmt_eL9y2P6zvz7HTSOgKnysZQyjD9vFNNFMS7uGi95WeRxGo5uI9XMbI",
    nationality: "Qatari",
    department: "Operations",
    position: "Managing Director",
    visaStatus: "verified",
    joinedDate: "Jan 12, 2024",
  },
  {
    id: "2",
    employeeId: "#QO-2024-042",
    name: "Sarah Jenkins",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_smNZkU_e_Kbu8zLNY0JbzSGnb81VH1xtWh5CFd737-7SYKMAImAfHX7Ikj5gJGz_NWBOBvIXnzsZ6GfBYlgbza7s2gHorRMys9yKnG0QLfQuYdacxbUqgvfv0ArQT_r7D9IsWW2lQ8brXn5uO1wj2eXHWJLZkn2xSZZMnISgI4ci8TLJnkFh3RhJrD0XfB6IimTBOTAsZN78Mcy1dViBfrCrls45oyRWwD_ldA9kCCrqzburx9DVRjNQBtEfgo1mkPgfo4pBAuA",
    nationality: "British",
    department: "Logistics",
    position: "Supply Chain Lead",
    visaStatus: "renewing",
    joinedDate: "Mar 05, 2024",
  },
  {
    id: "3",
    employeeId: "#QO-2024-118",
    name: "Rajesh Kumar",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1toCE5BkeRGbyD4YOv0oeYsZlXYX_DztlQdFWiI5KuXXaJKaJ0-n3ZYm7Rzdt0-2M0mcAsO3lW3Dn4vJSAA_VTByscytjZmWJaNLWqhIEx6XxpOCQPMYwgV8Lnz5EnKn5XkpHKYhnTohYYRObMtgmrDeslnOvep3kynVB_HbAK5diqTXueuR24607hy4tuB9w3CNw-tDX8cs_3O0iI1BzUuKrmMcU147oSm-4gUtapwxQAym6WVrnPUB5i3yOiEKSIzpVxQg0Vp0",
    nationality: "Indian",
    department: "Engineering",
    position: "Site Supervisor",
    visaStatus: "expired",
    joinedDate: "Jun 18, 2023",
  },
  {
    id: "4",
    employeeId: "#QO-2024-089",
    name: "Fatima Zahra",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCeg9dXVjomyrnZDH6F0oHijgQbnCEfpJJjT7LIJLUNb61dmdZDBIsuOW9Xb9Jg8B1kEscYae-ICGlK4v2drNlmFJDakzGmK910z8jl8jQ--LMzP1H2TMAIZOIaC5Zs23F47uh1sjzufxQE_Ush2aeueWY7SBl2xT3A1E39YboMOrm_uz53LuGGW8oCPVgxVGJqTgQehJwu6HPdG06WxAFokdsP1LzMJ9l2jh458i-5Do6T6cfeGHdZE5sYLvFKMqKy8X8D5day300",
    nationality: "Moroccan",
    department: "Finance",
    position: "Senior Auditor",
    visaStatus: "verified",
    joinedDate: "Feb 22, 2024",
  },
  {
    id: "5",
    employeeId: "#QO-2024-203",
    name: "Michael Chen",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgtnmyvnALXjdizVSPNmhCzkTj0D4CNScIRtYS_wIRU73zq7_tdsjnL3GAVoHd2I6Ss8c0YcmZ8CGorgHkERb2hD3eFyeQ9WcIMbomVy6Y5RuAZb2EDQJjUv8keVoWq0wsOaxfzyUAcCyFSLeSAyReXRjV8UqyC6MgCQ39Y-hBh68T6bKBt-Qh9LmiKZ2_r-bo721FuofgVY7m4YrDJH3CBMZJTIzJyBvKh8EzDalR5e_KjOcSSjFeUpNwBjZxAMIyEqF8u-GHuDk",
    nationality: "American",
    department: "IT Support",
    position: "DevOps Engineer",
    visaStatus: "pending",
    joinedDate: "Apr 01, 2024",
  },
];

export const TOTAL_EMPLOYEE_COUNT = 1248;
