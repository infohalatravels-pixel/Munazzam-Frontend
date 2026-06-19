"use client";

import { useState } from "react";
import type { VisaDetail, VisaDocumentItem, VisaPaymentMilestone } from "@/lib/visas/types";

const TABS = [
  { id: "overview", label: "Overview", icon: "info" },
  { id: "payments", label: "Payments", icon: "account_balance_wallet" },
  { id: "costs", label: "Company Costs", icon: "analytics" },
  { id: "documents", label: "Documents", icon: "description" },
  { id: "activity", label: "Activity", icon: "history" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type VisaDetailTabsProps = {
  visa: VisaDetail;
};

const MILESTONE_STATUS_CLASS: Record<VisaPaymentMilestone["status"], string> = {
  PAID: "bg-emerald-100 text-emerald-800",
  DUE: "bg-amber-100 text-amber-800",
  SCHEDULED: "bg-surface-container text-on-surface-variant",
  PENDING: "bg-surface-container text-on-surface-variant",
};

function DocumentRow({ doc }: { doc: VisaDocumentItem }) {
  return (
    <div className="group flex cursor-pointer items-center gap-md rounded-xl border border-outline-variant p-md transition-all hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
        <span className="material-symbols-outlined">
          {doc.icon === "pdf" ? "picture_as_pdf" : "description"}
        </span>
      </div>
      <div className="min-w-0 flex-grow">
        <p className="truncate text-label-md text-on-surface">{doc.name}</p>
        <span className="text-[10px] text-on-surface-variant">
          Uploaded {doc.uploadedAt} • {doc.size}
        </span>
      </div>
      <button type="button" className="material-symbols-outlined text-on-surface-variant hover:text-primary">
        download
      </button>
    </div>
  );
}

export function VisaDetailTabs({ visa }: VisaDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="flex min-h-[600px] flex-col rounded-2xl border border-outline-variant bg-surface shadow-sm">
      <div className="flex gap-lg overflow-x-auto border-b border-outline-variant px-lg pt-lg">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex shrink-0 items-center gap-xs pb-md transition-all",
              activeTab === tab.id
                ? "border-b-2 border-primary font-bold text-primary"
                : "text-on-surface-variant hover:text-primary",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-grow p-lg">
        {activeTab === "overview" && (
          <>
            <div className="mb-xl grid grid-cols-1 gap-lg sm:grid-cols-2">
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
                <span className="text-label-sm text-on-surface-variant">MOI Reference Number</span>
                <p className="mt-1 text-label-md text-on-surface">{visa.moiReference}</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
                <span className="text-label-sm text-on-surface-variant">Medical Center</span>
                <p className="mt-1 text-label-md text-on-surface">{visa.medicalCenter}</p>
              </div>
            </div>
            {visa.financialModel === "CLIENT_PAYS" ? (
              <>
                <h5 className="mb-md border-l-4 border-primary pl-md text-label-md uppercase text-primary">
                  Payment Milestones
                </h5>
                <MilestonesTable milestones={visa.milestones} />
              </>
            ) : (
              <p className="text-body-sm text-on-surface-variant">
                Company pays government fees — see Company Costs tab.
              </p>
            )}
            <h5 className="mb-md mt-xl border-l-4 border-primary pl-md text-label-md uppercase text-primary">
              Recent Documents
            </h5>
            <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
              {visa.documents.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </div>
          </>
        )}

        {activeTab === "payments" && (
          <div>
            <h5 className="mb-md text-headline-sm text-on-surface">Client Payment Milestones</h5>
            {visa.financialModel === "CLIENT_PAYS" ? (
              <MilestonesTable milestones={visa.milestones} />
            ) : (
              <p className="text-body-sm text-on-surface-variant">
                No client payments — this is a company-sponsored visa.
              </p>
            )}
          </div>
        )}

        {activeTab === "costs" && (
          <p className="text-body-sm text-on-surface-variant">
            Government fees and company expenses will appear here once recorded from Accounts.
          </p>
        )}

        {activeTab === "documents" && (
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            {visa.documents.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <p className="text-body-sm text-on-surface-variant">
            Last update: {visa.lastUpdatedAt} by {visa.lastUpdatedBy}
          </p>
        )}
      </div>
    </div>
  );
}

function MilestonesTable({ milestones }: { milestones: VisaPaymentMilestone[] }) {
  return (
    <div className="mb-xl overflow-hidden rounded-xl border border-outline-variant">
      <table className="w-full text-left">
        <thead className="bg-surface-container font-label-sm uppercase text-on-surface">
          <tr>
            <th className="px-md py-sm">Milestone</th>
            <th className="px-md py-sm">Amount</th>
            <th className="px-md py-sm">Due Date</th>
            <th className="px-md py-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant text-body-sm text-on-surface">
          {milestones.map((m) => (
            <tr
              key={m.id}
              className={[
                "transition-colors hover:bg-surface-container-lowest",
                m.status === "SCHEDULED" ? "opacity-40" : "",
              ].join(" ")}
            >
              <td className="px-md py-md">{m.label}</td>
              <td className="px-md py-md">QAR {m.amount.toFixed(2)}</td>
              <td className="px-md py-md">{m.dueDate}</td>
              <td className="px-md py-md">
                {m.status !== "SCHEDULED" ? (
                  <span
                    className={[
                      "rounded-full px-sm py-1 text-[10px] font-bold",
                      MILESTONE_STATUS_CLASS[m.status],
                    ].join(" ")}
                  >
                    {m.status}
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
