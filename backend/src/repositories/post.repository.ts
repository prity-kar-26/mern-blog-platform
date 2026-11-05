import { Types } from 'mongoose';
import { Post, PostWithAuthor } from '../models/post.model';

type DeletedFilter = 'exclude' | 'only' | 'include';

interface ListOptions {
    page: number;
    limit: number;
    author?: string;
    deleted?: DeletedFilter;
}

interface PostOwnerRef {
    _id: Types.ObjectId;
    author: Types.ObjectId;
}

const DELETED_FILTERS: Record<DeletedFilter, { isDeleted?: boolean }> = {
    exclude: { isDeleted: false },
    only: { isDeleted: true },
    include: {},
};

export const postRepository = {
    async findPage({ page, limit, author, deleted = 'exclude' }: ListOptions) {
        const filter = { ...DELETED_FILTERS[deleted], ...(author ? { author } : {}) };

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

    softDeleteByAuthor: (authorId: string) =>
        Post.updateMany(
            { author: authorId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
        ),

    restoreById: (id: string) =>
        Post.updateOne({ _id: id, isDeleted: true }, { $set: { isDeleted: false, deletedAt: null } }),

    countActive: () => Post.countDocuments({ isDeleted: false }),
};