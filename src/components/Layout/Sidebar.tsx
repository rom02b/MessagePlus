import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { SavedCampaign } from '../History/HistoryPanel';
import './Sidebar.css';

interface SidebarProps {
    onReload: (campaign: SavedCampaign) => void;
    onNewCampaign: () => void;
}

const TONE_LABELS: Record<string, string> = {
    'warm-encouraging': 'Chaleureux',
    reflective: 'Réflexif',
    challenging: 'Interpellant',
    pastoral: 'Pastoral',
    contemplative: 'Méditatif',
};

const Sidebar: React.FC<SidebarProps> = ({ onReload, onNewCampaign }) => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        fetchCampaigns();
    }, [user, isCollapsed]); // Only re-fetch if expanded? Actually just on mount/user change.

    const fetchCampaigns = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('campaigns')
            .select('id, title, confession, duration, tone, days, content_options, speaker_name, created_at')
            .order('created_at', { ascending: false })
            .limit(30);
        setCampaigns(data ?? []);
        setLoading(false);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeletingId(id);
        await supabase.from('campaigns').delete().eq('id', id);
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
    };

    if (!user) return null;

    if (isCollapsed) {
        return (
            <div className="sidebar collapsed">
                <button
                    className="sidebar-toggle-btn icon-only"
                    onClick={() => setIsCollapsed(false)}
                    title="Ouvrir l'historique"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <aside className="sidebar expanded">
            <div className="sidebar-header">
                <button className="sidebar-new-btn" onClick={onNewCampaign}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span>Nouveau parcours</span>
                </button>
                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setIsCollapsed(true)}
                    title="Fermer l'historique"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                    </svg>
                </button>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-section-title">Vos parcours</div>

                {loading ? (
                    <div className="sidebar-loading">Chargement...</div>
                ) : campaigns.length === 0 ? (
                    <div className="sidebar-empty">Aucun parcours généré.</div>
                ) : (
                    <div className="sidebar-list">
                        {campaigns.map((c) => (
                            <div key={c.id} className="sidebar-item" onClick={() => onReload(c)}>
                                <div className="sidebar-item-content">
                                    <div className="sidebar-item-title">
                                        {c.title || 'Parcours sans titre'}
                                    </div>
                                    <div className="sidebar-item-meta">
                                        {new Date(c.created_at).toLocaleDateString()} · {c.duration}j · {TONE_LABELS[c.tone] || c.tone}
                                    </div>
                                </div>
                                <button
                                    className="sidebar-item-delete"
                                    onClick={(e) => handleDelete(e, c.id)}
                                    disabled={deletingId === c.id}
                                    title="Supprimer"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                        <path d="M10 11v6M14 11v6" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
