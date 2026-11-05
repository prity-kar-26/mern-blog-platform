import { UserDocument } from '../models/user.model';

export const toUserResponse = (user: UserDocument) => ({
    id: user.id as string,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
});

export type UserResponse = ReturnType<typeof toUserResponse>;