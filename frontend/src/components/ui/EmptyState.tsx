import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    children?: ReactNode;
}

export function EmptyState({ icon = '📭', title, description, children }: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-4xl" aria-hidden="true">
                {icon}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
            {children && <div className="mt-6 flex justify-center gap-3">{children}</div>}
        </div>
    );
}