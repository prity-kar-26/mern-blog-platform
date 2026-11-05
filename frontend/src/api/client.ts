import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorBody, ApiSuccess, AuthPayload } from '../types';

export const API_URL = import.meta.env.VITE_API_URL as string;

// Held in memory only, so a script injected into the page cannot read it from storage
let accessToken: string | null = null;
let onSessionExpired: (() => void) | null = null;

export const tokenStore = {
    set: (token: string | null) => {
        accessToken = token;
    },
};

export const setSessionExpiredHandler = (handler: (() => void) | null) => {
    onSessionExpired = handler;
};

export const apiClient = axios.create({ baseURL: API_URL, withCredentials: true });

apiClient.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

let refreshPromise: Promise<AuthPayload> | null = null;

// Single-flight: refresh tokens rotate, so parallel callers must share one request
export const refreshSession = (): Promise<AuthPayload> => {
    refreshPromise ??= axios
        .post<ApiSuccess<AuthPayload>>(`${API_URL}/auth/refresh`, null, { withCredentials: true })
        .then(({ data }) => {
            accessToken = data.data.accessToken;
            return data.data;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
};

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorBody>) => {
        const original = error.config as RetriableConfig | undefined;
        const isAuthCall = original?.url?.startsWith('/auth/');

        if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
            original._retry = true;
            try {
                await refreshSession();
                return apiClient(original);
            } catch {
                accessToken = null;
                onSessionExpired?.();
            }
        }

        return Promise.reject(error);
    },
);