import { z } from 'zod';
import { ROLES } from '../constants/roles';
import { objectId, paginationQuery } from './common.validator';

const role = z.enum([ROLES.USER, ROLES.ADMIN]);

export const listUsersSchema = z.object({
    query: paginationQuery.extend({
        search: z.string().trim().max(50).optional(),
        role: role.optional(),
        isActive: z
            .enum(['true', 'false'])
            .transform((v) => v === 'true')
            .optional(),
    }),
});

export const userIdParamSchema = z.object({ params: z.object({ id: objectId }) });

export const updateUserSchema = z.object({
    params: z.object({ id: objectId }),
    body: z
        .object({ role: role.optional(), isActive: z.boolean().optional() })
        .refine((b) => b.role !== undefined || b.isActive !== undefined, {
            message: 'Provide at least one field to update',
        }),
});

export const listAdminPostsSchema = z.object({
    query: paginationQuery.extend({ status: z.enum(['active', 'deleted', 'all']).default('all') }),
});

export const listAdminCommentsSchema = z.object({ query: paginationQuery });

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ListAdminPostsQuery = z.infer<typeof listAdminPostsSchema>['query'];
export type ListAdminCommentsQuery = z.infer<typeof listAdminCommentsSchema>['query'];