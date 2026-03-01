import React from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import './MetadataInputs.css';

const MetadataInputs: React.FC = () => {
    const {
        messageTitle,
        setMessageTitle,
        speakerName,
        setSpeakerName,
        userEmail,
        setUserEmail
    } = useCampaign();

    return (
        <div className="metadata-inputs">
            <div className="form-group">
                <label htmlFor="message-title">
                    Titre du message (optionnel)
                </label>
                <input
                    id="message-title"
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="Ex: La foi qui transforme"
                />
                <p className="input-hint">
                    Le titre de votre prédication ou homélie
                </p>
            </div>

            <div className="form-group">
                <label htmlFor="speaker-name">
                    Nom de l'orateur (optionnel)
                </label>
                <input
                    id="speaker-name"
                    type="text"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    placeholder="Ex: Pasteur Jean Dupont"
                />
                <p className="input-hint">
                    Le nom du pasteur ou prêtre
                </p>
            </div>
        </div>
    );
};

export default MetadataInputs;
