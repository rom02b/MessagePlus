import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export function getAuth(env: Record<string, string>, request?: Request) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment.");
  }
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not defined in the environment.");
  }

  const sql = neon(env.DATABASE_URL);
  const db = drizzle({ client: sql });

  let baseUrl = env.BETTER_AUTH_URL;
  let originUrl = 'http://localhost:5173';
  if (!baseUrl && request) {
    const url = new URL(request.url);
    originUrl = `${url.protocol}//${url.host}`;
    baseUrl = `${originUrl}/api/auth`;
  } else if (!baseUrl) {
    baseUrl = 'http://localhost:5173/api/auth';
  } else if (!baseUrl.endsWith('/api/auth')) {
    originUrl = baseUrl;
    baseUrl = baseUrl.replace(/\/$/, '') + '/api/auth';
  } else {
    originUrl = baseUrl.replace(/\/api\/auth$/, '');
  }

  return betterAuth({
    database: drizzleAdapter(db, { provider: 'pg' }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: baseUrl,
    trustedOrigins: [
      originUrl,
      'http://localhost:5173',
      'capacitor://localhost',
      'http://localhost'
    ],
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const brevoApiKey = env.BREVO_API_KEY;
          if (!brevoApiKey) {
            console.error('BREVO_API_KEY manquante');
            return;
          }

          await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'api-key': brevoApiKey,
            },
            body: JSON.stringify({
              sender: {
                name: env.BREVO_SENDER_NAME || 'Message+',
                email: env.BREVO_SENDER_EMAIL || 'rom02b@hotmail.fr',
              },
              to: [{ email }],
              subject: 'Votre lien de connexion Message+',
              htmlContent: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #092040;">Connexion à Message+</h2>
                  <p>Bonjour,</p>
                  <p>Cliquez sur le bouton ci-dessous pour vous connecter :</p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background: #e76937; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Se connecter</a>
                  </p>
                  <p style="color: #666; font-size: 14px;">Ce lien est valable 10 minutes et ne peut être utilisé qu'une seule fois.</p>
                </div>
              `,
            }),
          });
        },
      }),
    ],
  });
}
