import { OAuthProvider } from '../constants/oauth';
import { ROLES } from '../constants/roles';
import { UserDocument } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';

interface OAuthProfile {
    provider: OAuthProvider;
    providerId: string;
    name: string;
    email?: string;
    emailVerified: boolean;
}

const assertActive = (user: UserDocument): UserDocument => {
    if (!user.isActive) throw ApiError.forbidden('Your account has been disabled');
    return user;
};

export const oauthService = {
    async findOrCreate(profile: OAuthProfile): Promise<UserDocument> {
        const linked = await userRepository.findByProviderId(profile.provider, profile.providerId);
        if (linked) return assertActive(linked);

        if (!profile.email || !profile.emailVerified) {
            throw ApiError.badRequest('Your account needs a verified email address to sign in');
        }
        const email = profile.email.toLowerCase();

        const existing = await userRepository.findByEmail(email);
        if (existing) {
            // Linking by email is only safe because the provider has verified ownership of the address
            const updated = await userRepository.linkProvider(existing.id, profile.provider, profile.providerId);
            return assertActive(updated ?? existing);
        }

        const trimmed = profile.name.trim().slice(0, 50);
        return userRepository.create({
            name: trimmed.length >= 2 ? trimmed : email.split('@')[0],
            email,
            role: ROLES.USER,
            ...(profile.provider === 'google'
                ? { googleId: profile.providerId }
                : { facebookId: profile.providerId }),
        });
    },
};