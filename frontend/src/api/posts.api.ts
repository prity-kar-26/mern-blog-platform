import type { ApiSuccess, Paginated, Post, PostInput } from '../types';
import { apiClient } from './client';
import { toPage, unwrap } from './helpers';

export interface ListPostsParams {
    page?: number;
    limit?: number;
    author?: string;
}

export const postsApi = {
    list: (params: ListPostsParams): Promise<Paginated<Post>> =>
        apiClient.get<ApiSuccess<Post[]>>('/posts', { params }).then(toPage),

    getBySlug: (slug: string) => apiClient.get<ApiSuccess<Post>>(`/posts/${slug}`).then(unwrap),

    create: (input: PostInput) => apiClient.post<ApiSuccess<Post>>('/posts', input).then(unwrap),

    update: (id: string, input: Partial<PostInput>) =>
        apiClient.patch<ApiSuccess<Post>>(`/posts/${id}`, input).then(unwrap),

    remove: (id: string) => apiClient.delete(`/posts/${id}`),
};