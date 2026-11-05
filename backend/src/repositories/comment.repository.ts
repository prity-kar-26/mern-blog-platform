import { Types } from 'mongoose';
import { Comment, CommentWithAuthor } from '../models/comment.model';

interface CommentOwnerRef {
    _id: Types.ObjectId;
    author: Types.ObjectId;
}

export const commentRepository = {
    async findPageByPost(postId: string, page: number, limit: number) {
        const [items, total] = await Promise.all([
            Comment.find({ post: postId })
                .sort({ createdAt: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('author', 'name')
                .lean<CommentWithAuthor[]>(),
            Comment.countDocuments({ post: postId }),
        ]);

        return { items, total };
    },

    findByIdWithAuthor: (id: string) =>
        Comment.findById(id).populate('author', 'name').lean<CommentWithAuthor | null>(),

    findOwnerRef: (id: string) => Comment.findById(id).select('author').lean<CommentOwnerRef | null>(),

    create: (data: { post: string; author: string; content: string }) => Comment.create(data),

    updateById: (id: string, content: string) =>
        Comment.findByIdAndUpdate(id, { $set: { content } }, { new: true, runValidators: true })
            .populate('author', 'name')
            .lean<CommentWithAuthor | null>(),

    deleteById: (id: string) => Comment.deleteOne({ _id: id }),
};