"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PriorityFeedItem } from "@/lib/dashboard/overviewHelpers";

type DashboardPriorityFeedProps = {
  items: PriorityFeedItem[];
  isLoading?: boolean;
};

export function DashboardPriorityFeed({
  items,
  isLoading = false,
}: DashboardPriorityFeedProps) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-xl">
      <div className="mb-xl flex items-center justify-between">
        <h4 className="text-headline-sm text-on-surface">Priority Actions</h4>
        <Link href="/dashboard/documents" className="text-label-sm text-primary hover:underline">
          Documents
        </Link>
      </div>

      {isLoading ? (
        <p className="text-body-sm text-on-surface-variant">Loading priorities...</p>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center rounded-lg border border-outline-variant/60 bg-surface-container-low p-lg text-center">
          <span className="material-symbols-outlined mb-sm text-[32px] text-emerald-600">
            verified
          </span>
          <p className="text-label-md text-on-surface">All clear for now</p>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            No urgent document or visa actions are waiting on you.
          </p>
        </div>
      ) : (
        <div className="custom-scrollbar flex-1 space-y-lg overflow-y-auto pr-sm">
          {items.map((activity, index) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => activity.href && router.push(activity.href)}
              disabled={!activity.href}
              className="flex w-full gap-md text-left transition-opacity hover:opacity-90 disabled:cursor-default"
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${activity.iconBg}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{activity.icon}</span>
                </div>
                {index < items.length - 1 ? (
                  <div className="mt-2 h-full w-px bg-outline-variant" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pb-md">
                <p className="text-label-md text-on-surface">{activity.title}</p>
                <p className="text-body-sm text-on-surface-variant">{activity.description}</p>
                <span className="mt-xs block text-[10px] font-semibold text-outline">
                  {activity.timeLabel}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-lg grid grid-cols-2 gap-sm border-t border-outline-variant pt-lg">
        <Link
          href="/dashboard/accounts"
          className="rounded-lg border border-outline-variant px-sm py-2 text-center text-label-sm text-on-surface transition-colors hover:bg-surface-container-low"
        >
          Accounts
        </Link>
        <Link
          href="/dashboard/company"
          className="rounded-lg border border-outline-variant px-sm py-2 text-center text-label-sm text-on-surface transition-colors hover:bg-surface-container-low"
        >
          Company
        </Link>
      </div>
    </div>
  );
}
