import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, signOut } = useAuth();
    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
        window.location.replace('/');
    };

    const getInitials = (email: string, name?: string | null) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return email.slice(0, 2).toUpperCase();
    };

    const getDisplayName = () => {
        if (user?.name) return user.name;
        if (user?.email) return user.email.split('@')[0];
        return 'Utilisateur';
    };

    if (!user) {
        window.location.replace('/');
        return null;
    }

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="profile-header-bar">
                <a href="/" className="profile-back-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Message+
                </a>
            </div>

            <div className="profile-content">
                {/* Avatar & Identity */}
                <div className="profile-hero">
                    <div className="profile-avatar-large">
                        {getInitials(user.email, user.name)}
                    </div>
                    <h1 className="profile-name">{getDisplayName()}</h1>
                    <p className="profile-email">{user.email}</p>
                    <div className="profile-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Compte vérifié
                    </div>
                </div>

                {/* Info Card */}
                <div className="profile-card">
                    <div className="profile-card-title">Informations du compte</div>

                    <div className="profile-field">
                        <span className="profile-field-label">Email</span>
                        <span className="profile-field-value">{user.email}</span>
                    </div>

                    {user.name && (
                        <div className="profile-field">
                            <span className="profile-field-label">Nom</span>
                            <span className="profile-field-value">{user.name}</span>
                        </div>
                    )}

                    <div className="profile-field">
                        <span className="profile-field-label">Identifiant</span>
                        <span className="profile-field-value profile-id">{user.id}</span>
                    </div>

                    <div className="profile-field">
                        <span className="profile-field-label">Méthode de connexion</span>
                        <span className="profile-field-value">
                            <span className="profile-method-badge">
                                ✉️ Magic Link
                            </span>
                        </span>
                    </div>
                </div>

                {/* Actions Card */}
                <div className="profile-card">
                    <div className="profile-card-title">Actions</div>

                    <a href="/" className="profile-action-btn profile-action-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Générer un parcours
                    </a>

                    <button
                        className="profile-action-btn profile-action-danger"
                        onClick={handleSignOut}
                        disabled={signingOut}
                    >
                        {signingOut ? (
                            <>
                                <span className="profile-spinner" />
                                Déconnexion…
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Se déconnecter
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
