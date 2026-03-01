import React from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import './DurationSlider.css';

const DurationSlider: React.FC = () => {
    const { duration, setDuration } = useCampaign();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(parseInt(e.target.value));
    };

    return (
        <div className="duration-slider">
            <div className="duration-header">
                <span className="section-label">Durée du parcours</span>
                <div>
                    <span className="duration-value">{duration}</span>
                    <span className="duration-sub">jours</span>
                </div>
            </div>
            <div className="slider-container">
                <input
                    type="range"
                    min="2"
                    max="6"
                    value={duration}
                    onChange={handleChange}
                    className="slider"
                />
                <div className="slider-labels">
                    {[2, 3, 4, 5, 6].map((day) => (
                        <span
                            key={day}
                            className={`slider-label ${duration === day ? 'active' : ''}`}
                            onClick={() => setDuration(day)}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DurationSlider;
