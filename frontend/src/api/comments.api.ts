import type { ApiSuccess, Comment, Paginated } from '../types';
import { apiClient } from './client';
import { toPage, unwrap } from './helpers';

const PAGE_SIZE = 10;

export const commentsApi = {
    list: (postId: string, page: number): Promise<Paginated<Comment>> =>
        apiClient
            .get<ApiSuccess<Comment[]>>(`/posts/${postId}/comments`, { params: { page, limit: PAGE_SIZE } })
            .then(toPage),

    create: (postId: string, content: string) =>
        apiClient.post<ApiSuccess<Comment>>(`/posts/${postId}/comments`, { content }).then(unwrap),

    update: (id: string, content: string) =>
        apiClient.patch<ApiSuccess<Comment>>(`/comments/${id}`, { content }).then(unwrap),

    remove: (id: string) => apiClient.delete(`/comments/${id}`),
};