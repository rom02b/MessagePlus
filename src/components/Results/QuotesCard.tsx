import React, { useState } from 'react';
import './QuotesCard.css';

interface QuotesCardProps {
    quotes: string[];
}

const QuotesCard: React.FC<QuotesCardProps> = ({ quotes }) => {
    const [copied, setCopied] = useState<number | null>(null);

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(`"${text}"`).then(() => {
            setCopied(idx);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    return (
        <div className="quotes-card">
            <div className="quotes-card-header">
                <div className="quotes-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                </div>
                <div>
                    <h3 className="quotes-title">Citations du message</h3>
                    <p className="quotes-subtitle">3 extraits forts à exploiter en visuel ou post supplémentaire</p>
                </div>
            </div>

            <div className="quotes-list">
                {quotes.map((quote, idx) => (
                    <div key={idx} className="quote-item">
                        <div className="quote-number">{idx + 1}</div>
                        <p className="quote-text">"{quote}"</p>
                        <button
                            className={`quote-copy-btn ${copied === idx ? 'copied' : ''}`}
                            onClick={() => handleCopy(quote, idx)}
                            title="Copier la citation"
                        >
                            {copied === idx ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuotesCard;
