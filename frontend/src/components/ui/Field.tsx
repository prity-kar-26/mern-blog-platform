import type { ReactNode } from 'react';

interface FieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: ReactNode;
}

export function Field({ label, htmlFor, error, children }: FieldProps) {
    return (
        <div className="space-y-1">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
            {error && (
                <p role="alert" className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}