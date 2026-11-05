import { UserDocument } from '../models/user.model';
import { CommentWithAuthor } from '../models/comment.model';
import { PopulatedAuthor, PostWithAuthor } from '../models/post.model';

export const toUserResponse = (user: UserDocument) => ({
    id: user.id as string,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
});

export type UserResponse = ReturnType<typeof toUserResponse>;

const toAuthorResponse = (author: PopulatedAuthor | null) =>
    author ? { id: author._id.toString(), name: author.name } : null;

export const toPostResponse = (post: PostWithAuthor) => ({
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    content: post.content,
    author: toAuthorResponse(post.author),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
});

export const toCommentResponse = (comment: CommentWithAuthor) => ({
    id: comment._id.toString(),
    postId: comment.post.toString(),
    content: comment.content,
    author: toAuthorResponse(comment.author),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
});