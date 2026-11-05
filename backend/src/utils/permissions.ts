import { Types } from 'mongoose';
import { ROLES } from '../constants/roles';
import { AuthUser } from '../types/auth.types';
import { ApiError } from './ApiError';

export const assertCanModify = (ownerId: Types.ObjectId | string, user: AuthUser): void => {
    const isOwner = ownerId.toString() === user.id;
    if (!isOwner && user.role !== ROLES.ADMIN) {
        throw ApiError.forbidden('You can only modify your own content');
    }
};