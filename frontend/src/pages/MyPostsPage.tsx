import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { FullPageSpinner } from '../components/ui/Spinner';
import { secondaryLinkClass } from '../components/ui/styles';
import { useAuth } from '../hooks/useAuth';
import { useDeletePost, usePosts } from '../hooks/usePosts';
import type { Post } from '../types';
import { getErrorMessage } from '../utils/error';
import { formatDate, readingTime } from '../utils/format';

export function MyPostsPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const deletePost = useDeletePost();

    const { data, isPending, isError, refetch } = usePosts({ page, limit: 8, author: user?.id });

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            await deletePost.mutateAsync(postToDelete.id);
            toast.success('Post deleted');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setPostToDelete(null);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">My posts</h1>
                    <p className="text-slate-600">Manage everything you've published.</p>
                </div>
                <Link to="/posts/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    New post
                </Link>
            </div>

            {isPending && <FullPageSpinner />}

            {isError && (
                <EmptyState icon="⚠️" title="Could not load your posts">
                    <Button onClick={() => refetch()}>Retry</Button>
                </EmptyState>
            )}

            {data && data.items.length === 0 && (
                <EmptyState icon="✍️" title="You haven't written anything yet" description="Your published posts will show up here.">
                    <Link to="/posts/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        Write your first post
                    </Link>
                </EmptyState>
            )}

            {data && data.items.length > 0 && (
                <>
                    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {data.items.map((post) => (
                            <li key={post.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                                <div className="min-w-0">
                                    <Link to={`/posts/${post.slug}`} className="block truncate text-lg font-semibold hover:text-indigo-600">
                                        {post.title}
                                    </Link>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {formatDate(post.createdAt)} · {readingTime(post.content)} min read
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/posts/${post.slug}/edit`} className={secondaryLinkClass}>
                                        Edit
                                    </Link>
                                    <Button variant="danger" onClick={() => setPostToDelete(post)}>
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={data.meta.page}
                        totalPages={data.meta.totalPages}
                        onChange={(next) => setSearchParams({ page: String(next) })}
                    />
                </>
            )}

            <ConfirmDialog
                open={postToDelete !== null}
                title="Delete this post?"
                message={`"${postToDelete?.title ?? ''}" will be removed from the blog. An admin can restore it later.`}
                loading={deletePost.isPending}
                onConfirm={handleDelete}
                onCancel={() => setPostToDelete(null)}
            />
        </div>
    );
}