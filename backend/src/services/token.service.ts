import crypto from 'node:crypto';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../constants/roles';
import { AuthUser } from '../types/auth.types';
import { ApiError } from '../utils/ApiError';

type Expiry = SignOptions['expiresIn'];

export const tokenService = {
    signAccessToken(user: AuthUser): string {
        return jwt.sign({ role: user.role }, env.JWT_ACCESS_SECRET, {
            subject: user.id,
            expiresIn: env.JWT_ACCESS_EXPIRES_IN as Expiry,
        });
    },

    signRefreshToken(userId: string): { token: string; expiresAt: Date } {
        // jwtid keeps tokens unique even when issued within the same second
        const token = jwt.sign({}, env.JWT_REFRESH_SECRET, {
            subject: userId,
            jwtid: crypto.randomUUID(),
            expiresIn: env.JWT_REFRESH_EXPIRES_IN as Expiry,
        });
        const { exp } = jwt.decode(token) as JwtPayload;
        return { token, expiresAt: new Date((exp as number) * 1000) };
    },

    verifyAccessToken(token: string): AuthUser {
        try {
            const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
                algorithms: ['HS256'],
            }) as JwtPayload & { role: Role };
            return { id: payload.sub as string, role: payload.role };
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                // Dedicated code lets the frontend know it should call /auth/refresh
                throw new ApiError(401, 'Access token expired', 'TOKEN_EXPIRED');
            }
            throw ApiError.unauthorized('Invalid access token');
        }
    },

    verifyRefreshToken(token: string): string {
        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
            return (payload as JwtPayload).sub as string;
        } catch {
            throw ApiError.unauthorized('Invalid or expired refresh token');
        }
    },

    // Only the hash is stored, so a database leak does not expose usable tokens
    hash(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    },
};