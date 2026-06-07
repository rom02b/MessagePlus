import { useEffect, useState } from 'react';
import { authClient } from '../lib/auth-client';

type Status = 'loading' | 'success' | 'error';

/**
 * Page de callback pour Neon Auth Magic Link.
 * Neon Auth redirige ici avec un paramètre `neon_auth_session_verifier` dans l'URL.
 * On appelle authClient pour finaliser la session, puis on redirige vers l'app.
 */
const AuthCallbackPage = () => {
    const [status, setStatus] = useState<Status>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        let cancelled = false;

        const finalize = async () => {
            try {
                // L'URL ressemble à : /auth/callback?neon_auth_session_verifier=ml-xxx
                // Better Auth gère automatiquement le paramètre token/verifier
                // quand on appelle getSession() après la redirection.
                // On attend un peu que la lib traite l'URL courante.
                await new Promise(r => setTimeout(r, 300));

                // Appel pour déclencher la vérification du token dans l'URL
                const result = await (authClient as any).getSession();

                if (cancelled) return;

                if (result?.data?.session || result?.data?.user) {
                    setStatus('success');
                    // Session valide → on redirige vers le profil
                    setTimeout(() => {
                        window.location.replace('/profile');
                    }, 800);
                } else {
                    // Essai alternatif : laisser Better Auth gérer le callback URL
                    // via la méthode magicLink.verify si elle existe
                    const url = new URL(window.location.href);
                    const verifier = url.searchParams.get('neon_auth_session_verifier') ||
                        url.searchParams.get('token');

                    if (verifier) {
                        // Forcer une requête vers le endpoint de vérification
                        const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL;
                        const verifyUrl = `${neonAuthUrl}/sign-in/magic-link/verify?token=${encodeURIComponent(verifier)}&callbackURL=${encodeURIComponent(window.location.origin + '/profile')}`;

                        // Rediriger directement vers l'endpoint de vérification Neon
                        window.location.replace(verifyUrl);
                    } else {
                        setStatus('error');
                        setErrorMsg('Aucun token de vérification trouvé dans l\'URL.');
                    }
                }
            } catch (err: any) {
                if (cancelled) return;
                console.error('[AuthCallback] Error:', err);
                setStatus('error');
                setErrorMsg(err?.message || 'Erreur lors de la vérification du token.');
            }
        };

        finalize();
        return () => { cancelled = true; };
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#0a0a0a',
            color: 'white',
            fontFamily: 'sans-serif',
            gap: '16px',
        }}>
            {status === 'loading' && (
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
            )}

            {status === 'success' && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(34, 197, 94, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <p style={{ margin: 0, color: '#22c55e', fontSize: '16px', fontWeight: 600 }}>
                        Connexion réussie !
                    </p>
                    <p style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>
                        Redirection en cours…
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <p style={{ margin: 0, color: '#ef4444', fontSize: '16px', fontWeight: 600 }}>
                        Lien invalide ou expiré
                    </p>
                    <p style={{ margin: '8px 0 16px', color: '#666', fontSize: '13px' }}>
                        {errorMsg}
                    </p>
                    <a href="/" style={{
                        background: '#e76937',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                    }}>
                        Retour à l'accueil
                    </a>
                </div>
            )}

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
