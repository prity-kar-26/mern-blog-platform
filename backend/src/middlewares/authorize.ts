import { RequestHandler } from 'express';
import { Role } from '../constants/roles';
import { ApiError } from '../utils/ApiError';

export const authorize =
    (...allowedRoles: Role[]): RequestHandler =>
        (req, _res, next) => {
            if (!req.user) throw ApiError.unauthorized('Authentication required');
            if (!allowedRoles.includes(req.user.role)) {
                throw ApiError.forbidden('You do not have permission to perform this action');
            }
            next();
        };