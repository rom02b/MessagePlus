import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';
import './Header.css';

interface HeaderProps {
    onOpenHistory?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenHistory }) => {
    const { user, signOut, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const initials = user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : '';

    const shortEmail = user?.email
        ? user.email.length > 22 ? user.email.slice(0, 22) + '…' : user.email
        : '';

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header-inner">
                        <div className="header-brand">
                            <div className="header-logo">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <span className="header-wordmark">Message<span>+</span></span>
                        </div>

                        {/* Auth zone */}
                        {!loading && (
                            <div className="header-auth">
                                {user ? (
                                    <>
                                        {onOpenHistory && (
                                            <button className="header-history-btn" onClick={onOpenHistory} title="Ouvrir l'historique">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <span className="hide-mobile">Historique</span>
                                            </button>
                                        )}
                                        <div className="user-pill">
                                            <div className="user-avatar">{initials}</div>
                                            <span className="user-email">{shortEmail}</span>
                                            <button className="user-signout" onClick={signOut} title="Se déconnecter">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                    <polyline points="16 17 21 12 16 7" />
                                                    <line x1="21" y1="12" x2="9" y2="12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-secondary header-login-btn"
                                        onClick={() => setShowAuthModal(true)}
                                    >
                                        Connexion
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="header-tagline-block">
                        <h1>
                            Transformez{' '}
                            <span className="accent-word">vos prédications</span>
                            <br />
                            en parcours d'engagement
                        </h1>
                        <p>Générez des contenus WhatsApp, Email et Réseaux sociaux à partir de votre message en quelques secondes.</p>
                    </div>
                </div>
            </header>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </>
    );
};

export default Header;
