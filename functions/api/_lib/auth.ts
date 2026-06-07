import { createAuthClient } from '@neondatabase/auth';

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

    const authClient = createAuthClient(authUrl);
    
    // Pass the token as a Bearer token in the Authorization header to the getSession call
    const { data, error } = await authClient.getSession({
      fetchOptions: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    });

    if (error) {
      throw new Error(`Session API returned error: ${error.message || JSON.stringify(error)}`);
    }

    if (data && data.user) {
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      };
    }

    throw new Error(`Session API returned invalid data: ${JSON.stringify(data)}`);
  } catch (err: any) {
    throw new Error(`Session verification failed: ${err.message}`);
  }
}
