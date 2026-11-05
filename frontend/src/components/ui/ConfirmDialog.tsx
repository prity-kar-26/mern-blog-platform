import { useEffect } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Delete',
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !loading) onCancel();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={() => !loading && onCancel()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="confirm-title" className="text-lg font-semibold">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}