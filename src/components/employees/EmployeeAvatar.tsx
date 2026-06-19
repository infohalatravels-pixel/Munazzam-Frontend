"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/session";
import { getEmployeePhotoUrl } from "@/lib/employees/api";

type EmployeeAvatarProps = {
  employeeId: string;
  name: string;
  hasPhoto?: boolean;
  size?: number;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function EmployeeAvatar({
  employeeId,
  name,
  hasPhoto = false,
  size = 32,
}: EmployeeAvatarProps) {
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

  const className = "rounded-full bg-surface-container object-cover";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary ${className}`}
      style={{ width: size, height: size }}
    >
      {getInitials(name)}
    </div>
  );
}
