import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireUser } from './_lib/auth';
import { getDb } from './_lib/db';
import { campaigns } from '../../api/lib/schema';
import { eq, gte, and, count } from 'drizzle-orm';

// ── Brevo Email Sending Helper ─────────────────────────────────────────────
async function sendNotificationEmail(env: Record<string, string>, toEmail: string, title: string | undefined, days: any[]) {
    const brevoApiKey = env.BREVO_API_KEY;
    if (!brevoApiKey) {
        console.error('BREVO_API_KEY manquante pour l\'envoi d\'email automatique');
        return;
    }

    const textContent = days.map((d: any) => `Jour ${d.day}: ${d.theme}\n\nWhatsApp: ${d.whatsapp}\n\nEmail: ${d.email.subject}\n${d.email.body}\n\nRéseaux Sociaux: ${d.social}`).join('\n\n---\n\n');

    const htmlContent = `
        <div style="font-family: sans-serif; color: #333;">
            <h2>Votre parcours Message+ est prêt ! 🎉</h2>
            ${title ? `<h3>${title}</h3>` : ''}
            <p>Bonjour,</p>
            <p>Voici les contenus générés pour votre prédication :</p>
            <div style="white-space: pre-wrap; margin-top: 20px;">${textContent}</div>
        </div>
    `;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': brevoApiKey
            },
            body: JSON.stringify({
                sender: {
                    name: env.BREVO_SENDER_NAME || 'Message+',
                    email: env.BREVO_SENDER_EMAIL || 'rom02b@hotmail.fr'
                },
                to: [{ email: toEmail }],
                subject: 'Votre parcours Message+ est prêt 🎉',
                htmlContent: htmlContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur API Brevo:', errorData);
        } else {
            console.log('Email envoyé avec succès à', toEmail);
        }
    } catch (error) {
        console.error('Erreur exceptionnelle lors de l\'envoi:', error);
    }
}

// ── Types ──────────────────────────────────────────────────────────────────
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
    userEmail?: string;
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
8. Tu DOIS ABSOLUMENT générer le champ "title" avec un titre général.
9. Tu DOIS ABSOLUMENT générer le champ "quotes" avec un tableau de 3 citations piochées dans le texte.

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

// ── Cloudflare Function handler ───────────────────────────────────────────
export const onRequest: PagesFunction = async (context) => {
    const env = context.env as any;
    const request = context.request;

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const db = getDb(env.DATABASE_URL!);
    // ── Session verification (Neon Auth JWT) ─────────────────────────────────
    let authenticatedUser: { id: string; email: string } | null = null;

    let authError = 'Authentification requise. Connectez-vous pour générer du contenu.';
    try {
        const user = await requireUser(env, request);
        if (user) {
            authenticatedUser = { id: user.id, email: user.email };
        }
    } catch (err: any) {
        // No valid session
        authError = err.message || authError;
    }

    if (!authenticatedUser) {
        return new Response(JSON.stringify({ error: authError }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // ── Rate limiting (8 per day) ─────────────────────────────────────────
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    try {
        const [{ value: todayCount }] = await db.select({ value: count() })
            .from(campaigns)
            .where(
                and(
                    eq(campaigns.userId, authenticatedUser.id),
                    gte(campaigns.createdAt, startOfDay)
                )
            );

        if (todayCount >= 8) {
            return new Response(JSON.stringify({ error: 'Limite quotidienne atteinte (8 parcours maximum par jour). Veuillez réessayer demain.' }), {
                status: 429,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (dbErr: any) {
        return new Response(JSON.stringify({ error: `Erreur d'accès à la base de données : ${dbErr.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // API key — server-side only, never sent to the browser
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({
            error: 'Clé API Gemini non configurée. Ajoutez GEMINI_API_KEY dans les variables d\'environnement Cloudflare.',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let config: CampaignConfig;
    try {
        config = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Configuration invalide.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!config || typeof config.duration !== 'number') {
        return new Response(JSON.stringify({ error: 'Configuration invalide.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
            },
        });

        const prompt = buildPrompt(config);
        
        // --- Exponential Backoff Retry Logic ---
        let result;
        let retries = 0;
        const maxRetries = 3;
        const baseDelay = 2000;

        while (true) {
            try {
                result = await model.generateContent(prompt);
                break; // success, exit loop
            } catch (err: any) {
                const errorMessage = err?.message || String(err);
                const isRateLimit = errorMessage.includes('429') || 
                                  errorMessage.includes('Too Many Requests') || 
                                  errorMessage.includes('Resource exhausted');
                
                if (isRateLimit && retries < maxRetries) {
                    const delay = baseDelay * Math.pow(2, retries);
                    console.warn(`[Gemini API] 429 Too Many Requests. Retrying in ${delay}ms (Attempt ${retries + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retries++;
                } else {
                    if (isRateLimit) {
                        return new Response(JSON.stringify({
                            error: 'Les serveurs Google Gemini sont surchargés (Quota atteint). Le système a tenté plusieurs fois en vain. Veuillez réessayer plus tard.'
                        }), {
                            status: 429,
                            headers: { 'Content-Type': 'application/json' },
                        });
                    }
                    throw err; // Re-throw other errors immediately
                }
            }
        }
        
        const text = result.response.text();

        // Parse and validate JSON
        let parsed: { title?: string; quotes?: string[]; days?: unknown[] };
        try {
            parsed = JSON.parse(text);
        } catch {
            // Try to extract JSON object from response if it has extra text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return new Response(JSON.stringify({ error: 'La réponse de l\'IA n\'est pas au format JSON attendu.' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            parsed = JSON.parse(jsonMatch[0]);
        }

        const title = parsed.title;
        const days = parsed.days;
        const quotes = parsed.quotes ?? [];

        if (!Array.isArray(days) || days.length === 0) {
            return new Response(JSON.stringify({ error: 'Format de réponse inattendu de l\'IA.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- Envoi de l'email automatique ---
        let targetEmail = config.userEmail;
        
        // Si l'utilisateur est connecté, on privilégie son email Auth
        if (authenticatedUser?.email) {
            targetEmail = authenticatedUser.email;
        }
        
        if (targetEmail) {
            // on await pour s'assurer qu'il part avant de répondre
            await sendNotificationEmail(env, targetEmail, title, days);
        }

        // --- Sauvegarde dans la base de données ---
        let insertedId = null;
        if (authenticatedUser) {
            try {
                const inserted = await db.insert(campaigns).values({
                    userId: authenticatedUser.id,
                    title: title || 'Parcours sans titre',
                    confession: config.confession,
                    duration: config.duration,
                    tone: config.tone,
                    contentOptions: config.contentOptions,
                    speakerName: config.speakerName || null,
                    days: days as any,
                    quotes: quotes as any,
                }).returning({ id: campaigns.id });
                if (inserted && inserted.length > 0) {
                    insertedId = inserted[0].id;
                }
            } catch (saveError) {
                console.error('Erreur lors de la sauvegarde du parcours:', saveError);
                // On continue pour renvoyer le contenu même si la sauvegarde échoue
            }
        }

        return new Response(JSON.stringify({ 
            id: insertedId,
            title, 
            days, 
            quotes, 
            emailSentTo: targetEmail || null 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        console.error('[/api/generate] Error:', error);
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        return new Response(JSON.stringify({ error: `Erreur de génération : ${message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
