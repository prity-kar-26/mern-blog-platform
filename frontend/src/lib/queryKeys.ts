import type { ListPostsParams } from '../api/posts.api';

export const queryKeys = {
    posts: {
        all: ['posts'] as const,
        list: (params: ListPostsParams) => ['posts', 'list', params] as const,
        detail: (slug: string) => ['posts', 'detail', slug] as const,
    },
    comments: {
        list: (postId: string) => ['comments', postId] as const,
    },
};