export type Role = 'user' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
}

export interface PageMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiSuccess<T> {
    success: true;
    data: T;
    meta?: PageMeta;
}

export interface ApiErrorBody {
    success: false;
    error: {
        code: string;
        message: string;
        details?: { path: string; message: string }[];
    };
}

export interface Paginated<T> {
    items: T[];
    meta: PageMeta;
}

export interface AuthPayload {
    user: User;
    accessToken: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput extends LoginInput {
    name: string;
}

export interface PostAuthor {
    id: string;
    name: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    author: PostAuthor | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminPost extends Post {
    isDeleted: boolean;
    deletedAt: string | null;
}

export interface Comment {
    id: string;
    postId: string;
    content: string;
    author: PostAuthor | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminComment {
    id: string;
    content: string;
    author: PostAuthor | null;
    post: { id: string; title: string; slug: string } | null;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
}

export interface PostInput {
    title: string;
    content: string;
}