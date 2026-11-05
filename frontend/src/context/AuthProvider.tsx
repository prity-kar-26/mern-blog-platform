import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { refreshSession, setSessionExpiredHandler, tokenStore } from '../api/client';
import type { AuthPayload, LoginInput, RegisterInput, User } from '../types';
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<AuthStatus>('loading');

    const clearSession = useCallback(() => {
        tokenStore.set(null);
        setUser(null);
        setStatus('unauthenticated');
        // Cached data (especially admin data) must not leak to the next user of this browser
        queryClient.clear();
    }, [queryClient]);

    const startSession = useCallback(({ user: nextUser, accessToken }: AuthPayload) => {
        tokenStore.set(accessToken);
        setUser(nextUser);
        setStatus('authenticated');
    }, []);

    // Restores the session on page load from the httpOnly refresh cookie
    useEffect(() => {
        let active = true;

        refreshSession()
            .then((payload) => {
                if (active) startSession(payload);
            })
            .catch(() => {
                if (active) setStatus('unauthenticated');
            });

        return () => {
            active = false;
        };
    }, [startSession]);

    useEffect(() => {
        setSessionExpiredHandler(clearSession);
        return () => setSessionExpiredHandler(null);
    }, [clearSession]);

    const login = useCallback(
        async (input: LoginInput) => startSession(await authApi.login(input)),
        [startSession],
    );

    const register = useCallback(
        async (input: RegisterInput) => startSession(await authApi.register(input)),
        [startSession],
    );

    const logout = useCallback(async () => {
        await authApi.logout().catch(() => undefined);
        clearSession();
    }, [clearSession]);

    const value = useMemo<AuthContextValue>(
        () => ({ user, status, isAdmin: user?.role === 'admin', login, register, logout }),
        [user, status, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}