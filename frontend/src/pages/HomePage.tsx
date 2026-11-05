import { Link, useSearchParams } from 'react-router-dom';
import { PostCard } from '../components/posts/PostCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';

const POSTS_PER_PAGE = 9;

export function HomePage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const { data, isPending, isError, isPlaceholderData, refetch } = usePosts({
        page,
        limit: POSTS_PER_PAGE,
    });

    const changePage = (next: number) => {
        setSearchParams({ page: String(next) });
        document.getElementById('latest-posts')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="space-y-12">
            <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-white shadow-xl sm:px-12 sm:py-20">
                <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
                <div className="relative max-w-2xl">
                    <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        Community blog
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                        Stories, ideas and insights worth sharing
                    </h1>
                    <p className="mt-4 text-lg text-indigo-100">
                        Read what others are writing, join the conversation in the comments, or publish your own
                        post in minutes.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to={user ? '/posts/new' : '/register'}
                            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50"
                        >
                            {user ? 'Write a post' : 'Get started free'}
                        </Link>
                        <a
                            href="#latest-posts"
                            className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            Browse posts
                        </a>
                    </div>
                </div>
            </section>

            <section id="latest-posts" className="scroll-mt-24">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Latest posts</h2>
                        {data && <p className="text-sm text-slate-500">{data.meta.total} posts published</p>}
                    </div>
                </div>

                {isPending && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
                        {Array.from({ length: 6 }, (_, index) => (
                            <PostCardSkeleton key={index} />
                        ))}
                    </div>
                )}

                {isError && (
                    <EmptyState icon="⚠️" title="Could not load posts" description="Check your connection and try again.">
                        <Button onClick={() => refetch()}>Retry</Button>
                    </EmptyState>
                )}

                {data && data.items.length === 0 && (
                    <EmptyState
                        icon="📝"
                        title={page > 1 ? 'No posts on this page' : 'No posts yet'}
                        description={page > 1 ? undefined : 'Be the first to publish something.'}
                    >
                        {page > 1 ? (
                            <Button onClick={() => changePage(1)}>Go to first page</Button>
                        ) : (
                            <Link
                                to={user ? '/posts/new' : '/register'}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                {user ? 'Write a post' : 'Sign up to write'}
                            </Link>
                        )}
                    </EmptyState>
                )}

                {data && data.items.length > 0 && (
                    <>
                        <div
                            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isPlaceholderData ? 'opacity-60 transition-opacity' : ''}`}
                        >
                            {data.items.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                        <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={changePage} />
                    </>
                )}
            </section>
        </div>
    );
}