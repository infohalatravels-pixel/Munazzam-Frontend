import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { AccountRecord } from "./api";
import {
  formatLedgerAmount,
  formatLedgerDate,
  type AccountLedgerSummary,
  type LedgerEntry,
} from "./ledgerApi";
import { formatDisplayRange } from "./ledgerDates";

type ExportLedgerPdfInput = {
  account: AccountRecord;
  summary: AccountLedgerSummary;
  entries: LedgerEntry[];
  fromDate: string;
  toDate: string;
};

export function exportLedgerPdf({
  account,
  summary,
  entries,
  fromDate,
  toDate,
}: ExportLedgerPdfInput) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.setTextColor(103, 0, 36);
  doc.text("Munazzam — Account Ledger", 40, 40);

  doc.setFontSize(11);
  doc.setTextColor(20, 27, 43);
  doc.text(`Account: ${account.name}`, 40, 62);
  doc.text(
    `Type: ${account.category === "BANK" ? "Bank Account" : "Internal System Account"}`,
    40,
    78
  );
  doc.text(`Period: ${formatDisplayRange(fromDate, toDate)}`, 40, 94);
  doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, 40, 110);

  doc.setFontSize(10);
  doc.text(
    `Opening Balance: ${summary.currency} ${formatLedgerAmount(summary.openingBalance)}`,
    pageWidth - 40,
    62,
    { align: "right" }
  );
  doc.text(
    `Closing Balance: ${summary.currency} ${formatLedgerAmount(summary.closingBalance)}`,
    pageWidth - 40,
    78,
    { align: "right" }
  );
  doc.text(
    `Inflow: ${summary.currency} ${formatLedgerAmount(summary.totalInflow)} | Outflow: ${summary.currency} ${formatLedgerAmount(summary.totalOutflow)}`,
    pageWidth - 40,
    94,
    { align: "right" }
  );

  autoTable(doc, {
    startY: 125,
    head: [
      [
        "Date",
        "Reference",
        "Description",
        "Category",
        "Counterparty",
        "Debit",
        "Credit",
        "Balance",
      ],
    ],
    body: entries.map((entry) => [
      formatLedgerDate(entry.createdAt),
      entry.reference,
      entry.description,
      entry.category,
      entry.counterpartyAccountName,
      entry.debit !== null ? formatLedgerAmount(entry.debit) : "—",
      entry.credit !== null ? formatLedgerAmount(entry.credit) : "—",
      formatLedgerAmount(entry.balance),
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [103, 0, 36],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [249, 249, 255],
    },
    margin: { left: 40, right: 40 },
  });

  const safeName = account.name.replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 40);
  doc.save(`ledger-${safeName}-${fromDate}-to-${toDate}.pdf`);
}
