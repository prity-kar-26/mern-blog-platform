import { z } from 'zod';
import { objectId, paginationQuery } from './common.validator';

const content = z.string().trim().min(1, 'Comment cannot be empty').max(1000);

export const listCommentsSchema = z.object({
    params: z.object({ postId: objectId }),
    query: paginationQuery,
});

export const createCommentSchema = z.object({
    params: z.object({ postId: objectId }),
    body: z.object({ content }),
});

export const updateCommentSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({ content }),
});

export const commentIdParamSchema = z.object({ params: z.object({ id: objectId }) });

export type ListCommentsQuery = z.infer<typeof listCommentsSchema>['query'];