import { HydratedDocument, Schema, Types, model } from 'mongoose';

export interface IPost {
    title: string;
    slug: string;
    content: string;
    author: Types.ObjectId;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type PostDocument = HydratedDocument<IPost>;

export interface PopulatedAuthor {
    _id: Types.ObjectId;
    name: string;
}

export type PostWithAuthor = Omit<IPost, 'author'> & {
    _id: Types.ObjectId;
    author: PopulatedAuthor | null;
};

const postSchema = new Schema<IPost>(
    {
        title: { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true, trim: true, minlength: 10, maxlength: 20000 },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true, versionKey: false },
);

// Public feed: non-deleted posts, newest first
postSchema.index({ isDeleted: 1, createdAt: -1 });
// "Posts by author" lists and the author filter
postSchema.index({ author: 1, isDeleted: 1, createdAt: -1 });

export const Post = model<IPost>('Post', postSchema);