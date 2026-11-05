import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FullPageSpinner } from '../components/ui/Spinner';
import { inputClass, secondaryLinkClass } from '../components/ui/styles';
import { useAuth } from '../hooks/useAuth';
import { useCreatePost, usePost, useUpdatePost } from '../hooks/usePosts';
import type { PostInput } from '../types';
import { getErrorMessage } from '../utils/error';

const TITLE_MAX = 150;
const CONTENT_MAX = 20000;

export function PostEditorPage() {
    const { slug } = useParams();
    const isEdit = Boolean(slug);
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const { data: post, isPending, isError } = usePost(slug);
    const createPost = useCreatePost();
    const updatePost = useUpdatePost();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PostInput>({
        defaultValues: { title: '', content: '' },
        // Fills the form once the post being edited has loaded
        values: post ? { title: post.title, content: post.content } : undefined,
    });

    const title = useWatch({ control, name: 'title' });
    const content = useWatch({ control, name: 'content' });
    const isSaving = createPost.isPending || updatePost.isPending;

    if (isEdit && isPending) return <FullPageSpinner />;

    if (isEdit && (isError || !post)) {
        return (
            <EmptyState icon="🔍" title="Post not found">
                <Link to="/" className={secondaryLinkClass}>
                    Back to home
                </Link>
            </EmptyState>
        );
    }

    if (post && !isAdmin && post.author?.id !== user?.id) {
        return (
            <EmptyState icon="🔒" title="You can't edit this post" description="Only the author or an admin can edit it.">
                <Link to={`/posts/${post.slug}`} className={secondaryLinkClass}>
                    Back to post
                </Link>
            </EmptyState>
        );
    }

    const onSubmit = handleSubmit(async (values) => {
        try {
            if (post) {
                await updatePost.mutateAsync({ id: post.id, input: values });
                toast.success('Post updated');
                navigate(`/posts/${post.slug}`);
            } else {
                const created = await createPost.mutateAsync(values);
                toast.success('Post published');
                navigate(`/posts/${created.slug}`);
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    });

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight">{isEdit ? 'Edit post' : 'Write a new post'}</h1>
            <p className="mt-1 text-slate-600">
                {isEdit ? 'Update your story below.' : 'Share something with the community.'}
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                        Title
                    </label>
                    <input
                        id="title"
                        placeholder="A title that grabs attention"
                        className={`${inputClass} text-lg font-semibold`}
                        {...register('title', {
                            required: 'Title is required',
                            minLength: { value: 3, message: 'Title must be at least 3 characters' },
                            maxLength: { value: TITLE_MAX, message: `Title must be at most ${TITLE_MAX} characters` },
                        })}
                    />
                    <div className="mt-1 flex justify-between text-xs">
                        <span role="alert" className="text-red-600">
                            {errors.title?.message}
                        </span>
                        <span className="text-slate-400">
                            {title?.length ?? 0}/{TITLE_MAX}
                        </span>
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="mb-2 block text-sm font-medium text-slate-700">
                        Content
                    </label>
                    <textarea
                        id="content"
                        rows={14}
                        placeholder="Tell your story…"
                        className={`${inputClass} leading-7`}
                        {...register('content', {
                            required: 'Content is required',
                            minLength: { value: 10, message: 'Content must be at least 10 characters' },
                            maxLength: { value: CONTENT_MAX, message: `Content must be at most ${CONTENT_MAX} characters` },
                        })}
                    />
                    <div className="mt-1 flex justify-between text-xs">
                        <span role="alert" className="text-red-600">
                            {errors.content?.message}
                        </span>
                        <span className="text-slate-400">
                            {content?.length ?? 0}/{CONTENT_MAX}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSaving}>
                        {isEdit ? 'Save changes' : 'Publish'}
                    </Button>
                </div>
            </form>
        </div>
    );
}