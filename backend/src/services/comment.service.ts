import { commentRepository } from '../repositories/comment.repository';
import { postRepository } from '../repositories/post.repository';
import { AuthUser } from '../types/auth.types';
import { ApiError } from '../utils/ApiError';
import { buildPageMeta } from '../utils/pagination';
import { assertCanModify } from '../utils/permissions';
import { toCommentResponse } from '../utils/serializers';
import { ListCommentsQuery } from '../validators/comment.validator';

const assertPostExists = async (postId: string) => {
    if (!(await postRepository.findOwnerRef(postId))) throw ApiError.notFound('Post not found');
};

export const commentService = {
    async listByPost(postId: string, query: ListCommentsQuery) {
        await assertPostExists(postId);
        const { items, total } = await commentRepository.findPageByPost(postId, query.page, query.limit);
        return {
            items: items.map(toCommentResponse),
            meta: buildPageMeta(total, query.page, query.limit),
        };
    },

    async create(postId: string, authorId: string, content: string) {
        await assertPostExists(postId);

        const created = await commentRepository.create({ post: postId, author: authorId, content });
        const comment = await commentRepository.findByIdWithAuthor(created.id);
        if (!comment) throw ApiError.notFound('Comment not found');
        return toCommentResponse(comment);
    },

    async update(id: string, user: AuthUser, content: string) {
        const ref = await commentRepository.findOwnerRef(id);
        if (!ref) throw ApiError.notFound('Comment not found');
        assertCanModify(ref.author, user);

        const comment = await commentRepository.updateById(id, content);
        if (!comment) throw ApiError.notFound('Comment not found');
        return toCommentResponse(comment);
    },

    async remove(id: string, user: AuthUser) {
        const ref = await commentRepository.findOwnerRef(id);
        if (!ref) throw ApiError.notFound('Comment not found');
        assertCanModify(ref.author, user);

        await commentRepository.deleteById(id);
    },
};