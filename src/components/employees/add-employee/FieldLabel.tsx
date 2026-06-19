import type { ReactNode } from "react";

export function FieldLabel({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <label
      className={[
        "block text-label-sm text-on-surface-variant",
        align === "right" ? "text-right" : "",
      ].join(" ")}
    >
      {children}
    </label>
  );
}
