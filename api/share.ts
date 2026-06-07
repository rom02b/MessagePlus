import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db';
import { campaigns } from './lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID de campagne manquant.' });
    }

    const data = await db.select({
        id: campaigns.id,
        title: campaigns.title,
        speaker_name: campaigns.speakerName,
        confession: campaigns.confession,
        duration: campaigns.duration,
        tone: campaigns.tone,
        content_options: campaigns.contentOptions,
        days: campaigns.days,
        quotes: campaigns.quotes,
        created_at: campaigns.createdAt,
    })
    .from(campaigns)
    .where(eq(campaigns.id, id))
    .limit(1);

    const campaign = data[0];

    if (!campaign) {
        return res.status(404).json({ error: 'Parcours introuvable ou lien expiré.' });
    }

    return res.status(200).json({ campaign });
}
