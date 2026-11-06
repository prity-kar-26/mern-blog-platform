import type {
  AdminComment,
  AdminPost,
  ApiSuccess,
  DashboardStats,
  Paginated,
  Post,
  Role,
  User,
} from '../types';
import { apiClient } from './client';
import { toPage, unwrap } from './helpers';

export type PostStatus = 'all' | 'active' | 'deleted';

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  isActive?: boolean;
}

export interface AdminPostsParams {
  page?: number;
  limit?: number;
  status?: PostStatus;
}

export interface AdminCommentsParams {
  page?: number;
  limit?: number;
}

export const adminApi = {
  stats: () => apiClient.get<ApiSuccess<DashboardStats>>('/admin/stats').then(unwrap),

  listUsers: (params: AdminUsersParams): Promise<Paginated<User>> =>
    apiClient.get<ApiSuccess<User[]>>('/admin/users', { params }).then(toPage),

  updateUser: (id: string, changes: { role?: Role; isActive?: boolean }) =>
    apiClient.patch<ApiSuccess<User>>(`/admin/users/${id}`, changes).then(unwrap),

  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),

  listPosts: (params: AdminPostsParams): Promise<Paginated<AdminPost>> =>
    apiClient.get<ApiSuccess<AdminPost[]>>('/admin/posts', { params }).then(toPage),

  restorePost: (id: string) =>
    apiClient.post<ApiSuccess<Post>>(`/admin/posts/${id}/restore`).then(unwrap),

  listComments: (params: AdminCommentsParams): Promise<Paginated<AdminComment>> =>
    apiClient.get<ApiSuccess<AdminComment[]>>('/admin/comments', { params }).then(toPage),
};