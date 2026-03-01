import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <h1 className="header-title">Message+</h1>
                    <p className="header-subtitle">Transformez vos prédications en parcours d'engagement</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
