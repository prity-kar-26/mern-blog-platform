import { z } from 'zod';
import { objectId, paginationQuery } from './common.validator';

const title = z.string().trim().min(3, 'Title must be at least 3 characters').max(150);
const content = z.string().trim().min(10, 'Content must be at least 10 characters').max(20000);

export const listPostsSchema = z.object({
    query: paginationQuery.extend({ author: objectId.optional() }),
});

export const slugParamSchema = z.object({
    params: z.object({ slug: z.string().trim().min(1).max(100) }),
});

export const postIdParamSchema = z.object({ params: z.object({ id: objectId }) });

export const createPostSchema = z.object({ body: z.object({ title, content }) });

export const updatePostSchema = z.object({
    params: z.object({ id: objectId }),
    body: z
        .object({ title: title.optional(), content: content.optional() })
        .refine((b) => b.title !== undefined || b.content !== undefined, {
            message: 'Provide at least one field to update',
        }),
});

export type ListPostsQuery = z.infer<typeof listPostsSchema>['query'];
export type CreatePostInput = z.infer<typeof createPostSchema>['body'];
export type UpdatePostInput = z.infer<typeof updatePostSchema>['body'];