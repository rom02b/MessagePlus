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
        <div className="confession-selector form-group" style={{ marginBottom: 0 }}>
            <label className="section-label" htmlFor="confession-select">Confession</label>
            <select
                id="confession-select"
                value={confession}
                onChange={(e) => setConfession(e.target.value as Confession)}
                style={{ width: '100%', cursor: 'pointer', appearance: 'auto' }}
            >
                {confessions.map((conf) => (
                    <option key={conf.value} value={conf.value}>
                        {conf.label} - {conf.description}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ConfessionSelector;
