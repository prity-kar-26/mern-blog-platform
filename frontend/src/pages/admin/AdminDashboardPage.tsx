import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdminStats } from '../../hooks/useAdmin';

const CARDS = [
    { key: 'totalUsers', label: 'Total users', icon: '👥', gradient: 'from-indigo-500 to-violet-500', to: '/admin/users' },
    { key: 'totalPosts', label: 'Total posts', icon: '📝', gradient: 'from-fuchsia-500 to-rose-500', to: '/admin/posts' },
    { key: 'totalComments', label: 'Total comments', icon: '💬', gradient: 'from-sky-500 to-teal-500', to: '/admin/comments' },
] as const;

export function AdminDashboardPage() {
    const { data, isPending, isError, refetch } = useAdminStats();

    return (
        <>
            <AdminPageHeader title="Dashboard" description="A quick overview of your blog." />

            {isError ? (
                <EmptyState icon="⚠️" title="Could not load statistics">
                    <Button onClick={() => refetch()}>Retry</Button>
                </EmptyState>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {CARDS.map((card) => (
                            <Link
                                key={card.key}
                                to={card.to}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${card.gradient}`} />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                        <p className="mt-2 text-4xl font-extrabold tracking-tight">
                                            {isPending ? (
                                                <span className="inline-block h-9 w-16 animate-pulse rounded bg-slate-200" />
                                            ) : (
                                                data?.[card.key].toLocaleString()
                                            )}
                                        </p>
                                    </div>
                                    <span
                                        aria-hidden="true"
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br text-2xl shadow ${card.gradient}`}
                                    >
                                        {card.icon}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm font-medium text-indigo-600 group-hover:underline">Manage →</p>
                            </Link>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-slate-500">Post totals do not include deleted posts.</p>
                </>
            )}
        </>
    );
}