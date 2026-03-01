import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError(null);

        const { error } = await signIn(email.trim());
        setLoading(false);

        if (error) {
            setError(error);
        } else {
            setSent(true);
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

                <button className="auth-modal-close" onClick={onClose} aria-label="Fermer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {sent ? (
                    <div className="auth-success">
                        <div className="auth-success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="auth-title">Vérifiez votre email</h2>
                        <p className="auth-desc">
                            Un lien de connexion a été envoyé à <strong>{email}</strong>.<br />
                            Cliquez sur le lien pour accéder à votre espace.
                        </p>
                        <button className="btn btn-secondary auth-close-btn" onClick={onClose}>
                            Fermer
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="auth-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h2 className="auth-title">Connexion</h2>
                        <p className="auth-desc">
                            Entrez votre email pour recevoir un lien de connexion instantané — sans mot de passe.
                        </p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="auth-email">Email</label>
                                <input
                                    id="auth-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="pasteur@eglise.fr"
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <p className="form-error">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary auth-submit"
                                disabled={loading || !email.trim()}
                            >
                                {loading ? (
                                    <><span className="spinner" /> Envoi en cours…</>
                                ) : (
                                    'Recevoir mon lien de connexion'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
