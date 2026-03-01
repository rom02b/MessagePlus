import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
    <footer className="footer">
        <div className="container">
            <p className="footer-text">
                Développé avec ❤️ par{' '}
                <a
                    href="https://www.mieuxparlerdejesus.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                >
                    BARNABAS – Agence de communication chrétienne
                </a>
            </p>
        </div>
    </footer>
);

export default Footer;
