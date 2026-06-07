import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db';
import { campaigns } from './lib/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from './lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Auth verification via Better Auth
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
        return res.status(401).json({ error: 'Authentification requise.' });
    }
    const userId = session.user.id;

    if (req.method === 'GET') {
        const data = await db.select().from(campaigns)
            .where(eq(campaigns.userId, userId))
            .orderBy(desc(campaigns.createdAt))
            .limit(30);
        return res.status(200).json({ campaigns: data });
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'ID de campagne manquant.' });
        }
        await db.delete(campaigns)
            .where(eq(campaigns.id, id));
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
