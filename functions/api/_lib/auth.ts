import { neon } from '@neondatabase/serverless';

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function requireUser(env: Record<string, string>, request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error("Missing token in Authorization header");
  }

  try {
    const databaseUrl = env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL est manquant");
    }

    const sql = neon(databaseUrl);
    
    // Le token côté client est en clair, mais Better Auth le stocke haché en SHA-256
    const hashedToken = await hashToken(token);
    
    // On va tenter de chercher le token en clair et le token haché, au cas où
    const rows = await sql`
      SELECT u.id, u.email, u.name 
      FROM neon_auth.session s
      JOIN neon_auth."user" u ON u.id = s.user_id
      WHERE (s.token = ${token} OR s.token = ${hashedToken})
      AND s.expires_at > NOW()
    `;

    if (rows && rows.length > 0) {
      const user = rows[0];
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }

    throw new Error(`Session non trouvée ou expirée pour ce token (plain et hash essayés)`);
  } catch (err: any) {
    if (err.message && err.message.includes("does not exist")) {
      try {
        const hashedToken = await hashToken(token);
        const databaseUrl = env.DATABASE_URL;
        const sql = neon(databaseUrl!);
        const rows = await sql`
          SELECT u.id, u.email, u.name 
          FROM neon_auth.session s
          JOIN neon_auth."user" u ON u.id = s."userId"
          WHERE (s.token = ${token} OR s.token = ${hashedToken})
          AND s."expiresAt" > NOW()
        `;
        if (rows && rows.length > 0) {
          const user = rows[0];
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
        throw new Error(`Session DB (camelCase) returned 0 rows for token/hash`);
      } catch (fallbackErr: any) {
        throw new Error(`Session DB fallback query failed: ${fallbackErr.message}`);
      }
    }
    throw new Error(`Session DB verification failed: ${err.message}`);
  }
}
