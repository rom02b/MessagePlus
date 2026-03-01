import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
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
    );
};

export default Header;
