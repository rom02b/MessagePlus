import type { Campaign, CampaignConfig, DayContent } from '../types/campaign';

// Mock AI service - will be replaced with real Vertex AI integration
export const generateCampaign = async (config: CampaignConfig): Promise<Campaign> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock content based on duration
  const days: DayContent[] = [];

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

  for (let i = 0; i < config.duration; i++) {
    const theme = mockThemes[i];
    const verse = mockVerses[i];

    days.push({
      day: i + 1,
      theme,
      verse,
      whatsapp: generateWhatsAppMessage(theme, verse, config.tone, config.confession),
      email: generateEmailContent(theme, verse, config.tone, config.confession),
      social: generateSocialContent(theme, verse, config.tone),
    });
  }

  return {
    id: crypto.randomUUID(),
    inputMethod: config.inputMethod,
    sourceContent: config.sourceContent,
    confession: config.confession,
    duration: config.duration,
    tone: config.tone,
    days,
    createdAt: new Date(),
  };
};

const generateWhatsAppMessage = (theme: string, verse: any, tone: string, confession: string): string => {
  const greeting = tone === 'warm-encouraging' ? '🙏 Bonjour cher(e) ami(e),' : '✝️ Paix et grâce,';
  const closing = confession === 'protestant' ? 'Que Dieu vous bénisse !' : 'Que le Seigneur soit avec vous !';

  return `${greeting}

📖 *${theme}*

"${verse.text}" - ${verse.reference}

💭 Réflexion du jour :
Prenez un moment aujourd'hui pour méditer sur cette parole. Comment Dieu vous parle-t-il à travers ce verset ?

🙏 Prière :
Seigneur, ouvre mon cœur à ta Parole. Aide-moi à vivre selon ta volonté aujourd'hui.

${closing}`;
};

const generateEmailContent = (theme: string, verse: any, _tone: string, _confession: string): { subject: string; body: string } => {
  const subject = `Jour de réflexion : ${theme}`;

  const body = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #092040; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .verse { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #e76937; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${theme}</h1>
    </div>
    <div class="content">
      <div class="verse">
        <p><em>"${verse.text}"</em></p>
        <p><strong>- ${verse.reference}</strong></p>
      </div>
      
      <h3>Réflexion</h3>
      <p>Cette parole nous invite à approfondir notre relation avec Dieu. Prenez un moment aujourd'hui pour méditer sur ce message et demandez-vous : comment puis-je vivre cette vérité dans ma vie quotidienne ?</p>
      
      <h3>Pour aller plus loin</h3>
      <ul>
        <li>Relisez ce passage dans son contexte</li>
        <li>Partagez cette réflexion avec un proche</li>
        <li>Notez ce que Dieu vous dit à travers ce verset</li>
      </ul>
    </div>
    <div class="footer">
      <p>Que Dieu vous bénisse dans votre cheminement spirituel.</p>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, body };
};

const generateSocialContent = (theme: string, verse: any, _tone: string): string => {
  return `✨ ${theme}

"${verse.text}" - ${verse.reference}

💭 Et vous, comment vivez-vous cette parole aujourd'hui ?

#Foi #Spiritualité #Méditation #Bible #Inspiration`;
};

// Extract themes and verses from source content (mock implementation)
export const extractThemes = async (_content: string): Promise<string[]> => {
  // This would use AI to extract key themes
  return ['Foi', 'Amour', 'Espérance', 'Grâce'];
};

export const extractVerses = async (_content: string): Promise<string[]> => {
  // This would use AI to identify biblical references
  return ['Jean 3:16', 'Romains 8:28', 'Philippiens 4:13'];
};
