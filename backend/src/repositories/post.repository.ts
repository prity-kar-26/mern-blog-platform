import { Types } from 'mongoose';
import { Post, PostWithAuthor } from '../models/post.model';

interface ListOptions {
    page: number;
    limit: number;
    author?: string;
    includeDeleted?: boolean;
}

interface PostOwnerRef {
    _id: Types.ObjectId;
    author: Types.ObjectId;
}

// const withAuthor = <T extends { populate: (path: string, select: string) => unknown }>(q: T) =>
//     q.populate('author', 'name');

export const postRepository = {
    async findPage({ page, limit, author, includeDeleted = false }: ListOptions) {
        const filter = {
            ...(includeDeleted ? {} : { isDeleted: false }),
            ...(author ? { author } : {}),
        };

        const [items, total] = await Promise.all([
            Post.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('author', 'name')
                .lean<PostWithAuthor[]>(),
            Post.countDocuments(filter),
        ]);

        return { items, total };
    },

    findBySlug: (slug: string) =>
        Post.findOne({ slug, isDeleted: false }).populate('author', 'name').lean<PostWithAuthor | null>(),

    findByIdWithAuthor: (id: string) =>
        Post.findOne({ _id: id, isDeleted: false })
            .populate('author', 'name')
            .lean<PostWithAuthor | null>(),

    // Minimal projection: callers only need existence and ownership
    findOwnerRef: (id: string) =>
        Post.findOne({ _id: id, isDeleted: false }).select('author').lean<PostOwnerRef | null>(),

    create: (data: { title: string; content: string; slug: string; author: string }) =>
        Post.create(data),

    updateById: (id: string, changes: { title?: string; content?: string }) =>
        Post.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: changes }, {
            new: true,
            runValidators: true,
        })
            .populate('author', 'name')
            .lean<PostWithAuthor | null>(),

    softDeleteById: (id: string) =>
        Post.updateOne({ _id: id, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }),
};