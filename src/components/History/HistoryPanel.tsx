import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './HistoryPanel.css';

interface SavedCampaign {
    id: string;
    title: string | null;
    confession: string;
    duration: number;
    tone: string;
    days: unknown;
    content_options: unknown;
    speaker_name: string | null;
    quotes?: string[];
    created_at: string;
}

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onReload: (campaign: SavedCampaign) => void;
}

const TONE_LABELS: Record<string, string> = {
    'warm-encouraging': 'Chaleureux',
    reflective: 'Réflexif',
    challenging: 'Interpellant',
    pastoral: 'Pastoral',
    contemplative: 'Méditatif',
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onReload }) => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !user) return;
        fetchCampaigns();
    }, [isOpen, user]);

    const fetchCampaigns = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('campaigns')
            .select('id, title, confession, duration, tone, days, content_options, speaker_name, quotes, created_at')
            .order('created_at', { ascending: false })
            .limit(20);
        setCampaigns(data ?? []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await supabase.from('campaigns').delete().eq('id', id);
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
    };

    const handleReload = (c: SavedCampaign) => {
        onClose();
        onReload(c);
    };

    if (!isOpen) return null;

    return (
        <div className="history-overlay" onClick={onClose}>
            <div className="history-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="history-drawer-header">
                    <h2>Historique des parcours</h2>
                    <button className="history-close-btn" onClick={onClose} aria-label="Fermer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="history-drawer-content">
                    {loading ? (
                        <div className="history-loading">
                            <span className="history-spinner" />
                            Chargement de vos parcours…
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="history-empty">
                            Vous n'avez généré aucun parcours pour le moment.
                        </div>
                    ) : (
                        <div className="history-list">
                            {campaigns.map((c) => (
                                <div key={c.id} className="history-item">
                                    <button className="history-item-main" onClick={() => handleReload(c)}>
                                        <div className="history-item-info">
                                            <span className="history-item-title">
                                                {c.title || 'Parcours sans titre'}
                                            </span>
                                            <span className="history-item-meta">
                                                {c.duration} jours · {TONE_LABELS[c.tone] || c.tone} ·{' '}
                                                {c.confession === 'protestant' ? 'Protestant' : 'Catholique'}
                                            </span>
                                        </div>
                                        <span className="history-item-date">
                                            {new Date(c.created_at).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                            })}
                                        </span>
                                    </button>
                                    <button
                                        className="history-delete-btn"
                                        onClick={() => handleDelete(c.id)}
                                        disabled={deletingId === c.id}
                                        title="Supprimer ce parcours"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <path d="M10 11v6M14 11v6" />
                                            <path d="M9 6V4h6v2" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPanel;
export type { SavedCampaign };
