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

    // Call Better Auth session endpoint directly via fetch.
    // We pass the token both as a Bearer token and inside all possible cookie names 
    // that Neon Auth / Better Auth might look for.
    const response = await fetch(`${authUrl}/get-session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `neonauth.session_token=${token}; __Secure-neonauth.session_token=${token}; better-auth.session_token=${token}; __Secure-better-auth.session_token=${token}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Session API verification failed: ${response.status} ${response.statusText} - ${text}`);
    }

    const data: any = await response.json();
    
    // Si data est null, c'est que le token n'a pas été reconnu par l'API
    if (!data) {
      throw new Error("Session API returned null (token invalide ou non reconnu par Neon Auth).");
    }

    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      };
    }

    throw new Error(`Session API returned invalid data format: ${JSON.stringify(data)}`);
  } catch (err: any) {
    throw new Error(`Session verification failed: ${err.message}`);
  }
}
