interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

const base = 'min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const edge = `${base} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`;

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

    return (
        <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className={edge}>
                Previous
            </button>
            {pages.map((value) => (
                <button
                    key={value}
                    type="button"
                    aria-current={value === page ? 'page' : undefined}
                    onClick={() => onChange(value)}
                    className={`${base} ${value === page ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                    {value}
                </button>
            ))}
            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className={edge}
            >
                Next
            </button>
        </nav>
    );
}