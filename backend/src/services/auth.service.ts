import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { ROLES } from '../constants/roles';
import { UserDocument } from '../models/user.model';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { toUserResponse, UserResponse } from '../utils/serializers';
import { tokenService } from './token.service';

export interface AuthSession {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
    refreshExpiresAt: Date;
}

// Compared against when the email is unknown so response time does not reveal which emails exist
const DUMMY_HASH = bcrypt.hashSync('timing-attack-guard', 10);

const issueSession = async (user: UserDocument): Promise<AuthSession> => {
    const accessToken = tokenService.signAccessToken({ id: user.id, role: user.role });
    const { token, expiresAt } = tokenService.signRefreshToken(user.id);

    await refreshTokenRepository.create({
        userId: user._id,
        tokenHash: tokenService.hash(token),
        expiresAt,
    });

    return {
        user: toUserResponse(user),
        accessToken,
        refreshToken: token,
        refreshExpiresAt: expiresAt,
    };
};

export const authService = {
    async register(input: { name: string; email: string; password: string }) {
        if (await userRepository.findByEmail(input.email)) {
            throw ApiError.conflict('Email is already registered');
        }

        const password = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
        const user = await userRepository.create({
            name: input.name,
            email: input.email,
            password,
            role: ROLES.USER,
        });

        return issueSession(user);
    },

    async login(input: { email: string; password: string }) {
        const user = await userRepository.findByEmailWithPassword(input.email);
        const passwordMatches = await bcrypt.compare(input.password, user?.password ?? DUMMY_HASH);

        if (!user || !user.password || !passwordMatches) {
            throw ApiError.unauthorized('Invalid email or password');
        }
        if (!user.isActive) throw ApiError.forbidden('Your account has been disabled');

        return issueSession(user);
    },

    async refresh(rawToken: string) {
        const userId = tokenService.verifyRefreshToken(rawToken);
        const consumed = await refreshTokenRepository.consumeByHash(tokenService.hash(rawToken));

        if (!consumed) {
            // A validly signed token that is no longer stored was already used: assume theft
            await refreshTokenRepository.deleteAllByUser(userId);
            throw ApiError.unauthorized('Refresh token reuse detected, please log in again');
        }

        const user = await userRepository.findById(userId);
        if (!user || !user.isActive) throw ApiError.unauthorized('User no longer exists or is disabled');

        return issueSession(user);
    },

    async logout(rawToken?: string): Promise<string | null> {
        if (!rawToken) return null;
        const deleted = await refreshTokenRepository.consumeByHash(tokenService.hash(rawToken));
        return deleted ? deleted.userId.toString() : null;
    },

    async getCurrentUser(userId: string) {
        const user = await userRepository.findById(userId);
        if (!user || !user.isActive) throw ApiError.unauthorized('User no longer exists or is disabled');
        return toUserResponse(user);
    },

    startSession: (user: UserDocument) => issueSession(user),
};