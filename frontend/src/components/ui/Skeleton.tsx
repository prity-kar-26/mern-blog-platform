export function PostCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-slate-200" />
            <div className="space-y-3 p-6">
                <div className="h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-3 rounded bg-slate-100" />
                <div className="h-3 rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
                <div className="flex items-center gap-3 pt-4">
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                </div>
            </div>
        </div>
    );
}