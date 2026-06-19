import type { ReactNode } from "react";

type ProfileSectionCardProps = {
  icon: string;
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  className?: string;
};

export function ProfileSectionCard({
  icon,
  title,
  children,
  onEdit,
  className = "",
}: ProfileSectionCardProps) {
  return (
    <section
      className={[
        "group/card relative overflow-hidden rounded-xl border border-outline-variant bg-surface card-shadow transition-all duration-300 hover:scale-[1.005]",
        className,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onEdit}
        disabled={!onEdit}
        className="absolute top-4 right-4 text-on-surface-variant transition-colors hover:text-primary disabled:invisible"
        aria-label={`Edit ${title}`}
      >
        <span className="material-symbols-outlined text-[20px]">edit</span>
      </button>

      <div className="flex items-center gap-3 border-b border-outline-variant bg-surface-bright px-md py-md sm:px-lg sm:py-4">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}
