import React, { useState } from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import { isValidYouTubeUrl } from '../../services/youtubeService';
import './YouTubeInput.css';

const YouTubeInput: React.FC = () => {
    const { sourceContent, setSourceContent, setError } = useCampaign();
    const [localError, setLocalError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSourceContent(value);
        setLocalError('');
        setError(null);
    };

    const handleBlur = () => {
        if (sourceContent && !isValidYouTubeUrl(sourceContent)) {
            setLocalError('URL YouTube invalide. Veuillez entrer un lien valide.');
        }
    };

    return (
        <div className="youtube-input">
            <label htmlFor="youtube-url" className="input-label">
                <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                URL de la vidéo YouTube
            </label>
            <input
                id="youtube-url"
                type="url"
                value={sourceContent}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://www.youtube.com/watch?v=..."
                className={localError ? 'error' : ''}
            />
            {localError && <p className="form-error">{localError}</p>}
            <p className="input-hint">
                Collez le lien d'une vidéo YouTube contenant votre prédication
            </p>
        </div>
    );
};

export default YouTubeInput;
