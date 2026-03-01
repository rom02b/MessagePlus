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
            <label className="section-label">
                Durée du parcours : <span className="duration-value">{duration} jours</span>
            </label>
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
