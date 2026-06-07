export async function requireUser(env: Record<string, string>, request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const authUrl = env.VITE_NEON_AUTH_URL;
    if (!authUrl) {
      console.error('VITE_NEON_AUTH_URL est manquant');
      return null;
    }

    // Call Better Auth session endpoint directly
    const response = await fetch(`${authUrl}/get-session`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('Session API verification failed:', response.status);
      return null;
    }

    const data: any = await response.json();
    if (data && data.user) {
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      };
    }

    return null;
  } catch (err) {
    console.error('Session verification failed:', err);
    return null;
  }
}
