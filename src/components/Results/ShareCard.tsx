import React, { useState } from 'react';
import './ShareCard.css';

interface ShareCardProps {
    campaignId: string;
}

const ShareCard: React.FC<ShareCardProps> = ({ campaignId }) => {
    const shareUrl = `${window.location.origin}?share=${campaignId}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div className="share-card">
            <div className="share-card-inner">
                <div className="share-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                </div>
                <div className="share-text">
                    <h3 className="share-title">Partager avec vos équipes</h3>
                    <p className="share-desc">
                        Copiez ce lien et partagez-le à vos équipes. Ils pourront consulter
                        l'intégralité du parcours par jour, sans compte requis.
                    </p>
                </div>
            </div>

            <div className="share-url-row">
                <input
                    type="text"
                    className="share-url-input"
                    value={shareUrl}
                    readOnly
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                    className={`btn share-copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Copié !
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copier le lien
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShareCard;
