import { getDb } from './_lib/db';
import { campaigns } from '../../api/lib/schema';
import { eq } from 'drizzle-orm';

export const onRequest: PagesFunction = async (context) => {
  const env = context.env as any;
  const request = context.request;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = getDb(env.DATABASE_URL!);

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID de campagne manquant.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
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
      return new Response(JSON.stringify({ error: 'Parcours introuvable ou lien expiré.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ campaign }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
