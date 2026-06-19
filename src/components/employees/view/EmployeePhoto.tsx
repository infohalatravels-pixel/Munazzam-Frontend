"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/session";
import { getEmployeePhotoUrl } from "@/lib/employees/api";

type EmployeePhotoProps = {
  employeeId: string;
  name: string;
  hasPhoto?: boolean;
  className?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function EmployeePhoto({
  employeeId,
  name,
  hasPhoto = false,
  className = "h-full w-full object-cover",
}: EmployeePhotoProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadPhoto() {
      if (!hasPhoto) {
        setSrc(null);
        return;
      }

      const token = getAccessToken();
      if (!token) return;

      try {
        const response = await fetch(getEmployeePhotoUrl(employeeId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setSrc(objectUrl);
      } catch {
        if (!cancelled) setSrc(null);
      }
    }

    loadPhoto();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [employeeId, hasPhoto]);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={className} />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-headline-md font-bold text-primary">
      {getInitials(name)}
    </div>
  );
}
