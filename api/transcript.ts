import type { VercelRequest, VercelResponse } from '@vercel/node';
import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'L\'URL YouTube est requise.' });
        }

        // Extract video ID for fallback
        let videoId = '';
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v') || '';
            } else if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            }
        } catch (e) {
            // ignore
        }

        let text = '';
        let primaryFailed = false;

        try {
            // First attempt: official youtube-transcript package
            const transcriptRaw = await YoutubeTranscript.fetchTranscript(url, { lang: 'fr' })
                .catch(() => YoutubeTranscript.fetchTranscript(url)); // Fallback to any lang

            text = transcriptRaw.map(item => item.text).join(' ');
        } catch (error: any) {
            console.warn('Méthode 1 échouée (protection bot potentielle), essai de la méthode 2...', error.message);
            primaryFailed = true;
        }

        // If primary method failed, try the yt-to-text API fallback
        if (primaryFailed && videoId) {
            const fallbackResponse = await fetch("https://yt-to-text.com/api/v1/Subtitles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-app-version": "1.0",
                    "x-source": "tubetranscript"
                },
                body: JSON.stringify({ video_id: videoId })
            });

            if (fallbackResponse.ok) {
                const data = await fallbackResponse.json();
                if (data.data && data.data.transcripts) {
                    text = data.data.transcripts.map((t: any) => t.t).join(' ');
                }
            }

            if (!text) {
                throw new Error("Les deux méthodes d'extraction ont échoué.");
            }
        }

        if (!text) {
            throw new Error('Aucun sous-titre trouvé.');
        }

        return res.status(200).json({ transcript: text });
    } catch (error: any) {
        console.error('Erreur lors de la récupération de la transcription:', error);

        let errorMessage = 'Impossible d\'extraire la transcription : YouTube bloque l\'accès automatisé. Veuillez utiliser l\'onglet "Texte Long".';
        if (error.message && error.message.includes('Transcript is disabled')) {
            errorMessage = 'YouTube bloque l\'accès automatisé aux sous-titres de cette vidéo (anti-bots). Veuillez utiliser l\'onglet "Texte Long" et y coller la transcription.';
        } else if (error.message && error.message.includes('No transcripts are available')) {
            errorMessage = 'Aucun sous-titre n\'est disponible pour cette vidéo. Veuillez utiliser l\'onglet "Texte Long".';
        }

        return res.status(500).json({ error: errorMessage });
    }
}
