import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { TableSkeleton } from '../../components/admin/TableSkeleton';
import { tableClass, tableWrap, tdClass, theadClass, thClass } from '../../components/admin/tableStyles';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { useAdminComments, useAdminDeleteComment } from '../../hooks/useAdmin';
import type { AdminComment } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { timeAgo } from '../../utils/format';

export function AdminCommentsPage() {
    const [page, setPage] = useState(1);
    const [commentToDelete, setCommentToDelete] = useState<AdminComment | null>(null);

    const { data, isPending, isError, isPlaceholderData, refetch } = useAdminComments({ page, limit: 10 });
    const deleteComment = useAdminDeleteComment();

    const confirmDelete = async () => {
        if (!commentToDelete) return;
        try {
            await deleteComment.mutateAsync(commentToDelete.id);
            toast.success('Comment deleted');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setCommentToDelete(null);
        }
    };

    return (
        <>
            <AdminPageHeader title="Comments" description="Moderate comments across all posts." />

            {isPending && <TableSkeleton />}

            {isError && (
                <EmptyState icon="⚠️" title="Could not load comments">
                    <Button onClick={() => refetch()}>Retry</Button>
                </EmptyState>
            )}

            {data && data.items.length === 0 && <EmptyState icon="💬" title="No comments yet" />}

            {data && data.items.length > 0 && (
                <>
                    <div className={`${tableWrap} ${isPlaceholderData ? 'opacity-60 transition-opacity' : ''}`}>
                        <table className={tableClass}>
                            <thead className={theadClass}>
                                <tr>
                                    <th className={thClass}>Comment</th>
                                    <th className={thClass}>Author</th>
                                    <th className={thClass}>Post</th>
                                    <th className={thClass}>Posted</th>
                                    <th className={`${thClass} text-right`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((comment) => (
                                    <tr key={comment.id}>
                                        <td className={`${tdClass} max-w-sm`}>
                                            <p className="line-clamp-2 break-words text-slate-700">{comment.content}</p>
                                        </td>
                                        <td className={`${tdClass} whitespace-nowrap text-slate-600`}>
                                            {comment.author?.name ?? 'Deleted user'}
                                        </td>
                                        <td className={`${tdClass} max-w-48`}>
                                            {comment.post ? (
                                                <Link to={`/posts/${comment.post.slug}`} className="block truncate hover:text-indigo-600">
                                                    {comment.post.title}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-400">Unknown</span>
                                            )}
                                        </td>
                                        <td className={`${tdClass} whitespace-nowrap text-slate-500`}>{timeAgo(comment.createdAt)}</td>
                                        <td className={`${tdClass} text-right`}>
                                            <Button size="sm" variant="danger" onClick={() => setCommentToDelete(comment)}>
                                                Delete
                                            </Button>
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
                open={commentToDelete !== null}
                title="Delete this comment?"
                message="The comment will be permanently removed."
                loading={deleteComment.isPending}
                onConfirm={confirmDelete}
                onCancel={() => setCommentToDelete(null)}
            />
        </>
    );
}