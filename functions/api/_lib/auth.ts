import * as jose from 'jose';

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
    const authUrl = env.VITE_NEON_AUTH_URL;
    if (!authUrl) {
      throw new Error("VITE_NEON_AUTH_URL est manquant");
    }

    // Neon Auth génère un JWT (eyJhb...)
    // On doit vérifier sa signature avec les clés publiques de l'API
    const baseUrl = authUrl.replace(/\/$/, '');
    const jwksUrl = new URL(baseUrl + '/.well-known/jwks.json');
    const JWKS = jose.createRemoteJWKSet(jwksUrl);
    
    const { payload } = await jose.jwtVerify(token, JWKS);

    if (!payload) {
      throw new Error("Payload du JWT vide");
    }

    const user = (payload as any).user;
    if (user && user.id) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }

    if (payload.sub) {
      return {
        id: payload.sub,
        email: (payload as any).email || '',
        name: (payload as any).name || '',
      };
    }

    throw new Error(`Format du JWT inattendu: ${JSON.stringify(payload)}`);
  } catch (err: any) {
    throw new Error(`Erreur JWT: ${err.message}`);
  }
}
