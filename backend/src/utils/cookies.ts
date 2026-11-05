import { Response } from 'express';
import { env } from '../config/env';

export const REFRESH_COOKIE = 'refreshToken';

const baseOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    // Scoped so the browser only sends it to auth endpoints
    path: '/api/v1/auth',
};

export const setRefreshCookie = (res: Response, token: string, expires: Date) =>
    res.cookie(REFRESH_COOKIE, token, { ...baseOptions, expires });

export const clearRefreshCookie = (res: Response) => res.clearCookie(REFRESH_COOKIE, baseOptions);