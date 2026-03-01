import type { Campaign, CampaignConfig, DayContent } from '../types/campaign';

/**
 * Generate a campaign by calling the Vercel Serverless Function /api/generate.
 * The Gemini API key lives only on the server — never in this file.
 */
export const generateCampaign = async (config: CampaignConfig): Promise<Campaign> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    let message = 'La génération a échoué. Veuillez réessayer.';
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const { days } = await response.json() as { days: DayContent[] };

  return {
    id: crypto.randomUUID(),
    inputMethod: config.inputMethod,
    sourceContent: config.sourceContent,
    confession: config.confession,
    duration: config.duration,
    tone: config.tone,
    contentOptions: config.contentOptions,
    messageTitle: config.messageTitle,
    speakerName: config.speakerName,
    userEmail: config.userEmail,
    days,
    createdAt: new Date(),
  };
};

// Kept for potential future use
export const extractThemes = async (_content: string): Promise<string[]> => {
  return [];
};

export const extractVerses = async (_content: string): Promise<string[]> => {
  return [];
};
