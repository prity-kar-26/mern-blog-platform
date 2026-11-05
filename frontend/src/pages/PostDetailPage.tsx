import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CommentSection } from '../components/comments/CommentSection';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { secondaryLinkClass } from '../components/ui/styles';
import { useAuth } from '../hooks/useAuth';
import { useDeletePost, usePost } from '../hooks/usePosts';
import { getErrorMessage } from '../utils/error';
import { formatDate, readingTime } from '../utils/format';

function PostSkeleton() {
    return (
        <div className="mx-auto max-w-3xl animate-pulse space-y-4" aria-busy="true">
            <div className="h-10 w-3/4 rounded bg-slate-200" />
            <div className="h-10 w-1/2 rounded bg-slate-200" />
            <div className="flex items-center gap-3 py-4">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div className="h-3 w-40 rounded bg-slate-200" />
            </div>
            {[0, 1, 2, 3, 4].map((key) => (
                <div key={key} className="h-4 rounded bg-slate-100" />
            ))}
        </div>
    );
}

export function PostDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const { data: post, isPending, isError } = usePost(slug);
    const deletePost = useDeletePost();
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (isPending) return <PostSkeleton />;

    if (isError || !post) {
        return (
            <EmptyState icon="🔍" title="Post not found" description="It may have been removed or the link is incorrect.">
                <Link to="/" className={secondaryLinkClass}>
                    Back to home
                </Link>
            </EmptyState>
        );
    }

    const authorName = post.author?.name ?? 'Deleted user';
    const canModify = Boolean(user) && (isAdmin || user?.id === post.author?.id);

    const handleDelete = async () => {
        try {
            await deletePost.mutateAsync(post.id);
            toast.success('Post deleted');
            navigate('/');
        } catch (error) {
            toast.error(getErrorMessage(error));
            setConfirmOpen(false);
        }
    };

    return (
        <>
            <article className="mx-auto max-w-3xl">
                <Link to="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600">
                    ← Back to all posts
                </Link>

                <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-3">
                        <Avatar name={authorName} size="lg" />
                        <div className="text-sm">
                            <p className="font-semibold text-slate-900">{authorName}</p>
                            <p className="text-slate-500">
                                {formatDate(post.createdAt)} · {readingTime(post.content)} min read
                            </p>
                        </div>
                    </div>

                    {canModify && (
                        <div className="flex gap-2">
                            <Link to={`/posts/${post.slug}/edit`} className={secondaryLinkClass}>
                                Edit
                            </Link>
                            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-8 whitespace-pre-wrap break-words text-lg leading-8 text-slate-700">
                    {post.content}
                </div>

                <CommentSection postId={post.id} />
            </article>

            <ConfirmDialog
                open={confirmOpen}
                title="Delete this post?"
                message="The post will be removed from the blog. An admin can restore it later."
                loading={deletePost.isPending}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}