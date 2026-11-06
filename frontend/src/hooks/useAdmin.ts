import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    adminApi,
    type AdminCommentsParams,
    type AdminPostsParams,
    type AdminUsersParams,
} from '../api/admin.api';
import { commentsApi } from '../api/comments.api';
import { postsApi } from '../api/posts.api';
import { queryKeys } from '../lib/queryKeys';
import type { Role } from '../types';

// Admin actions ripple across lists and counts (deleting a user removes posts and comments too)
function useInvalidateContent() {
    const queryClient = useQueryClient();

    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
            queryClient.invalidateQueries({ queryKey: queryKeys.comments.all }),
        ]);
}

export const useAdminStats = () =>
    useQuery({
        queryKey: queryKeys.admin.stats,
        queryFn: adminApi.stats,
        // Counts change constantly, so always refetch when the dashboard opens
        staleTime: 0,
    });

export const useAdminUsers = (params: AdminUsersParams) =>
    useQuery({
        queryKey: queryKeys.admin.users(params),
        queryFn: () => adminApi.listUsers(params),
        placeholderData: keepPreviousData,
    });

export const useAdminPosts = (params: AdminPostsParams) =>
    useQuery({
        queryKey: queryKeys.admin.posts(params),
        queryFn: () => adminApi.listPosts(params),
        placeholderData: keepPreviousData,
    });

export const useAdminComments = (params: AdminCommentsParams) =>
    useQuery({
        queryKey: queryKeys.admin.comments(params),
        queryFn: () => adminApi.listComments(params),
        placeholderData: keepPreviousData,
    });

export function useUpdateUser() {
    const invalidate = useInvalidateContent();
    return useMutation({
        mutationFn: ({ id, changes }: { id: string; changes: { role?: Role; isActive?: boolean } }) =>
            adminApi.updateUser(id, changes),
        onSuccess: invalidate,
    });
}

export function useDeleteUser() {
    const invalidate = useInvalidateContent();
    return useMutation({ mutationFn: adminApi.deleteUser, onSuccess: invalidate });
}

export function useRestorePost() {
    const invalidate = useInvalidateContent();
    return useMutation({ mutationFn: adminApi.restorePost, onSuccess: invalidate });
}

// Admins reuse the regular delete endpoint, which the API allows for any post
export function useAdminDeletePost() {
    const invalidate = useInvalidateContent();
    return useMutation({ mutationFn: postsApi.remove, onSuccess: invalidate });
}

export function useAdminDeleteComment() {
    const invalidate = useInvalidateContent();
    return useMutation({ mutationFn: commentsApi.remove, onSuccess: invalidate });
}