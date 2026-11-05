import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { OAuthProvider } from '../constants/oauth';
import { oauthService } from '../services/oauth.service';
import { env } from './env';

interface ProfileLike {
    id: string;
    displayName: string;
    emails?: { value: string; verified?: boolean }[];
}

const callbackUrl = (provider: OAuthProvider) => `${env.API_URL}/api/v1/auth/${provider}/callback`;

export const isOAuthEnabled = (provider: OAuthProvider): boolean =>
    provider === 'google'
        ? Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
        : Boolean(env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET);

const resolveUser = async (
    provider: OAuthProvider,
    profile: ProfileLike,
    trustEmailByDefault: boolean,
): Promise<Express.User> => {
    const email = profile.emails?.[0];
    const user = await oauthService.findOrCreate({
        provider,
        providerId: profile.id,
        name: profile.displayName,
        email: email?.value,
        // Google states verification explicitly; Facebook only returns confirmed addresses
        emailVerified: email ? (email.verified ?? trustEmailByDefault) : false,
    });

    // Passport's user slot is typed for JWT claims; the callback controller reads the full document
    return user as unknown as Express.User;
};

if (isOAuthEnabled('google')) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: env.GOOGLE_CLIENT_ID!,
                clientSecret: env.GOOGLE_CLIENT_SECRET!,
                callbackURL: callbackUrl('google'),
            },
            (_accessToken, _refreshToken, profile, done) => {
                resolveUser('google', profile, false).then(
                    (user) => done(null, user),
                    (err: Error) => done(err),
                );
            },
        ),
    );
}

if (isOAuthEnabled('facebook')) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: env.FACEBOOK_APP_ID!,
                clientSecret: env.FACEBOOK_APP_SECRET!,
                callbackURL: callbackUrl('facebook'),
                profileFields: ['id', 'displayName', 'emails'],
            },
            (_accessToken, _refreshToken, profile, done) => {
                resolveUser('facebook', profile, true).then(
                    (user) => done(null, user),
                    (err: Error) => done(err),
                );
            },
        ),
    );
}

export default passport;