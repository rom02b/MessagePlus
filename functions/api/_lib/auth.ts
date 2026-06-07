import * as jose from 'jose';

export async function requireUser(env: Record<string, string>, request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const jwksUrl = new URL('/.well-known/jwks.json', env.VITE_NEON_AUTH_URL);
    const JWKS = jose.createRemoteJWKSet(jwksUrl);
    
    const { payload } = await jose.jwtVerify(token, JWKS);
    
    // Neon Auth JWT typically contains sub (user ID) and email
    if (payload && payload.sub) {
      return {
        id: payload.sub,
        email: payload.email as string || '',
        name: payload.name as string || '',
      };
    }
    return null;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}
