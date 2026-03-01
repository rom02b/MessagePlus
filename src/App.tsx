import React from 'react';
import { CampaignProvider, useCampaign } from './contexts/CampaignContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Container from './components/Layout/Container';
import Stepper from './components/Stepper/Stepper';
import InputToggle from './components/Input/InputToggle';
import YouTubeInput from './components/Input/YouTubeInput';
import TextInput from './components/Input/TextInput';
import ConfessionSelector from './components/Configuration/ConfessionSelector';
import DurationSlider from './components/Configuration/DurationSlider';
import ToneSelector from './components/Configuration/ToneSelector';
import ContentOptionsSelector from './components/Configuration/ContentOptions';
import MetadataInputs from './components/Configuration/MetadataInputs';
import EmailInput from './components/Configuration/EmailInput';
import DayCard from './components/Results/DayCard';
import HistoryPanel from './components/History/HistoryPanel';
import type { SavedCampaign } from './components/History/HistoryPanel';
import QuotesCard from './components/Results/QuotesCard';
import ShareCard from './components/Results/ShareCard';
import { generateCampaign } from './services/aiService';
import { getTranscript, isValidYouTubeUrl } from './services/youtubeService';
import { supabase } from './lib/supabase';
import './App.css';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const {
    inputMethod,
    sourceContent,
    currentStep,
    setCurrentStep,
    campaign,
    setCampaign,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    getConfig,
    resetCampaign,
    userEmail,
  } = useCampaign();

  const [savedCampaignId, setSavedCampaignId] = React.useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  // Handle ?share=ID in URL — load shared campaign on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    if (!shareId) return;

    fetch(`/api/share?id=${shareId}`)
      .then((r) => r.json())
      .then(({ campaign: c }) => {
        if (!c) return;
        setCampaign({
          id: c.id,
          inputMethod: 'text',
          sourceContent: '',
          confession: c.confession,
          duration: c.duration,
          tone: c.tone,
          contentOptions: c.content_options,
          messageTitle: c.title ?? undefined,
          speakerName: c.speaker_name ?? undefined,
          days: c.days,
          quotes: c.quotes ?? [],
          createdAt: new Date(c.created_at),
        });
        setSavedCampaignId(c.id);
        setCurrentStep(3);
        // Clean URL without reload
        window.history.replaceState({}, '', window.location.pathname);
      })
      .catch(() => { });
  }, []);

  const canProceedFromStep1 = () => {
    if (!sourceContent) return false;
    if (inputMethod === 'youtube') {
      return isValidYouTubeUrl(sourceContent);
    }
    return sourceContent.length >= 100;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && canProceedFromStep1()) {
      setCurrentStep(2);
      setError(null);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const config = getConfig();

      // If YouTube, fetch transcript first
      let contentToProcess = config.sourceContent;
      if (config.inputMethod === 'youtube') {
        contentToProcess = await getTranscript(config.sourceContent);
      }

      // Generate campaign via /api/generate
      const generatedCampaign = await generateCampaign({
        ...config,
        sourceContent: contentToProcess,
      });

      setCampaign(generatedCampaign);

      // Save to Supabase if user is logged in
      if (user) {
        const { data: saved } = await supabase.from('campaigns').insert({
          user_id: user.id,
          title: config.messageTitle || null,
          speaker_name: config.speakerName || null,
          confession: config.confession,
          duration: config.duration,
          tone: config.tone,
          content_options: config.contentOptions,
          days: generatedCampaign.days,
          quotes: generatedCampaign.quotes,
        }).select('id').single();
        if (saved?.id) setSavedCampaignId(saved.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewCampaign = () => {
    resetCampaign();
  };

  // Reload a saved campaign from history
  const handleReloadFromHistory = (saved: SavedCampaign) => {
    const reloaded = {
      id: saved.id,
      inputMethod: 'text' as const,
      sourceContent: '',
      confession: saved.confession as 'protestant' | 'catholic',
      duration: saved.duration,
      tone: saved.tone as 'warm-encouraging' | 'reflective' | 'challenging' | 'pastoral' | 'contemplative',
      contentOptions: saved.content_options as import('./types/campaign').ContentOptions,
      messageTitle: saved.title ?? undefined,
      speakerName: saved.speaker_name ?? undefined,
      days: saved.days as import('./types/campaign').DayContent[],
      quotes: (saved as unknown as { quotes?: string[] }).quotes ?? [],
      createdAt: new Date(saved.created_at),
    };
    setCampaign(reloaded);
    setCurrentStep(3);
  };

  return (
    <div className="app">
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />

      {/* History Side Panel Drawer */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onReload={handleReloadFromHistory}
      />

      <Container>
        <Stepper />

        {/* STEP 1: Source + Confession */}
        {currentStep === 1 && (
          <div className="step-content fade-in">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Source de la prédication</h2>
                <p className="card-subtitle">Importez votre message depuis YouTube ou collez le texte directement</p>
              </div>
              <div className="card-body">
                <InputToggle />
                {inputMethod === 'youtube' ? <YouTubeInput /> : <TextInput />}

                <div className="section-divider" />

                <ConfessionSelector />

                {error && (
                  <div className="error-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="step-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleNextStep}
                    disabled={!canProceedFromStep1()}
                  >
                    Continuer
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Configuration + Metadata */}
        {currentStep === 2 && (
          <div className="step-content fade-in">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Configuration du parcours</h2>
                <p className="card-subtitle">Personnalisez la durée, le ton et ajoutez des informations complémentaires</p>
              </div>
              <div className="card-body">
                <DurationSlider />
                <ToneSelector />

                <div className="section-divider" />

                <ContentOptionsSelector />

                <div className="section-divider" />

                <h3 className="section-heading">Informations complémentaires</h3>
                <MetadataInputs />

                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={handlePreviousStep}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Retour
                  </button>
                  <button className="btn btn-primary" onClick={handleNextStep}>
                    Continuer
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Email + Generation */}
        {currentStep === 3 && !campaign && (
          <div className="step-content fade-in">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Génération du parcours</h2>
                <p className="card-subtitle">Vérifiez les paramètres et lancez la génération</p>
              </div>
              <div className="card-body">
                <div className="generation-summary">
                  <h3>Récapitulatif</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Source</span>
                      <span className="summary-value">
                        {inputMethod === 'youtube' ? 'Vidéo YouTube' : 'Texte'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Durée</span>
                      <span className="summary-value">{getConfig().duration} jours</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Confession</span>
                      <span className="summary-value">
                        {getConfig().confession === 'protestant' ? 'Protestant' : 'Catholique'}
                      </span>
                    </div>
                    {getConfig().messageTitle && (
                      <div className="summary-item">
                        <span className="summary-label">Titre</span>
                        <span className="summary-value">{getConfig().messageTitle}</span>
                      </div>
                    )}
                    {getConfig().speakerName && (
                      <div className="summary-item">
                        <span className="summary-label">Orateur</span>
                        <span className="summary-value">{getConfig().speakerName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="section-divider" />

                <EmailInput />

                {error && (
                  <div className="error-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={handlePreviousStep} disabled={isGenerating}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Retour
                  </button>
                  <button
                    className="btn btn-primary btn-generate"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="spinner" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Générer le parcours
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {campaign && (
          <div className="results-section fade-in">
            <div className="results-header">
              <h2>Votre parcours Message+ est prêt ! 🎉</h2>
              <p>Voici les {campaign.days.length} jours de contenu généré pour votre communauté.</p>
              {userEmail && (
                <p className="email-sent-notice">
                  📧 Une copie a été envoyée à {userEmail}
                </p>
              )}
            </div>

            {campaign.days.map((day) => (
              <DayCard key={day.day} dayContent={day} />
            ))}

            {/* Bonus: quotes card */}
            {campaign.quotes && campaign.quotes.length > 0 && (
              <QuotesCard quotes={campaign.quotes} />
            )}

            {/* Bonus: share link (only when saved in Supabase) */}
            {savedCampaignId && (
              <ShareCard campaignId={savedCampaignId} />
            )}

            <div className="results-actions">
              <button className="btn btn-primary" onClick={handleNewCampaign}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Créer un nouveau parcours
              </button>
            </div>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CampaignProvider>
        <AppContent />
      </CampaignProvider>
    </AuthProvider>
  );
};

export default App;
