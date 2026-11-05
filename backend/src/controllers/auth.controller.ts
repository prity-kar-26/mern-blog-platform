import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';
import { REFRESH_COOKIE, clearRefreshCookie, setRefreshCookie } from '../utils/cookies';

const respondWithSession = (
    res: Response,
    session: Awaited<ReturnType<typeof authService.login>>,
    status = 200,
) => {
    setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
    res.locals.actorId = session.user.id;
    sendSuccess(res, { user: session.user, accessToken: session.accessToken }, status);
};

export const authController = {
    async register(req: Request, res: Response) {
        respondWithSession(res, await authService.register(req.body), 201);
    },

    async login(req: Request, res: Response) {
        respondWithSession(res, await authService.login(req.body));
    },

    async refresh(req: Request, res: Response) {
        const token: string | undefined = req.cookies?.[REFRESH_COOKIE];
        if (!token) throw ApiError.unauthorized('Refresh token missing');
        respondWithSession(res, await authService.refresh(token));
    },

    async logout(req: Request, res: Response) {
        const userId = await authService.logout(req.cookies?.[REFRESH_COOKIE]);
        res.locals.actorId = userId;
        clearRefreshCookie(res);
        sendSuccess(res, { message: 'Logged out successfully' });
    },

    async me(req: Request, res: Response) {
        sendSuccess(res, { user: await authService.getCurrentUser(req.user!.id) });
    },
};