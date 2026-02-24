"use client";

interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ label, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-[#84752F]">
          {label}
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-gray-500 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 mt-2">{actions}</div>}
    </div>
  );
}
