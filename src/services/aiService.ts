import type { Campaign, CampaignConfig, DayContent } from '../types/campaign';

// Mock AI service - will be replaced with real Vertex AI integration
export const generateCampaign = async (config: CampaignConfig): Promise<Campaign> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { contentOptions } = config;

  const mockThemes = [
    'La foi qui transforme',
    'L\'amour inconditionnel de Dieu',
    'La puissance de la prière',
    'Vivre dans l\'espérance',
    'Le pardon libérateur',
    'La grâce qui suffit',
  ];

  const mockVerses = [
    { reference: 'Jean 3:16', text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique...' },
    { reference: 'Philippiens 4:13', text: 'Je puis tout par celui qui me fortifie.' },
    { reference: 'Romains 8:28', text: 'Toutes choses concourent au bien de ceux qui aiment Dieu.' },
    { reference: 'Psaume 23:1', text: 'L\'Éternel est mon berger, je ne manquerai de rien.' },
    { reference: 'Matthieu 11:28', text: 'Venez à moi, vous tous qui êtes fatigués et chargés.' },
    { reference: 'Éphésiens 2:8', text: 'C\'est par la grâce que vous êtes sauvés, par le moyen de la foi.' },
  ];

  const days: DayContent[] = [];

  for (let i = 0; i < config.duration; i++) {
    const theme = mockThemes[i];
    const verse = mockVerses[i];

    days.push({
      day: i + 1,
      theme,
      verse,
      whatsapp: generateWhatsAppMessage(theme, verse, config.tone, config.confession, contentOptions),
      email: generateEmailContent(theme, verse, config.confession, contentOptions),
      social: generateSocialContent(theme, verse, contentOptions),
    });
  }

  return {
    id: crypto.randomUUID(),
    inputMethod: config.inputMethod,
    sourceContent: config.sourceContent,
    confession: config.confession,
    duration: config.duration,
    tone: config.tone,
    contentOptions,
    days,
    createdAt: new Date(),
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────

const e = (emoji: string, useEmojis: boolean) => useEmojis ? emoji + ' ' : '';

const reflectionSentence = (useEmojis: boolean) =>
  `${e('💭', useEmojis)}Réflexion du jour :\nPrenez un moment aujourd'hui pour méditer sur cette parole. Comment Dieu vous parle-t-il à travers ce verset ?`;

const reflectionQuestion = (useEmojis: boolean) =>
  `${e('💭', useEmojis)}Et vous, comment vivez-vous cette parole aujourd'hui ?`;

const prayerBlock = (_confession: string, useEmojis: boolean) =>
  `${e('🙏', useEmojis)}Prière :\nSeigneur, ouvre mon cœur à ta Parole. Aide-moi à vivre selon ta volonté aujourd'hui.`;

const hashtagsBlock = () =>
  `\n#Foi #Spiritualité #Méditation #Bible #Inspiration`;

// ── WhatsApp ──────────────────────────────────────────────────────────────

const generateWhatsAppMessage = (
  theme: string,
  verse: { reference: string; text: string },
  tone: string,
  confession: string,
  opts: import('../types/campaign').ContentOptions,
): string => {
  const { useEmojis, messageLength, includeReflectionQuestion } = opts;

  const greeting = tone === 'warm-encouraging'
    ? `${e('🙏', useEmojis)}Bonjour cher(e) ami(e),`
    : `${e('✝️', useEmojis)}Paix et grâce,`;

  const closing = confession === 'protestant'
    ? `Que Dieu vous bénisse !`
    : `Que le Seigneur soit avec vous !`;

  const verseBlock = `${e('📖', useEmojis)}*${theme}*\n\n"${verse.text}" - ${verse.reference}`;

  if (messageLength === 'short') {
    return `${greeting}\n\n${verseBlock}\n\n${closing}`;
  }

  const reflection = includeReflectionQuestion
    ? `\n\n${reflectionSentence(useEmojis)}`
    : '';

  if (messageLength === 'medium') {
    return `${greeting}\n\n${verseBlock}${reflection}\n\n${closing}`;
  }

  // long
  const prayer = `\n\n${prayerBlock(confession, useEmojis)}`;
  return `${greeting}\n\n${verseBlock}${reflection}${prayer}\n\n${closing}`;
};

// ── Email ──────────────────────────────────────────────────────────────

const generateEmailContent = (
  theme: string,
  verse: { reference: string; text: string },
  _confession: string,
  opts: import('../types/campaign').ContentOptions,
): { subject: string; body: string } => {
  const { useEmojis, messageLength, includeReflectionQuestion } = opts;
  const subject = `${useEmojis ? '✨ ' : ''}Jour de réflexion : ${theme}`;

  const reflectionHtml = includeReflectionQuestion
    ? `<h3>Réflexion</h3>
       <p>Cette parole nous invite à approfondir notre relation avec Dieu. Prenez un moment aujourd'hui pour méditer sur ce message et demandez-vous : comment puis-je vivre cette vérité dans ma vie quotidienne ?</p>`
    : '';

  const furtherHtml = messageLength !== 'short'
    ? `<h3>Pour aller plus loin</h3>
       <ul>
         <li>Relisez ce passage dans son contexte</li>
         <li>Partagez cette réflexion avec un proche</li>
         ${messageLength === 'long' ? '<li>Notez ce que Dieu vous dit à travers ce verset</li>' : ''}
       </ul>`
    : '';

  const body = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #092040; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background: #f9f9f9; }
    .verse { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #e76937; border-radius: 0 4px 4px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>${theme}</h1></div>
    <div class="content">
      <div class="verse">
        <p><em>"${verse.text}"</em></p>
        <p><strong>- ${verse.reference}</strong></p>
      </div>
      ${reflectionHtml}
      ${furtherHtml}
    </div>
    <div class="footer">
      <p>Que Dieu vous bénisse dans votre cheminement spirituel.</p>
    </div>
  </div>
</body>
</html>`;

  return { subject, body };
};

// ── Social ──────────────────────────────────────────────────────────────

const generateSocialContent = (
  theme: string,
  verse: { reference: string; text: string },
  opts: import('../types/campaign').ContentOptions,
): string => {
  const { useEmojis, includeReflectionQuestion, includeHashtags } = opts;

  const intro = `${e('✨', useEmojis)}${theme}`;
  const verseBlock = `"${verse.text}" - ${verse.reference}`;
  const reflection = includeReflectionQuestion
    ? `\n\n${reflectionQuestion(useEmojis)}`
    : '';
  const hashtags = includeHashtags ? hashtagsBlock() : '';

  return `${intro}\n\n${verseBlock}${reflection}${hashtags}`;
};

// ── Unused (kept for future real AI integration) ──────────────────────

export const extractThemes = async (_content: string): Promise<string[]> => {
  return ['Foi', 'Amour', 'Espérance', 'Grâce'];
};

export const extractVerses = async (_content: string): Promise<string[]> => {
  return ['Jean 3:16', 'Romains 8:28', 'Philippiens 4:13'];
};
