import React from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import type { Tone } from '../../types/campaign';
import './ToneSelector.css';

const ToneSelector: React.FC = () => {
    const { tone, setTone } = useCampaign();

    const tones: { value: Tone; label: string; emoji: string }[] = [
        { value: 'warm-encouraging', label: 'Chaleureux et encourageant', emoji: '🤗' },
        { value: 'reflective', label: 'Réflexif et contemplatif', emoji: '🤔' },
        { value: 'challenging', label: 'Interpellant et motivant', emoji: '💪' },
        { value: 'pastoral', label: 'Pastoral et bienveillant', emoji: '🙏' },
        { value: 'contemplative', label: 'Méditatif et profond', emoji: '🕊️' },
    ];

    return (
        <div className="tone-selector">
            <label className="section-label">Tonalité du parcours</label>
            <div className="tone-grid">
                {tones.map((t) => (
                    <button
                        key={t.value}
                        className={`tone-card ${tone === t.value ? 'selected' : ''}`}
                        onClick={() => setTone(t.value)}
                    >
                        <span className="tone-emoji">{t.emoji}</span>
                        <span className="tone-label">{t.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ToneSelector;
