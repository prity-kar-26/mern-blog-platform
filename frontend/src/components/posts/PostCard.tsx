import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import { excerpt, formatDate, readingTime } from '../../utils/format';
import { Avatar } from '../ui/Avatar';

export function PostCard({ post }: { post: Post }) {
    const authorName = post.author?.name ?? 'Deleted user';

    return (
        <Link
            to={`/posts/${post.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="h-1.5 bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
            <div className="flex flex-1 flex-col p-6">
                <h3 className="line-clamp-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                    {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                    {excerpt(post.content, 180)}
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <Avatar name={authorName} size="sm" />
                    <div className="min-w-0 text-xs">
                        <p className="truncate font-medium text-slate-900">{authorName}</p>
                        <p className="text-slate-500">
                            {formatDate(post.createdAt)} · {readingTime(post.content)} min read
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}