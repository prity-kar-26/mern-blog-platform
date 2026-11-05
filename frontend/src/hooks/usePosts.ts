import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi, type ListPostsParams } from '../api/posts.api';
import { queryKeys } from '../lib/queryKeys';
import type { PostInput } from '../types';

export function usePosts(params: ListPostsParams) {
    return useQuery({
        queryKey: queryKeys.posts.list(params),
        queryFn: () => postsApi.list(params),
        // Keeps the current page on screen while the next one loads
        placeholderData: keepPreviousData,
    });
}

export function usePost(slug: string | undefined) {
    return useQuery({
        queryKey: queryKeys.posts.detail(slug ?? ''),
        queryFn: () => postsApi.getBySlug(slug as string),
        enabled: Boolean(slug),
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postsApi.create,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<PostInput> }) =>
            postsApi.update(id, input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postsApi.remove,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
    });
}