import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { authClient } from '../lib/auth-client';

interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
}

interface AuthSession {
    token: string;
}

interface AuthContextType {
    user: AuthUser | null;
    session: AuthSession | null;
    loading: boolean;
    signIn: (email: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data, isPending } = authClient.useSession();

    const user = data?.user ? { id: data.user.id, email: data.user.email, name: data.user.name } : null;
    const session = data?.session ? { token: data.session.token } : null;
    const loading = isPending;

    const signIn = async (email: string): Promise<{ error: string | null }> => {
        try {
            // @ts-ignore
            const { error } = await authClient.signIn.magicLink({
                email,
                callbackURL: window.location.origin,
            });
            return { error: error?.message ?? null };
        } catch (err: any) {
            return { error: err?.message || 'Erreur de connexion' };
        }
    };

    const signOut = async () => {
        await authClient.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
