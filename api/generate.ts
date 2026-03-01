import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// ── Types (mirrored from frontend) ─────────────────────────────────────────
type Confession = 'protestant' | 'catholic';
type Tone = 'warm-encouraging' | 'reflective' | 'challenging' | 'pastoral' | 'contemplative';
type MessageLength = 'short' | 'medium' | 'long';

interface ContentOptions {
    useEmojis: boolean;
    messageLength: MessageLength;
    includeReflectionQuestion: boolean;
    includeHashtags: boolean;
}

interface CampaignConfig {
    sourceContent: string;
    confession: Confession;
    duration: number;
    tone: Tone;
    contentOptions: ContentOptions;
    messageTitle?: string;
    speakerName?: string;
}

// ── Tone labels ───────────────────────────────────────────────────────────
const TONE_LABELS: Record<Tone, string> = {
    'warm-encouraging': 'Chaleureux et encourageant — messages positifs, empathiques, proches',
    'reflective': 'Réflexif et contemplatif — invite à la méditation intérieure',
    'challenging': 'Interpellant et motivant — appelle à l\'action et à la transformation',
    'pastoral': 'Pastoral et bienveillant — accompagnement doux, paroles de réconfort',
    'contemplative': 'Méditatif et profond — poésie spirituelle, silence intérieur',
};

const LENGTH_LABELS: Record<MessageLength, string> = {
    short: 'Court — environ 80 mots par message, accrocheur et percutant',
    medium: 'Moyen — environ 150 mots par message, équilibré',
    long: 'Long — environ 250 mots par message, développé et complet',
};

// ── Prompt builder ────────────────────────────────────────────────────────
function buildPrompt(config: CampaignConfig): string {
    const {
        sourceContent, confession, tone, duration, contentOptions,
        messageTitle, speakerName,
    } = config;
    const { useEmojis, messageLength, includeReflectionQuestion, includeHashtags } = contentOptions;

    const confessionLabel = confession === 'protestant'
        ? 'Protestante / Évangélique — utilise un langage biblique direct, citations de l\'Écriture, appel à la foi personnelle'
        : 'Catholique — utilise un langage liturgique, sacramentel, références à la tradition et aux saints';

    const emojiInstruction = useEmojis
        ? 'Utilise des emojis expressifs et pertinents pour illustrer les points clés.'
        : 'N\'utilise AUCUN emoji dans les messages. Style sobre et littéraire uniquement.';

    const reflectionInstruction = includeReflectionQuestion
        ? 'Inclure une question de réflexion personnelle dans les messages WhatsApp et réseaux sociaux.'
        : 'Ne pas inclure de question de réflexion.';

    const hashtagInstruction = includeHashtags
        ? 'Terminer les posts réseaux sociaux avec 5-7 hashtags pertinents en français et anglais (ex: #Foi #Prière #Bible).'
        : 'Ne pas inclure de hashtags dans les posts réseaux sociaux.';

    return `
Tu es un expert en communication d'Église et en marketing digital chrétien.

À partir de la prédication ou du contenu ci-dessous, génère un parcours d'engagement de ${duration} jours pour la communauté.

## CONTENU SOURCE DE LA PRÉDICATION :
${sourceContent || '(Aucun contenu fourni — génère un contenu spirituel général sur la foi)'}

${messageTitle ? `## TITRE DU MESSAGE : "${messageTitle}"` : ''}
${speakerName ? `## ORATEUR / PRÉDICATEUR : ${speakerName}` : ''}

## PARAMÈTRES DE GÉNÉRATION :
- **Confession** : ${confessionLabel}
- **Tonalité** : ${TONE_LABELS[tone]}
- **Longueur** : ${LENGTH_LABELS[messageLength]}

## OPTIONS DE CONTENU :
- Emojis : ${emojiInstruction}
- Question de réflexion : ${reflectionInstruction}
- Hashtags : ${hashtagInstruction}

## RÈGLES STRICTES :
1. Chaque jour doit avoir son propre thème distinct extrait ou inspiré de la prédication.
2. Le verset biblique doit être réel et cohérent avec le thème du jour.
3. Le contenu WhatsApp doit être naturel, comme un message d'ami envoyé dans un groupe communautaire.
4. L'email doit être complet avec un objet accrocheur et un corps HTML bien structuré.
5. Le post réseaux sociaux doit être adapté à Instagram/Facebook.
6. Respecte scrupuleusement la longueur demandée (${messageLength}).
7. Toute la réponse doit être en FRANÇAIS.

## FORMAT DE RÉPONSE :
Retourne UNIQUEMENT un objet JSON valide, sans markdown, sans balises \`\`\`json, sans commentaires.
Structure exacte :
{
  "title": "Titre accrocheur généré pour ce parcours (maximum 50 caractères)",
  "quotes": [
    "Citation forte extraite mot pour mot ou paraphrasée du message — idéale pour un visuel Instagram",
    "Deuxième citation impactante du message",
    "Troisième citation mémorable du message"
  ],
  "days": [
    {
      "day": 1,
      "theme": "Titre du thème du jour",
      "verse": {
        "reference": "Livre chapitre:verset",
        "text": "Texte exact du verset en français (traduction Louis Segond ou Bible en français courant)"
      },
      "whatsapp": "Texte complet du message WhatsApp",
      "email": {
        "subject": "Objet de l'email",
        "body": "Corps HTML complet de l'email (inclure balises HTML de base : h1, p, blockquote)"
      },
      "social": "Texte complet du post réseaux sociaux"
    }
  ]
}
`.trim();
}

// ── Vercel Function handler ───────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // ── JWT verification (Supabase) ───────────────────────────────────────
    // SUPABASE_URL and SUPABASE_SERVICE_KEY are server-only env vars (no VITE_ prefix)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace(/^Bearer\s+/i, '');

        if (!token) {
            return res.status(401).json({ error: 'Authentification requise. Connectez-vous pour générer du contenu.' });
        }

        const adminClient = createClient(supabaseUrl, supabaseServiceKey);
        const { error: authError } = await adminClient.auth.getUser(token);

        if (authError) {
            return res.status(401).json({ error: 'Session expirée. Veuillez vous reconnecter.' });
        }
    }

    // API key — server-side only, never sent to the browser
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: 'Clé API Gemini non configurée. Ajoutez GEMINI_API_KEY dans les variables d\'environnement Vercel.',
        });
    }

    const config: CampaignConfig = req.body;

    if (!config || typeof config.duration !== 'number') {
        return res.status(400).json({ error: 'Configuration invalide.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
            },
        });

        const prompt = buildPrompt(config);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Parse and validate JSON
        let parsed: { title?: string; quotes?: string[]; days?: unknown[] };
        try {
            parsed = JSON.parse(text);
        } catch {
            // Try to extract JSON object from response if it has extra text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('La réponse de l\'IA n\'est pas au format JSON attendu.');
            }
            parsed = JSON.parse(jsonMatch[0]);
        }

        const title = parsed.title;
        const days = parsed.days;
        const quotes = parsed.quotes ?? [];

        if (!Array.isArray(days) || days.length === 0) {
            throw new Error('Format de réponse inattendu de l\'IA.');
        }

        return res.status(200).json({ title, days, quotes });

    } catch (error: unknown) {
        console.error('[/api/generate] Error:', error);
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        return res.status(500).json({ error: `Erreur de génération : ${message}` });
    }
}
