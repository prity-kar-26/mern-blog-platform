import { Schema, Types, model } from 'mongoose';
import { PopulatedAuthor } from './post.model';

export interface IComment {
    post: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CommentWithAuthor = Omit<IComment, 'author'> & {
    _id: Types.ObjectId;
    author: PopulatedAuthor | null;
};

const commentSchema = new Schema<IComment>(
    {
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
    },
    { timestamps: true, versionKey: false },
);

// Serves "comments of a post in chronological order" with pagination
commentSchema.index({ post: 1, createdAt: 1 });

export const Comment = model<IComment>('Comment', commentSchema);