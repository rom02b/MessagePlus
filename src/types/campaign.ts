export type InputMethod = 'youtube' | 'text';

export type Confession = 'protestant' | 'catholic';

export type Tone =
  | 'warm-encouraging'
  | 'reflective'
  | 'challenging'
  | 'pastoral'
  | 'contemplative';

export interface DayContent {
  day: number;
  theme: string;
  verse: {
    reference: string;
    text: string;
  };
  whatsapp: string;
  email: {
    subject: string;
    body: string;
  };
  social: string;
}

export interface Campaign {
  id: string;
  inputMethod: InputMethod;
  sourceContent: string; // YouTube URL or text
  confession: Confession;
  duration: number; // 2-6 days
  tone: Tone;
  messageTitle?: string; // Title of the sermon/message
  speakerName?: string; // Name of the preacher/speaker
  userEmail?: string; // Optional email for receiving the campaign
  days: DayContent[];
  createdAt: Date;
}

export interface CampaignConfig {
  inputMethod: InputMethod;
  sourceContent: string;
  confession: Confession;
  duration: number;
  tone: Tone;
  messageTitle?: string;
  speakerName?: string;
  userEmail?: string;
}
