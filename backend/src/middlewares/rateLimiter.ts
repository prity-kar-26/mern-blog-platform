import rateLimit, { Options } from 'express-rate-limit';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const WINDOW_MS = 15 * 60 * 1000;

const createLimiter = (limit: number, extra: Partial<Options> = {}) =>
    rateLimit({
        windowMs: WINDOW_MS,
        limit,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        skip: () => env.NODE_ENV === 'test',
        // Routed through next() so 429s use the same error format as everything else
        handler: (_req, _res, next) =>
            next(new ApiError(429, 'Too many requests, please try again later', 'RATE_LIMITED')),
        ...extra,
    });

// Only failed logins count, so legitimate users are not locked out by successful ones
export const loginLimiter = createLimiter(10, { skipSuccessfulRequests: true });
export const authLimiter = createLimiter(30);