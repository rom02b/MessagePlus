import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authClient } from '../../lib/auth-client';
import type { SavedCampaign } from '../History/HistoryPanel';
import './Sidebar.css';

interface SidebarProps {
    onReload: (campaign: SavedCampaign) => void;
    onNewCampaign: () => void;
    isOpen: boolean;
    onToggle: () => void;
}

const TONE_LABELS: Record<string, string> = {
    'warm-encouraging': 'Chaleureux',
    reflective: 'Réflexif',
    challenging: 'Interpellant',
    pastoral: 'Pastoral',
    contemplative: 'Méditatif',
};

const Sidebar: React.FC<SidebarProps> = ({ onReload, onNewCampaign, isOpen, onToggle }) => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile breakpoint
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        setIsMobile(mq.matches);
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, []);

    // Fetch campaigns when user is connected and sidebar opens
    useEffect(() => {
        if (!user) return;
        fetchCampaigns();
    }, [user]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const { data } = await authClient.getSession();
            const token = data?.session?.token;

            const response = await fetch('/api/campaigns', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                credentials: 'omit',
            });

            if (response.ok) {
                const result = await response.json();
                setCampaigns(result.campaigns ?? []);
            } else {
                setCampaigns([]);
            }
        } catch {
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeletingId(id);
        try {
            const { data } = await authClient.getSession();
            const token = data?.session?.token;

            await fetch(`/api/campaigns?id=${id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                credentials: 'omit',
            });
            setCampaigns((prev) => prev.filter((c) => c.id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    const handleItemClick = (campaign: SavedCampaign) => {
        onReload(campaign);
        // On mobile, close the drawer after selecting
        if (isMobile) {
            onToggle();
        }
    };

    // Do not render anything if user is not connected
    if (!user) return null;

    return (
        <>
            {/* Backdrop for mobile drawer */}
            {isMobile && isOpen && (
                <div className="sidebar-backdrop" onClick={onToggle} />
            )}

            {/* Hamburger button when sidebar is collapsed */}
            {!isOpen && (
                <button
                    className="sidebar-open-btn"
                    onClick={onToggle}
                    title="Ouvrir l'historique"
                    aria-label="Ouvrir la barre latérale"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            )}

            <aside className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
                <div className="sidebar-inner">
                    {/* Header */}
                    <div className="sidebar-header">
                        <button
                            className="sidebar-new-btn"
                            onClick={onNewCampaign}
                            title="Nouveau parcours"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            <span>Nouveau parcours</span>
                        </button>

                        <button
                            className="sidebar-collapse-btn"
                            onClick={onToggle}
                            title="Fermer l'historique"
                            aria-label="Fermer la barre latérale"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="sidebar-content">
                        <div className="sidebar-section-title">Vos parcours</div>

                        {loading ? (
                            <div className="sidebar-loading">Chargement…</div>
                        ) : campaigns.length === 0 ? (
                            <div className="sidebar-empty">
                                Aucun parcours généré pour l'instant.
                            </div>
                        ) : (
                            <div className="sidebar-list">
                                {campaigns.map((c) => (
                                    <div
                                        key={c.id}
                                        className="sidebar-item"
                                        onClick={() => handleItemClick(c)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && handleItemClick(c)}
                                    >
                                        <div className="sidebar-item-content">
                                            <div className="sidebar-item-title">
                                                {c.title || 'Parcours sans titre'}
                                            </div>
                                            <div className="sidebar-item-meta">
                                                {new Date(c.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                })}
                                                {' · '}{c.duration}j{' · '}
                                                {TONE_LABELS[c.tone] || c.tone}
                                            </div>
                                        </div>

                                        <button
                                            className="sidebar-item-delete"
                                            onClick={(e) => handleDelete(e, c.id)}
                                            disabled={deletingId === c.id}
                                            title="Supprimer"
                                            aria-label="Supprimer ce parcours"
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
            </aside>
        </>
    );
};

export default Sidebar;
