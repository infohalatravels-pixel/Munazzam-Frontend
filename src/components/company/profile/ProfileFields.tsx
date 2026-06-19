import type { ReactNode } from "react";

type ProfileFieldProps = {
  label: string;
  value: string;
  align?: "left" | "right";
  dir?: "ltr" | "rtl";
};

export function ProfileField({
  label,
  value,
  align = "left",
  dir = "ltr",
}: ProfileFieldProps) {
  return (
    <div className="min-w-0">
      <p
        className={[
          "mb-1 text-label-sm text-on-surface-variant",
          align === "right" ? "text-right" : "",
        ].join(" ")}
      >
        {label}
      </p>
      <p
        dir={dir}
        className={[
          "text-body-md font-semibold break-words text-on-surface",
          align === "right" ? "text-right" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

type ProfileRowProps = {
  label: string;
  value: string;
  bold?: boolean;
  trailing?: ReactNode;
  bordered?: boolean;
};

export function ProfileRow({
  label,
  value,
  bold = false,
  trailing,
  bordered = true,
}: ProfileRowProps) {
  return (
    <div
      className={[
        "flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        bordered ? "border-b border-surface-container" : "",
      ].join(" ")}
    >
      <span className="text-label-md text-on-surface-variant">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <span className={bold ? "text-body-md font-bold" : "text-body-md"}>
          {value}
        </span>
        {trailing}
      </div>
    </div>
  );
}

type ContactChannelProps = {
  icon: string;
  label: string;
  value: string;
};

export function ContactChannel({ icon, label, value }: ContactChannelProps) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-label-sm text-on-surface-variant">{label}</p>
        <p className="truncate text-body-md font-semibold">{value}</p>
      </div>
    </div>
  );
}
