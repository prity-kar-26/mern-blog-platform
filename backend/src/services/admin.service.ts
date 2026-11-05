import { ROLES } from '../constants/roles';
import { commentRepository } from '../repositories/comment.repository';
import { postRepository } from '../repositories/post.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { userRepository } from '../repositories/user.repository';
import { AuthUser } from '../types/auth.types';
import { ApiError } from '../utils/ApiError';
import { buildPageMeta } from '../utils/pagination';
import {
    toAdminCommentResponse,
    toAdminPostResponse,
    toPostResponse,
    toUserResponse,
} from '../utils/serializers';
import {
    ListAdminCommentsQuery,
    ListAdminPostsQuery,
    ListUsersQuery,
    UpdateUserInput,
} from '../validators/admin.validator';

const POST_STATUS_TO_FILTER = { active: 'exclude', deleted: 'only', all: 'include' } as const;

export const adminService = {
    async getStats() {
        const [totalUsers, totalPosts, totalComments] = await Promise.all([
            userRepository.count(),
            postRepository.countActive(),
            commentRepository.count(),
        ]);

        return { totalUsers, totalPosts, totalComments };
    },

    async listUsers(query: ListUsersQuery) {
        const { items, total } = await userRepository.findPage(query);
        return { items: items.map(toUserResponse), meta: buildPageMeta(total, query.page, query.limit) };
    },

    async updateUser(id: string, actor: AuthUser, changes: UpdateUserInput) {
        // Prevents the last admin from locking themselves out
        if (id === actor.id && (changes.role === ROLES.USER || changes.isActive === false)) {
            throw ApiError.badRequest('You cannot demote or deactivate your own account');
        }

        // No session revocation needed: refresh and login re-read role and isActive from the database
        const user = await userRepository.updateById(id, changes);
        if (!user) throw ApiError.notFound('User not found');
        return toUserResponse(user);
    },

    async deleteUser(id: string, actor: AuthUser) {
        if (id === actor.id) throw ApiError.badRequest('You cannot delete your own account');
        if (!(await userRepository.findById(id))) throw ApiError.notFound('User not found');

        // The user document goes last so a partial failure can simply be retried
        await Promise.all([
            refreshTokenRepository.deleteAllByUser(id),
            postRepository.softDeleteByAuthor(id),
            commentRepository.deleteByAuthor(id),
        ]);
        await userRepository.deleteById(id);
    },

    async listPosts(query: ListAdminPostsQuery) {
        const { items, total } = await postRepository.findPage({
            page: query.page,
            limit: query.limit,
            deleted: POST_STATUS_TO_FILTER[query.status],
        });

        return {
            items: items.map(toAdminPostResponse),
            meta: buildPageMeta(total, query.page, query.limit),
        };
    },

    async restorePost(id: string) {
        const result = await postRepository.restoreById(id);
        if (result.matchedCount === 0) throw ApiError.notFound('Deleted post not found');

        const post = await postRepository.findByIdWithAuthor(id);
        if (!post) throw ApiError.notFound('Post not found');
        return toPostResponse(post);
    },

    async listComments(query: ListAdminCommentsQuery) {
        const { items, total } = await commentRepository.findPageAll(query.page, query.limit);
        return {
            items: items.map(toAdminCommentResponse),
            meta: buildPageMeta(total, query.page, query.limit),
        };
    },
};