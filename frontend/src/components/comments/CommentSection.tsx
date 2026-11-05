import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
    useComments,
    useCreateComment,
    useDeleteComment,
    useUpdateComment,
} from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuth';
import type { Comment } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { timeAgo } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { inputClass } from '../ui/styles';

interface CommentFormValues {
    content: string;
}

const contentRules = {
    required: 'Write something first',
    maxLength: { value: 1000, message: 'Comments are limited to 1000 characters' },
    validate: (value: string) => value.trim().length > 0 || 'Write something first',
};

function CommentForm({ postId }: { postId: string }) {
    const createComment = useCreateComment(postId);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CommentFormValues>();

    const onSubmit = handleSubmit(async ({ content }) => {
        try {
            await createComment.mutateAsync(content);
            reset();
            toast.success('Comment added');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    });

    return (
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
            <textarea
                rows={3}
                aria-label="Comment"
                placeholder="Share your thoughts…"
                className={inputClass}
                {...register('content', contentRules)}
            />
            {errors.content && (
                <p role="alert" className="text-sm text-red-600">
                    {errors.content.message}
                </p>
            )}
            <div className="flex justify-end">
                <Button type="submit" loading={createComment.isPending}>
                    Post comment
                </Button>
            </div>
        </form>
    );
}

function CommentItem({ comment, postId }: { comment: Comment; postId: string }) {
    const { user, isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const updateComment = useUpdateComment(postId);
    const deleteComment = useDeleteComment(postId);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CommentFormValues>({ defaultValues: { content: comment.content } });

    const authorName = comment.author?.name ?? 'Deleted user';
    const canModify = Boolean(user) && (isAdmin || user?.id === comment.author?.id);
    const wasEdited = new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 1000;

    const onSave = handleSubmit(async ({ content }) => {
        try {
            await updateComment.mutateAsync({ id: comment.id, content });
            setIsEditing(false);
            toast.success('Comment updated');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    });

    const onDelete = async () => {
        try {
            await deleteComment.mutateAsync(comment.id);
            toast.success('Comment deleted');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <li className="flex gap-4">
            <Avatar name={authorName} />
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-semibold text-slate-900">{authorName}</span>
                    <span className="text-xs text-slate-500">
                        {timeAgo(comment.createdAt)}
                        {wasEdited && ' · edited'}
                    </span>
                </div>

                {isEditing ? (
                    <form onSubmit={onSave} className="mt-2 space-y-2" noValidate>
                        <textarea
                            rows={3}
                            aria-label="Edit comment"
                            className={inputClass}
                            {...register('content', contentRules)}
                        />
                        {errors.content && (
                            <p role="alert" className="text-sm text-red-600">
                                {errors.content.message}
                            </p>
                        )}
                        <div className="flex gap-2">
                            <Button type="submit" loading={updateComment.isPending}>
                                Save
                            </Button>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="mt-1 whitespace-pre-wrap break-words text-slate-700">{comment.content}</p>
                )}

                {canModify && !isEditing && (
                    <div className="mt-2 flex gap-4 text-xs font-medium">
                        <button type="button" onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-indigo-600">
                            Edit
                        </button>
                        <button type="button" onClick={() => setIsDeleting(true)} className="text-slate-500 hover:text-red-600">
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={isDeleting}
                title="Delete comment?"
                message="This comment will be permanently removed."
                loading={deleteComment.isPending}
                onConfirm={onDelete}
                onCancel={() => setIsDeleting(false)}
            />
        </li>
    );
}

export function CommentSection({ postId }: { postId: string }) {
    const { user } = useAuth();
    const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(postId);

    const comments = data?.pages.flatMap((page) => page.items) ?? [];
    const total = data?.pages[0]?.meta.total ?? 0;

    return (
        <section className="mt-12 border-t border-slate-200 pt-10" aria-labelledby="comments-heading">
            <h2 id="comments-heading" className="text-2xl font-bold">
                Comments {total > 0 && <span className="text-slate-400">({total})</span>}
            </h2>

            <div className="mt-6">
                {user ? (
                    <CommentForm postId={postId} />
                ) : (
                    <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                            Log in
                        </Link>{' '}
                        to join the conversation.
                    </p>
                )}
            </div>

            <div className="mt-8">
                {isPending && (
                    <div className="space-y-6" aria-busy="true">
                        {[0, 1].map((key) => (
                            <div key={key} className="flex animate-pulse gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-32 rounded bg-slate-200" />
                                    <div className="h-3 rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isError && <p className="text-sm text-red-600">Could not load comments. Please try again.</p>}

                {!isPending && !isError && comments.length === 0 && (
                    <p className="text-sm text-slate-500">No comments yet. Be the first to share your thoughts.</p>
                )}

                {comments.length > 0 && (
                    <ul className="space-y-6">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} postId={postId} />
                        ))}
                    </ul>
                )}

                {hasNextPage && (
                    <div className="mt-6 text-center">
                        <Button variant="secondary" onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                            Load more comments
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}