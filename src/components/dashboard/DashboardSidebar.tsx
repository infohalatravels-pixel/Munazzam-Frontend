"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS } from "@/lib/dashboard/navigation";

type DashboardSidebarProps = {
  onSignOut: () => void;
};

export function DashboardSidebar({ onSignOut }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col overflow-y-auto custom-scrollbar border-r border-outline-variant bg-surface py-md px-sm md:flex">
      <div className="mb-xl flex flex-col gap-xs px-md">
        <Image
          src="/icons/Munazzam-Logo.jpg"
          alt="Munazzam"
          width={120}
          height={40}
          className="h-10 w-auto object-contain"
          style={{ width: "auto", height: "2.5rem" }}
        />
        <span className="text-headline-sm font-bold text-primary">Munazzam</span>
        <span className="text-label-sm text-on-surface-variant">Enterprise Suite</span>
      </div>

      <nav className="flex-1 space-y-1">
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "flex items-center gap-md rounded-lg px-md py-sm transition-colors",
                isActive
                  ? "border-r-4 border-primary bg-surface-container-high font-bold text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high",
              ].join(" ")}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-outline-variant pt-md">
        <button
          type="button"
          className="flex w-full items-center gap-md rounded-lg px-md py-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-label-md">Support</span>
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-md rounded-lg px-md py-sm text-error transition-colors hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-md">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
