import React, { useState } from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import './EmailInput.css';

const EmailInput: React.FC = () => {
    const { userEmail, setUserEmail } = useCampaign();
    const [localError, setLocalError] = useState('');

    const validateEmail = (email: string): boolean => {
        if (!email) return true; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserEmail(value);
        setLocalError('');
    };

    const handleBlur = () => {
        if (userEmail && !validateEmail(userEmail)) {
            setLocalError('Adresse email invalide');
        }
    };

    return (
        <div className="email-input">
            <label htmlFor="user-email">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
                Votre email (optionnel)
            </label>
            <input
                id="user-email"
                type="email"
                value={userEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="votre.email@exemple.com"
                className={localError ? 'error' : ''}
            />
            {localError && <p className="form-error">{localError}</p>}
            <p className="input-hint">
                Pour recevoir une copie du parcours généré
            </p>
        </div>
    );
};

export default EmailInput;
