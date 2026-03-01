import React, { useState } from 'react';
import type { DayContent } from '../../types/campaign';
import './DayCard.css';

interface DayCardProps {
    dayContent: DayContent;
}

type Platform = 'whatsapp' | 'email' | 'social';

const DayCard: React.FC<DayCardProps> = ({ dayContent }) => {
    const [activePlatform, setActivePlatform] = useState<Platform>('whatsapp');
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        let textToCopy = '';

        switch (activePlatform) {
            case 'whatsapp':
                textToCopy = dayContent.whatsapp;
                break;
            case 'email':
                textToCopy = `${dayContent.email.subject}\n\n${dayContent.email.body}`;
                break;
            case 'social':
                textToCopy = dayContent.social;
                break;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const renderContent = () => {
        switch (activePlatform) {
            case 'whatsapp':
                return <pre className="content-text">{dayContent.whatsapp}</pre>;
            case 'email':
                return (
                    <div className="email-content">
                        <div className="email-subject">
                            <strong>Sujet</strong> {dayContent.email.subject}
                        </div>
                        <div className="email-body" dangerouslySetInnerHTML={{ __html: dayContent.email.body }} />
                    </div>
                );
            case 'social':
                return <pre className="content-text">{dayContent.social}</pre>;
        }
    };

    return (
        <div className="day-card">
            <div className="day-card-header">
                <div>
                    <div className="day-badge">
                        <span className="day-number-pill">Jour {dayContent.day}</span>
                    </div>
                    <h3 className="day-title">{dayContent.theme}</h3>
                </div>
                <div className="day-verse">
                    <svg className="verse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <div>
                        <div className="verse-reference">{dayContent.verse.reference}</div>
                        <div className="verse-text">«{dayContent.verse.text}»</div>
                    </div>
                </div>
            </div>

            <div className="platform-tabs">
                <button
                    className={`platform-tab ${activePlatform === 'whatsapp' ? 'active' : ''}`}
                    onClick={() => setActivePlatform('whatsapp')}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                </button>
                <button
                    className={`platform-tab ${activePlatform === 'email' ? 'active' : ''}`}
                    onClick={() => setActivePlatform('email')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Email
                </button>
                <button
                    className={`platform-tab ${activePlatform === 'social' ? 'active' : ''}`}
                    onClick={() => setActivePlatform('social')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    Réseaux
                </button>
            </div>

            <div className="platform-content">
                {renderContent()}
            </div>

            <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
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
                        Copier le contenu
                    </>
                )}
            </button>
        </div>
    );
};

export default DayCard;
