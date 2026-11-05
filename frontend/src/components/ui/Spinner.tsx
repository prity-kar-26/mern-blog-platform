export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
        />
    );
}

export function FullPageSpinner() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center text-indigo-600">
            <Spinner className="h-8 w-8" />
        </div>
    );
}