import React from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import type { Confession } from '../../types/campaign';
import './ConfessionSelector.css';

const ConfessionSelector: React.FC = () => {
    const { confession, setConfession } = useCampaign();

    const confessions: { value: Confession; label: string; description: string }[] = [
        {
            value: 'protestant',
            label: 'Protestant',
            description: 'Tonalité évangélique et biblique',
        },
        {
            value: 'catholic',
            label: 'Catholique',
            description: 'Tonalité liturgique et sacramentelle',
        },
    ];

    return (
        <div className="confession-selector">
            <label className="section-label">Confession</label>
            <div className="confession-options">
                {confessions.map((conf) => (
                    <button
                        key={conf.value}
                        className={`confession-card ${confession === conf.value ? 'selected' : ''}`}
                        onClick={() => setConfession(conf.value)}
                    >
                        <div className="confession-radio">
                            {confession === conf.value && (
                                <div className="radio-dot" />
                            )}
                        </div>
                        <div className="confession-content">
                            <h4 className="confession-label">{conf.label}</h4>
                            <p className="confession-description">{conf.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ConfessionSelector;
