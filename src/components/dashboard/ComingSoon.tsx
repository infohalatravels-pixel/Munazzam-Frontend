type ComingSoonProps = {
  title: string;
  icon: string;
};

export function ComingSoon({ title, icon }: ComingSoonProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-gutter text-center md:p-xl">
      <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <h2 className="text-headline-sm text-on-surface">{title}</h2>
      <p className="mt-sm max-w-md text-body-md text-on-surface-variant">
        This module is coming soon. The overview dashboard is ready while we build
        out {title.toLowerCase()}.
      </p>
    </div>
  );
}
