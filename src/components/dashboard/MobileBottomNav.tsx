"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MOBILE_TAB_ITEMS,
  MORE_NAV_ITEMS,
} from "@/lib/dashboard/navigation";

type MobileBottomNavProps = {
  onSignOut: () => void;
};

export function MobileBottomNav({ onSignOut }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 bg-on-surface/40 md:hidden" onClick={() => setShowMore(false)} />
      )}

      {showMore && (
        <div className="fixed right-gutter bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-gutter z-50 rounded-2xl border border-outline-variant bg-surface-container-lowest p-md shadow-xl md:hidden">
          <p className="mb-sm px-sm text-label-sm text-on-surface-variant">More</p>
          <div className="grid grid-cols-2 gap-xs">
            {MORE_NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setShowMore(false)}
                className="flex items-center gap-sm rounded-xl px-md py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-sm space-y-xs border-t border-outline-variant pt-sm">
            <button
              type="button"
              className="flex w-full items-center gap-sm rounded-xl px-md py-sm text-label-md text-on-surface-variant"
            >
              <span className="material-symbols-outlined">help</span>
              Support
            </button>
            <button
              type="button"
              onClick={() => {
                setShowMore(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-sm rounded-xl px-md py-sm text-label-md text-error"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)] md:hidden">
        {MOBILE_TAB_ITEMS.map((item) => {
          const active = isActive(item.href);
          const icon = item.id === "dashboard" ? "home" : item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "flex flex-col items-center justify-center rounded-2xl px-3 py-1 transition-colors",
                active
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
              <span className="text-[10px] font-semibold">
                {item.id === "dashboard" ? "Home" : item.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMore((open) => !open)}
          className={[
            "flex flex-col items-center justify-center rounded-2xl px-3 py-1 transition-colors",
            showMore || MORE_NAV_ITEMS.some((item) => isActive(item.href))
              ? "bg-primary-container text-on-primary-container"
              : "text-on-surface-variant",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[22px]">more_horiz</span>
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>
    </>
  );
}
