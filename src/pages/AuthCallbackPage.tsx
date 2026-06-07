import { useEffect } from 'react';
import { AuthCallback } from '@neondatabase/auth/react';
import { authClient } from '../lib/auth-client';

/**
 * Page de callback pour Neon Auth Magic Link.
 * Neon Auth redirige ici après que l'utilisateur a cliqué sur le lien dans son email.
 * Le composant AuthCallback finalise la session et redirige vers l'app.
 */
const AuthCallbackPage = () => {
    useEffect(() => {
        // AuthCallback gère automatiquement l'échange du token.
        // On s'assure qu'après redirection, la session est bien rechargée.
        const timer = setTimeout(() => {
            authClient.getSession().catch(() => null);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--bg-primary, #0a0a0a)',
            color: 'white',
            fontFamily: 'sans-serif',
            gap: '16px',
        }}>
            {/* AuthCallback gère le token dans l'URL et redirige vers / */}
            <AuthCallback redirectTo="/" />
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid rgba(231, 105, 55, 0.3)',
                    borderTopColor: '#e76937',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 16px',
                }} />
                <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
                    Connexion en cours…
                </p>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AuthCallbackPage;
