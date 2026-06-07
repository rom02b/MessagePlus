import React, { useState } from 'react';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user } = useAuth();

    const getInitials = (email: string, name?: string | null) => {
        if (name) return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        return email.slice(0, 2).toUpperCase();
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-top">
                    <div className="logo-container">
                        <div className="logo-box">
                            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
                            </svg>
                        </div>
                        <h1 className="header-title">Message<span>+</span></h1>
                    </div>
                    {user ? (
                        <a href="/profile" className="profile-avatar-btn" title={user.email}>
                            {getInitials(user.email, user.name)}
                        </a>
                    ) : (
                        <button className="btn btn-outline btn-login" onClick={() => setIsAuthModalOpen(true)}>
                            Connexion
                        </button>
                    )}
                </div>
                <div className="header-hero">
                    <h2 className="hero-title">Transformez <span>vos prédications</span><br/>en parcours d'engagement</h2>
                    <p className="header-subtitle">Générez des contenus WhatsApp, Email et Réseaux sociaux à partir de votre message en quelques secondes.</p>
                </div>
            </div>
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </header>
    );
};

export default Header;
