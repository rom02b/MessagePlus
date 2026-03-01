import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Campaign, CampaignConfig, InputMethod, Confession, Tone, ContentOptions } from '../types/campaign';

const DEFAULT_CONTENT_OPTIONS: ContentOptions = {
    useEmojis: false,
    messageLength: 'medium',
    includeReflectionQuestion: true,
    includeHashtags: true,
};

interface CampaignContextType {
    // Input state
    inputMethod: InputMethod;
    setInputMethod: (method: InputMethod) => void;
    sourceContent: string;
    setSourceContent: (content: string) => void;

    // Configuration state
    confession: Confession;
    setConfession: (confession: Confession) => void;
    duration: number;
    setDuration: (duration: number) => void;
    tone: Tone;
    setTone: (tone: Tone) => void;
    contentOptions: ContentOptions;
    setContentOptions: (options: ContentOptions) => void;

    // Metadata
    messageTitle: string;
    setMessageTitle: (title: string) => void;
    speakerName: string;
    setSpeakerName: (name: string) => void;
    userEmail: string;
    setUserEmail: (email: string) => void;

    // Generated campaign
    campaign: Campaign | null;
    setCampaign: (campaign: Campaign | null) => void;

    // UI state
    currentStep: number;
    setCurrentStep: (step: number) => void;
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;

    // Actions
    resetCampaign: () => void;
    getConfig: () => CampaignConfig;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const useCampaign = () => {
    const context = useContext(CampaignContext);
    if (!context) {
        throw new Error('useCampaign must be used within CampaignProvider');
    }
    return context;
};

interface CampaignProviderProps {
    children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
    // Input state
    const [inputMethod, setInputMethod] = useState<InputMethod>('youtube');
    const [sourceContent, setSourceContent] = useState('');

    // Configuration state
    const [confession, setConfession] = useState<Confession>('protestant');
    const [duration, setDuration] = useState(3);
    const [tone, setTone] = useState<Tone>('warm-encouraging');
    const [contentOptions, setContentOptions] = useState<ContentOptions>(DEFAULT_CONTENT_OPTIONS);

    // Metadata
    const [messageTitle, setMessageTitle] = useState('');
    const [speakerName, setSpeakerName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Generated campaign
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    // UI state
    const [currentStep, setCurrentStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetCampaign = () => {
        setSourceContent('');
        setCampaign(null);
        setCurrentStep(1);
        setError(null);
    };

    const getConfig = (): CampaignConfig => ({
        inputMethod,
        sourceContent,
        confession,
        duration,
        tone,
        contentOptions,
        messageTitle,
        speakerName,
        userEmail,
    });

    const value: CampaignContextType = {
        inputMethod,
        setInputMethod,
        sourceContent,
        setSourceContent,
        confession,
        setConfession,
        duration,
        setDuration,
        tone,
        setTone,
        contentOptions,
        setContentOptions,
        campaign,
        setCampaign,
        currentStep,
        setCurrentStep,
        isGenerating,
        setIsGenerating,
        error,
        setError,
        resetCampaign,
        getConfig,
        messageTitle,
        setMessageTitle,
        speakerName,
        setSpeakerName,
        userEmail,
        setUserEmail,
    };

    return (
        <CampaignContext.Provider value={value}>
            {children}
        </CampaignContext.Provider>
    );
};
