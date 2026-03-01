import React from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import './Stepper.css';

const Stepper: React.FC = () => {
    const { currentStep } = useCampaign();

    const steps = [
        { number: 1, label: 'Transcription' },
        { number: 2, label: 'Configuration' },
        { number: 3, label: 'Génération' },
    ];

    return (
        <div className="stepper">
            {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                    <div className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                        <div className="step-number">
                            {currentStep > step.number ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>
                        <div className="step-label">{step.label}</div>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`step-connector ${currentStep > step.number ? 'completed' : ''}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Stepper;
