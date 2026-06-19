"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type AppModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  maxWidthClassName?: string;
};

const PANEL_SIZE_CLASS: Record<string, string> = {
  "max-w-3xl": "app-modal-panel--md",
  "max-w-4xl": "app-modal-panel--lg",
  "max-w-5xl": "app-modal-panel--xl",
};

export function AppModal({
  open,
  title,
  subtitle,
  badge,
  children,
  footer,
  onClose,
  maxWidthClassName = "max-w-3xl",
}: AppModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const panelSizeClass = PANEL_SIZE_CLASS[maxWidthClassName] ?? "app-modal-panel--md";

  return createPortal(
    <div className="app-modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        className={["app-modal-panel", panelSizeClass].join(" ")}
      >
        <div className="shrink-0 border-b border-outline-variant px-xl py-lg">
          <div className="flex items-start justify-between gap-md">
            <div className="min-w-0 flex-1">
              {badge ? (
                <p className="text-label-sm text-primary">{badge}</p>
              ) : null}
              <h2 id="app-modal-title" className="text-headline-sm text-on-surface">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-xs text-body-sm text-on-surface-variant">{subtitle}</p>
              ) : null}
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 w-full flex-1 overflow-y-auto px-xl py-xl">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-outline-variant bg-surface-container-low/50 px-xl py-lg">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

export const modalInputClassName =
  "w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-body-md text-on-surface transition-colors focus:border-primary focus:ring-3 focus:ring-primary/10";

export const modalSelectClassName = `${modalInputClassName} cursor-pointer`;

export function ModalFieldLabel({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <label
      className={[
        "mb-xs block text-label-sm text-on-surface-variant",
        align === "right" ? "text-right" : "",
      ].join(" ")}
    >
      {children}
    </label>
  );
}

export function ModalFooterActions({
  onCancel,
  onSave,
  cancelLabel = "Cancel",
  saveLabel = "Save Changes",
  savingLabel = "Saving...",
  isSaving = false,
  disabled = false,
  error,
}: {
  onCancel: () => void;
  onSave: () => void | Promise<void>;
  cancelLabel?: string;
  saveLabel?: string;
  savingLabel?: string;
  isSaving?: boolean;
  disabled?: boolean;
  error?: string | null;
}) {
  return (
    <div className="space-y-md">
      {error ? (
        <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}
      <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-lg px-lg py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || disabled}
          className="flex items-center justify-center gap-sm rounded-lg bg-primary px-xl py-sm text-label-md text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
        >
          {isSaving ? savingLabel : saveLabel}
          <span className="material-symbols-outlined text-[20px]">save</span>
        </button>
      </div>
    </div>
  );
}
