import React from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import type { MessageLength } from '../../types/campaign';
import './ContentOptions.css';

const ContentOptionsSelector: React.FC = () => {
    const { contentOptions, setContentOptions } = useCampaign();

    const toggle = (key: 'useEmojis' | 'includeReflectionQuestion' | 'includeHashtags') => {
        setContentOptions({ ...contentOptions, [key]: !contentOptions[key] });
    };

    const setLength = (length: MessageLength) => {
        setContentOptions({ ...contentOptions, messageLength: length });
    };

    const lengths: { value: MessageLength; label: string; desc: string }[] = [
        { value: 'short', label: 'Court', desc: '~80 mots' },
        { value: 'medium', label: 'Moyen', desc: '~150 mots' },
        { value: 'long', label: 'Long', desc: '~250 mots' },
    ];

    const toggleOptions: {
        key: 'useEmojis' | 'includeReflectionQuestion' | 'includeHashtags';
        label: string;
        desc: string;
    }[] = [
            {
                key: 'useEmojis',
                label: 'Emojis',
                desc: 'Ajouter des emojis pour rendre les messages plus expressifs',
            },
            {
                key: 'includeReflectionQuestion',
                label: 'Question de réflexion',
                desc: 'Inclure une question pour encourager la méditation personnelle',
            },
            {
                key: 'includeHashtags',
                label: 'Hashtags (Réseaux)',
                desc: 'Ajouter des hashtags pour maximiser la portée sur les réseaux sociaux',
            },
        ];

    return (
        <div className="content-options">
            {/* Message length */}
            <div className="content-options-group">
                <span className="section-label">Longueur des messages</span>
                <div className="length-selector">
                    {lengths.map((l) => (
                        <button
                            key={l.value}
                            className={`length-btn ${contentOptions.messageLength === l.value ? 'selected' : ''}`}
                            onClick={() => setLength(l.value)}
                        >
                            <span className="length-label">{l.label}</span>
                            <span className="length-desc">{l.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggle options */}
            <div className="content-options-group">
                <span className="section-label">Options de contenu</span>
                <div className="toggle-options">
                    {toggleOptions.map((opt) => (
                        <div key={opt.key} className="toggle-row" onClick={() => toggle(opt.key)}>
                            <div className="toggle-text">
                                <span className="toggle-label">{opt.label}</span>
                                <span className="toggle-desc">{opt.desc}</span>
                            </div>
                            <button
                                className={`toggle-switch ${contentOptions[opt.key] ? 'on' : ''}`}
                                onClick={(e) => { e.stopPropagation(); toggle(opt.key); }}
                                aria-checked={contentOptions[opt.key]}
                                role="switch"
                            >
                                <span className="toggle-thumb" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContentOptionsSelector;
