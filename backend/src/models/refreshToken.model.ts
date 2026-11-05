import { Schema, Types, model } from 'mongoose';

export interface IRefreshToken {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        tokenHash: { type: String, required: true, unique: true },
        // TTL index: MongoDB deletes the document automatically once expiresAt passes
        expiresAt: { type: Date, required: true, index: { expires: 0 } },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);