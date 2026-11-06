import type { AdminCommentsParams, AdminPostsParams, AdminUsersParams } from '../api/admin.api';
import type { ListPostsParams } from '../api/posts.api';

export const queryKeys = {
    posts: {
        all: ['posts'] as const,
        list: (params: ListPostsParams) => ['posts', 'list', params] as const,
        detail: (slug: string) => ['posts', 'detail', slug] as const,
    },
    comments: {
        all: ['comments'] as const,
        list: (postId: string) => ['comments', postId] as const,
    },
    admin: {
        all: ['admin'] as const,
        stats: ['admin', 'stats'] as const,
        users: (params: AdminUsersParams) => ['admin', 'users', params] as const,
        posts: (params: AdminPostsParams) => ['admin', 'posts', params] as const,
        comments: (params: AdminCommentsParams) => ['admin', 'comments', params] as const,
    },
};