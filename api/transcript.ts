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

        // Fetch transcript
        const transcriptRaw = await YoutubeTranscript.fetchTranscript(url);

        // Assemble text
        const text = transcriptRaw.map(item => item.text).join(' ');

        return res.status(200).json({ transcript: text });
    } catch (error: any) {
        console.error('Erreur lors de la récupération de la transcription:', error);

        let errorMessage = 'Impossible de récupérer la transcription de cette vidéo.';
        if (error.message && error.message.includes('Transcript is disabled')) {
            errorMessage = 'Les sous-titres sont désactivés pour cette vidéo.';
        } else if (error.message && error.message.includes('No transcripts are available')) {
            errorMessage = 'Aucun sous-titre n\'est disponible pour cette vidéo.';
        }

        return res.status(500).json({ error: errorMessage });
    }
}
