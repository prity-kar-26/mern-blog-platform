import { Types } from 'mongoose';
import { RefreshToken } from '../models/refreshToken.model';

interface CreateRefreshTokenInput {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
}

export const refreshTokenRepository = {
    create: (data: CreateRefreshTokenInput) => RefreshToken.create(data),
    // Atomic find-and-delete: two concurrent refreshes with the same token cannot both succeed
    consumeByHash: (tokenHash: string) => RefreshToken.findOneAndDelete({ tokenHash }),
    deleteAllByUser: (userId: string) => RefreshToken.deleteMany({ userId }),
};