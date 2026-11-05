import crypto from 'node:crypto';
import { RequestHandler, Response } from 'express';
import { env } from '../config/env';
import { logger } from '../config/logger';
import passport, { isOAuthEnabled } from '../config/passport';
import { OAuthProvider } from '../constants/oauth';
import { UserDocument } from '../models/user.model';
import { authService } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';
import { setRefreshCookie } from '../utils/cookies';

const STATE_COOKIE = 'oauthState';
const SCOPES: Record<OAuthProvider, string[]> = { google: ['profile', 'email'], facebook: ['email'] };

const stateCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/v1/auth',
};

const safeEqual = (a: string, b: string) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
};

// The browser is mid-redirect, so failures go back to the frontend instead of a JSON body
const redirectWithError = (res: Response, message: string) =>
    res.redirect(`${env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`);

export const oauthController = {
    start:
        (provider: OAuthProvider): RequestHandler =>
            (req, res, next) => {
                if (!isOAuthEnabled(provider)) {
                    return next(new ApiError(501, `${provider} sign-in is not configured`, 'OAUTH_NOT_CONFIGURED'));
                }

                const state = crypto.randomBytes(16).toString('hex');
                res.cookie(STATE_COOKIE, state, { ...stateCookieOptions, maxAge: 10 * 60 * 1000 });
                passport.authenticate(provider, { scope: SCOPES[provider], state, session: false })(req, res, next);
            },

    callback:
        (provider: OAuthProvider): RequestHandler =>
            (req, res, next) => {
                if (!isOAuthEnabled(provider)) {
                    return next(new ApiError(501, `${provider} sign-in is not configured`, 'OAUTH_NOT_CONFIGURED'));
                }

                const expected: unknown = req.cookies?.[STATE_COOKIE];
                const received: unknown = req.query.state;
                res.clearCookie(STATE_COOKIE, stateCookieOptions);

                if (
                    typeof expected !== 'string' ||
                    typeof received !== 'string' ||
                    !safeEqual(expected, received)
                ) {
                    return redirectWithError(res, 'Invalid sign-in request, please try again');
                }

                passport.authenticate(
                    provider,
                    { session: false },
                    async (err: unknown, user?: UserDocument | false) => {
                        if (err) return redirectWithError(res, err instanceof ApiError ? err.message : 'Sign-in failed');
                        if (!user) return redirectWithError(res, 'Sign-in was cancelled or failed');

                        try {
                            const session = await authService.startSession(user);
                            setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
                            logger.info(`[ACTIVITY] USER_LOGIN_${provider.toUpperCase()} actor=${session.user.id} ip=${req.ip}`);
                            res.redirect(`${env.CLIENT_URL}/oauth/callback`);
                        } catch (error) {
                            next(error);
                        }
                    },
                )(req, res, next);
            },
};