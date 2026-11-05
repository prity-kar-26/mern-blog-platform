import { RequestHandler } from 'express';
import { logger } from '../config/logger';

export const activityLogger =
    (action: string): RequestHandler =>
        (req, res, next) => {
            // Runs after the response so the actor is known (login sets it in the controller) and failures are skipped
            res.on('finish', () => {
                if (res.statusCode >= 400) return;
                const actor = req.user?.id ?? res.locals.actorId ?? 'anonymous';
                logger.info(`[ACTIVITY] ${action} actor=${actor} ip=${req.ip} ${req.method} ${req.originalUrl}`);
            });
            next();
        };