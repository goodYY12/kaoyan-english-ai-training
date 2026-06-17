export default function SectionCard({
  title,
  description,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm shadow-slate-200/60 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
            )}
            {description && (
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={title || action ? "mt-5" : ""}>{children}</div>
    </section>
  );
}
