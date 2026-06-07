import { getDb } from './_lib/db';
import { requireUser } from './_lib/auth';
import { campaigns } from '../../api/lib/schema';
import { eq, desc } from 'drizzle-orm';

export const onRequest: PagesFunction = async (context) => {
  const env = context.env as any;
  const request = context.request;

  const db = getDb(env.DATABASE_URL!);
  
  // Auth verification via Neon Auth JWT
  const user = await requireUser(env, request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Authentification requise.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const userId = user.id;

  if (request.method === 'GET') {
    try {
      const data = await db.select().from(campaigns)
        .where(eq(campaigns.userId, userId))
        .orderBy(desc(campaigns.createdAt))
        .limit(30);
      return new Response(JSON.stringify({ campaigns: data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'ID de campagne manquant.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      await db.delete(campaigns)
        .where(eq(campaigns.id, id));
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};
