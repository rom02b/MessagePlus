export type InputMethod = 'youtube' | 'text';

export type Confession = 'protestant' | 'catholic';

export type Tone =
  | 'warm-encouraging'
  | 'reflective'
  | 'challenging'
  | 'pastoral'
  | 'contemplative';

export type MessageLength = 'short' | 'medium' | 'long';

export interface ContentOptions {
  useEmojis: boolean;
  messageLength: MessageLength;
  includeReflectionQuestion: boolean;
  includeHashtags: boolean;
}

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
  contentOptions: ContentOptions;
  messageTitle?: string;
  speakerName?: string;
  userEmail?: string;
  days: DayContent[];
  quotes: string[];  // 3 key quotes from the sermon
  createdAt: Date;
}

export interface CampaignConfig {
  inputMethod: InputMethod;
  sourceContent: string;
  confession: Confession;
  duration: number;
  tone: Tone;
  contentOptions: ContentOptions;
  messageTitle?: string;
  speakerName?: string;
  userEmail?: string;
}
