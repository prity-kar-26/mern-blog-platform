import { IUser, User } from '../models/user.model';
import { Role } from '../constants/roles';
import { OAuthProvider } from '../constants/oauth';

type CreateUserInput = Pick<IUser, 'name' | 'email'> &
    Partial<Pick<IUser, 'password' | 'role' | 'googleId' | 'facebookId'>>;

interface ListUsersOptions {
    page: number;
    limit: number;
    search?: string;
    role?: Role;
    isActive?: boolean;
}

// User input goes into a RegExp, so special characters must be escaped
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const userRepository = {
    findById: (id: string) => User.findById(id),
    findByEmail: (email: string) => User.findOne({ email }),
    findByEmailWithPassword: (email: string) => User.findOne({ email }).select('+password'),
    create: (data: CreateUserInput) => User.create(data),

    findByProviderId: (provider: OAuthProvider, providerId: string) =>
        User.findOne(provider === 'google' ? { googleId: providerId } : { facebookId: providerId }),

    linkProvider: (userId: string, provider: OAuthProvider, providerId: string) =>
        User.findByIdAndUpdate(
            userId,
            { $set: provider === 'google' ? { googleId: providerId } : { facebookId: providerId } },
            { new: true },
        ),

    async findPage({ page, limit, search, role, isActive }: ListUsersOptions) {
        const pattern = search ? new RegExp(escapeRegex(search), 'i') : null;
        const filter = {
            ...(role ? { role } : {}),
            ...(isActive !== undefined ? { isActive } : {}),
            ...(pattern ? { $or: [{ name: pattern }, { email: pattern }] } : {}),
        };

        const [items, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        return { items, total };
    },

    updateById: (id: string, changes: { role?: Role; isActive?: boolean }) =>
        User.findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true }),

    deleteById: (id: string) => User.deleteOne({ _id: id }),

    count: () => User.countDocuments(),
};