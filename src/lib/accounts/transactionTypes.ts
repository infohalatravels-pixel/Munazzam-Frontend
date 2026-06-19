export type TransactionTypeId =
  | "deposit"
  | "transfer"
  | "payroll"
  | "payroll-reversal"
  | "expense"
  | "freelancer-payments"
  | "document-renewal"
  | "vat-payment"
  | "petty-cash"
  | "vendor-payment"
  | "loan-repayment";

export type TransactionTypeConfig = {
  id: TransactionTypeId;
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
  enabled: boolean;
  watermarkIcon?: string;
};

export const TRANSACTION_TYPES: TransactionTypeConfig[] = [
  {
    id: "deposit",
    title: "Deposit",
    description: "Add funds to your corporate accounts via bank transfer or check.",
    icon: "add_circle",
    actionLabel: "Start Deposit",
    enabled: true,
    watermarkIcon: "account_balance_wallet",
  },
  {
    id: "transfer",
    title: "Transfer",
    description: "Move funds between bank and internal system accounts.",
    icon: "sync_alt",
    actionLabel: "Start Transfer",
    enabled: true,
    watermarkIcon: "swap_horiz",
  },
  {
    id: "payroll",
    title: "Payroll",
    description: "Process monthly salaries and benefits for your workforce.",
    icon: "payments",
    actionLabel: "Manage Salaries",
    enabled: true,
  },
  {
    id: "payroll-reversal",
    title: "Payroll Reversal",
    description: "Correct errors or reverse pending salary distributions.",
    icon: "history",
    actionLabel: "Review History",
    enabled: true,
  },
  {
    id: "expense",
    title: "Expense",
    description: "Manage operational costs, office rent, and utility payments.",
    icon: "receipt_long",
    actionLabel: "File Expense",
    enabled: true,
  },
  {
    id: "freelancer-payments",
    title: "Freelancer Payments",
    description: "Record payments received from freelancer employees for visa and permit services.",
    icon: "person_apron",
    actionLabel: "Record Payment",
    enabled: true,
  },
  {
    id: "document-renewal",
    title: "Document Renewal",
    description: "Record employee document renewal expenses such as visa, QID, and permit fees.",
    icon: "badge",
    actionLabel: "Record Renewal",
    enabled: true,
  },
  {
    id: "vat-payment",
    title: "VAT Payment",
    description: "Direct settlement of quarterly tax liabilities to GTA.",
    icon: "description",
    actionLabel: "Pay VAT",
    enabled: false,
  },
  {
    id: "petty-cash",
    title: "Petty Cash",
    description: "Manage small-scale operational cash flow for branch ops.",
    icon: "savings",
    actionLabel: "Replenish",
    enabled: false,
  },
  {
    id: "vendor-payment",
    title: "Vendor Payment",
    description: "Settle invoices and supplier obligations on schedule.",
    icon: "storefront",
    actionLabel: "Pay Vendor",
    enabled: false,
  },
  {
    id: "loan-repayment",
    title: "Loan Repayment",
    description: "Record and track corporate loan installments.",
    icon: "account_balance",
    actionLabel: "Record Payment",
    enabled: false,
  },
];

export type PendingTransaction = {
  id: string;
  recipient: string;
  subtitle: string;
  initials: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  statusClassName: string;
  date: string;
};

export const PENDING_TRANSACTIONS_DEMO: PendingTransaction[] = [
  {
    id: "pt-1",
    recipient: "Barwa Tower Office Rent",
    subtitle: "Inv #88219",
    initials: "BT",
    type: "Expense",
    amount: 45000,
    currency: "QAR",
    status: "Pending Review",
    statusClassName: "bg-orange-100 text-orange-800",
    date: "Oct 24, 2023",
  },
  {
    id: "pt-2",
    recipient: "Software Patch (Dev)",
    subtitle: "Freelance Contract",
    initials: "SP",
    type: "Freelancer",
    amount: 12500,
    currency: "QAR",
    status: "Processing",
    statusClassName: "bg-blue-100 text-blue-800",
    date: "Oct 23, 2023",
  },
];
