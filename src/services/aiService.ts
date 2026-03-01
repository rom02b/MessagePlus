import type { Campaign, CampaignConfig, DayContent } from '../types/campaign';
import { supabase } from '../lib/supabase';

/**
 * Generate a campaign by calling the Vercel Serverless Function /api/generate.
 * The Gemini API key lives only on the server — never in this file.
 */
export const generateCampaign = async (config: CampaignConfig): Promise<Campaign> => {
  // Get current session token to authenticate the request
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers,
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

  const { days, quotes } = await response.json() as { days: DayContent[]; quotes: string[] };

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
    quotes: quotes ?? [],
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
