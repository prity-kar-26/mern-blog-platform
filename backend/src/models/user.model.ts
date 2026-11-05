import { HydratedDocument, Schema, model } from 'mongoose';
import { ROLES, Role } from '../constants/roles';

export interface IUser {
    name: string;
    email: string;
    password?: string;
    role: Role;
    isActive: boolean;
    googleId?: string;
    facebookId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        // Optional because OAuth users have no password; never returned unless explicitly selected
        password: { type: String, select: false },
        role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, index: true },
        isActive: { type: Boolean, default: true },
        googleId: { type: String, unique: true, sparse: true },
        facebookId: { type: String, unique: true, sparse: true },
    },
    { timestamps: true, versionKey: false },
);

export const User = model<IUser>('User', userSchema);