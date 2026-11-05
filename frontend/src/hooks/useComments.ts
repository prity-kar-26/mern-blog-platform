import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments.api';
import { queryKeys } from '../lib/queryKeys';

export function useComments(postId: string) {
    return useInfiniteQuery({
        queryKey: queryKeys.comments.list(postId),
        queryFn: ({ pageParam }) => commentsApi.list(postId, pageParam),
        initialPageParam: 1,
        getNextPageParam: (last) => (last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined),
    });
}

export function useCreateComment(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (content: string) => commentsApi.create(postId, content),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(postId) }),
    });
}

export function useUpdateComment(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) => commentsApi.update(id, content),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(postId) }),
    });
}

export function useDeleteComment(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => commentsApi.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(postId) }),
    });
}