"use client";

import type { DocumentAreaConfig } from "@/lib/documents/documentAreas";

type DocumentAreaCardProps = {
  config: DocumentAreaConfig;
  onSelect: (config: DocumentAreaConfig) => void;
};

export function DocumentAreaCard({ config, onSelect }: DocumentAreaCardProps) {
  if (!config.enabled) {
    return (
      <article className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container p-xl opacity-60 grayscale">
        <div className="flex-1">
          <div
            className={`mb-lg flex h-14 w-14 items-center justify-center rounded-2xl ${config.iconBgClass}`}
          >
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {config.icon}
            </span>
          </div>
          <h3 className="mb-md text-headline-md text-on-surface">{config.title}</h3>
          <p className="mb-xl text-body-md leading-relaxed text-on-surface-variant">
            {config.description}
          </p>
          <span className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-sm text-on-surface-variant">
            Coming Soon
          </span>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(config)}
      className="group relative w-full overflow-hidden rounded-2xl border border-outline-variant bg-white p-xl text-left card-shadow transition-all hover:-translate-y-1 hover:border-primary-fixed-dim hover:shadow-[0_12px_30px_rgba(103,0,36,0.08)] active:scale-[0.99]"
    >
      <div className="relative z-10 flex flex-col md:flex-row">
        <div className="flex-1">
          <div
            className={`mb-lg flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${config.iconBgClass}`}
          >
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {config.icon}
            </span>
          </div>
          <h3 className="mb-md text-headline-md text-on-surface">{config.title}</h3>
          <p className="mb-xl max-w-xl text-body-md leading-relaxed text-on-surface-variant">
            {config.description}
          </p>
          <div className="flex flex-wrap gap-sm">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1 text-label-sm text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`absolute right-6 bottom-6 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 translate-x-4 ${config.accentClass}`}
      >
        <span className="material-symbols-outlined text-[32px]">arrow_circle_right</span>
      </div>
    </button>
  );
}
