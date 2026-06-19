"use client";

import Image from "next/image";
import type { SessionUser } from "@/lib/auth/session";

type DashboardHeaderProps = {
  user: SessionUser | null;
  title?: string;
};

function getInitials(name?: string | null) {
  if (!name) return "A";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardHeader({ user, title = "Dashboard" }: DashboardHeaderProps) {
  return (
    <header className="glass-header sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-md px-gutter md:px-xl">
      <div className="flex min-w-0 items-center gap-md">
        <Image
          src="/icons/Munazzam-Logo.jpg"
          alt="Munazzam"
          width={80}
          height={32}
          className="h-8 w-auto object-contain md:hidden"
          style={{ width: "auto", height: "2rem" }}
        />
        <h1 className="truncate text-headline-sm text-on-surface">{title}</h1>
        <div className="hidden items-center gap-xs rounded-full bg-tertiary-fixed px-sm py-1 text-label-sm text-on-tertiary-fixed-variant sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Premium Access
        </div>
      </div>

      <div className="flex items-center gap-md md:gap-lg">
        <div className="relative hidden items-center lg:flex">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search operations..."
            className="w-64 rounded-full border-none bg-surface-container-low py-2 pr-md pl-10 text-body-sm transition-all focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-primary-container text-label-sm font-semibold text-on-primary"
          title={user?.name}
        >
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
}
