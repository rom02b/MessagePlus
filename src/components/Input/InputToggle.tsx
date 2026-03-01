import React from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import './InputToggle.css';

const InputToggle: React.FC = () => {
    const { inputMethod, setInputMethod } = useCampaign();

    return (
        <div className="input-toggle">
            <button
                className={`toggle-btn ${inputMethod === 'youtube' ? 'active' : ''}`}
                onClick={() => setInputMethod('youtube')}
            >
                <svg className="toggle-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Lien YouTube
            </button>
            <button
                className={`toggle-btn ${inputMethod === 'text' ? 'active' : ''}`}
                onClick={() => setInputMethod('text')}
            >
                <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
                Texte Long
            </button>
        </div>
    );
};

export default InputToggle;
