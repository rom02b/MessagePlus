import type { VercelRequest, VercelResponse } from '@vercel/node';

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
        const { email, subject, text, html } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'L\'adresse email est requise.' });
        }

        const brevoApiKey = process.env.BREVO_API_KEY;

        if (!brevoApiKey) {
            console.error('BREVO_API_KEY manquante');
            // If the key is missing, we log it and return a pseudo-success so we don't break the UI in local dev
            return res.status(200).json({
                success: true,
                warning: 'BREVO_API_KEY manquante, email ignoré en local.'
            });
        }

        const defaultHtml = html || `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Votre parcours Message+ est prêt !</h2>
                <p>Bonjour,</p>
                <p>Voici les contenus générés pour votre prédication :</p>
                <div style="white-space: pre-wrap; margin-top: 20px;">${text}</div>
            </div>
        `;

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': brevoApiKey
            },
            body: JSON.stringify({
                sender: { name: 'Message+', email: 'noreply@message-plus.app' }, // Replace with real sender if needed
                to: [{ email }],
                subject: subject || 'Votre parcours Message+ est prêt 🎉',
                htmlContent: defaultHtml
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur API Brevo:', errorData);
            throw new Error('Echec de l\'envoi via Brevo');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur lors de l\'envoi d\'email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}
