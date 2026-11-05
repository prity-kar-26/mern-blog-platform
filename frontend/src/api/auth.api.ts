import type { ApiSuccess, AuthPayload, LoginInput, RegisterInput } from '../types';
import { API_URL, apiClient } from './client';

export type OAuthProvider = 'google' | 'facebook';

export const authApi = {
    login: (input: LoginInput) =>
        apiClient.post<ApiSuccess<AuthPayload>>('/auth/login', input).then((res) => res.data.data),

    register: (input: RegisterInput) =>
        apiClient.post<ApiSuccess<AuthPayload>>('/auth/register', input).then((res) => res.data.data),

    logout: () => apiClient.post('/auth/logout'),
};

// OAuth needs a full-page redirect, not an XHR call
export const oauthUrl = (provider: OAuthProvider) => `${API_URL}/auth/${provider}`;