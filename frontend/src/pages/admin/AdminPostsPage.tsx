import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import type { PostStatus } from '../../api/admin.api';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { TableSkeleton } from '../../components/admin/TableSkeleton';
import { tableClass, tableWrap, tdClass, theadClass, thClass } from '../../components/admin/tableStyles';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { smallLinkClass } from '../../components/ui/styles';
import { useAdminDeletePost, useAdminPosts, useRestorePost } from '../../hooks/useAdmin';
import type { AdminPost } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { formatDate } from '../../utils/format';

const TABS: { value: PostStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Published' },
    { value: 'deleted', label: 'Deleted' },
];

export function AdminPostsPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<PostStatus>('all');
    const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null);

    const { data, isPending, isError, isPlaceholderData, refetch } = useAdminPosts({ page, limit: 10, status });
    const restorePost = useRestorePost();
    const deletePost = useAdminDeletePost();

    const restore = async (post: AdminPost) => {
        try {
            await restorePost.mutateAsync(post.id);
            toast.success('Post restored');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const confirmDelete = async () => {
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
        <>
            <AdminPageHeader title="Posts" description="Review, remove or restore any post." />

            <div role="tablist" aria-label="Post status" className="mb-4 inline-flex rounded-lg bg-slate-200/70 p-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={status === tab.value}
                        onClick={() => {
                            setStatus(tab.value);
                            setPage(1);
                        }}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${status === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isPending && <TableSkeleton />}

            {isError && (
                <EmptyState icon="⚠️" title="Could not load posts">
                    <Button onClick={() => refetch()}>Retry</Button>
                </EmptyState>
            )}

            {data && data.items.length === 0 && <EmptyState icon="📭" title="No posts here" />}

            {data && data.items.length > 0 && (
                <>
                    <div className={`${tableWrap} ${isPlaceholderData ? 'opacity-60 transition-opacity' : ''}`}>
                        <table className={tableClass}>
                            <thead className={theadClass}>
                                <tr>
                                    <th className={thClass}>Title</th>
                                    <th className={thClass}>Author</th>
                                    <th className={thClass}>Created</th>
                                    <th className={thClass}>Status</th>
                                    <th className={`${thClass} text-right`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((post) => (
                                    <tr key={post.id}>
                                        <td className={`${tdClass} max-w-xs`}>
                                            {post.isDeleted ? (
                                                <span className="block truncate font-medium text-slate-500 line-through">{post.title}</span>
                                            ) : (
                                                <Link to={`/posts/${post.slug}`} className="block truncate font-medium hover:text-indigo-600">
                                                    {post.title}
                                                </Link>
                                            )}
                                        </td>
                                        <td className={`${tdClass} whitespace-nowrap text-slate-600`}>
                                            {post.author?.name ?? 'Deleted user'}
                                        </td>
                                        <td className={`${tdClass} whitespace-nowrap text-slate-500`}>{formatDate(post.createdAt)}</td>
                                        <td className={tdClass}>
                                            {post.isDeleted ? (
                                                <Badge tone="red">Deleted{post.deletedAt && ` · ${formatDate(post.deletedAt)}`}</Badge>
                                            ) : (
                                                <Badge tone="green">Published</Badge>
                                            )}
                                        </td>
                                        <td className={`${tdClass} text-right`}>
                                            <div className="flex justify-end gap-2">
                                                {post.isDeleted ? (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        loading={restorePost.isPending && restorePost.variables === post.id}
                                                        onClick={() => restore(post)}
                                                    >
                                                        Restore
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Link to={`/posts/${post.slug}/edit`} className={smallLinkClass}>
                                                            Edit
                                                        </Link>
                                                        <Button size="sm" variant="danger" onClick={() => setPostToDelete(post)}>
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />
                </>
            )}

            <ConfirmDialog
                open={postToDelete !== null}
                title="Delete this post?"
                message={`"${postToDelete?.title ?? ''}" will be taken down. You can restore it from the Deleted tab.`}
                loading={deletePost.isPending}
                onConfirm={confirmDelete}
                onCancel={() => setPostToDelete(null)}
            />
        </>
    );
}