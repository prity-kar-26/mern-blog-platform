import { postRepository } from '../repositories/post.repository';
import { AuthUser } from '../types/auth.types';
import { ApiError } from '../utils/ApiError';
import { buildPageMeta } from '../utils/pagination';
import { assertCanModify } from '../utils/permissions';
import { generateSlug } from '../utils/slug';
import { toPostResponse } from '../utils/serializers';
import { CreatePostInput, ListPostsQuery, UpdatePostInput } from '../validators/post.validator';

export const postService = {
    async list(query: ListPostsQuery) {
        const { items, total } = await postRepository.findPage(query);
        return { items: items.map(toPostResponse), meta: buildPageMeta(total, query.page, query.limit) };
    },

    async getBySlug(slug: string) {
        const post = await postRepository.findBySlug(slug);
        if (!post) throw ApiError.notFound('Post not found');
        return toPostResponse(post);
    },

    async create(authorId: string, input: CreatePostInput) {
        const created = await postRepository.create({
            ...input,
            slug: generateSlug(input.title),
            author: authorId,
        });

        const post = await postRepository.findByIdWithAuthor(created.id);
        if (!post) throw ApiError.notFound('Post not found');
        return toPostResponse(post);
    },

    async update(id: string, user: AuthUser, input: UpdatePostInput) {
        const ref = await postRepository.findOwnerRef(id);
        if (!ref) throw ApiError.notFound('Post not found');
        assertCanModify(ref.author, user);

        // The slug is intentionally not regenerated, so shared links keep working after a title edit
        const post = await postRepository.updateById(id, input);
        if (!post) throw ApiError.notFound('Post not found');
        return toPostResponse(post);
    },

    async remove(id: string, user: AuthUser) {
        const ref = await postRepository.findOwnerRef(id);
        if (!ref) throw ApiError.notFound('Post not found');
        assertCanModify(ref.author, user);

        await postRepository.softDeleteById(id);
    },
};