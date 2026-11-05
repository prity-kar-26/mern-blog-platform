import { RequestHandler } from 'express';
import { tokenService } from '../services/token.service';
import { ApiError } from '../utils/ApiError';

export const authenticate: RequestHandler = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw ApiError.unauthorized('Authentication required');

    req.user = tokenService.verifyAccessToken(header.slice(7));
    next();
};