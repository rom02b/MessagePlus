import { neon } from '@neondatabase/serverless';

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
    
    // Better Auth defaults to snake_case column names for Postgres: user_id, expires_at
    // but sometimes it's camelCase if not mapped. We will try snake_case first.
    // We quote table and schema names just in case.
    const rows = await sql`
      SELECT u.id, u.email, u.name 
      FROM neon_auth.session s
      JOIN neon_auth."user" u ON u.id = s.user_id
      WHERE s.token = ${token}
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

    throw new Error(`Session non trouvée ou expirée pour ce token.`);
  } catch (err: any) {
    // Si la colonne n'existe pas, on tente l'autre format (camelCase pur)
    if (err.message && err.message.includes("does not exist")) {
      try {
        const databaseUrl = env.DATABASE_URL;
        const sql = neon(databaseUrl!);
        const rows = await sql`
          SELECT u.id, u.email, u.name 
          FROM neon_auth.session s
          JOIN neon_auth."user" u ON u.id = s."userId"
          WHERE s.token = ${token}
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
      } catch (fallbackErr: any) {
        throw new Error(`Session DB verification failed: ${fallbackErr.message}`);
      }
    }
    throw new Error(`Session DB verification failed: ${err.message}`);
  }
}
