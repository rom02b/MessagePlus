import { getDb } from './_lib/db';
import { neon } from '@neondatabase/serverless';

export async function onRequest(context: any) {
    const { env } = context;
    try {
        const sql = neon(env.DATABASE_URL);
        const rows = await sql`SELECT id, token, expires_at FROM neon_auth.session LIMIT 1`;
        return new Response(JSON.stringify({ sessions: rows }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        try {
            const sql = neon(env.DATABASE_URL);
            const rows = await sql`SELECT id, token, "expiresAt" FROM neon_auth.session LIMIT 1`;
            return new Response(JSON.stringify({ sessions: rows, camelCase: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: err.message, fallbackError: e.message }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            });
        }
    }
}
