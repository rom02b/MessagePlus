import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Configuration serveur incomplète.' });
    }

    // Use service key to bypass RLS for public read-by-ID
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await adminClient
        .from('campaigns')
        .select('id, title, speaker_name, confession, duration, tone, content_options, days, quotes, created_at')
        .eq('id', id)
        .single();

    if (error || !data) {
        return res.status(404).json({ error: 'Parcours introuvable ou lien expiré.' });
    }

    return res.status(200).json({ campaign: data });
}
