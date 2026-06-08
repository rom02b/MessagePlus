import { authClient } from './src/lib/auth-client';
type T = Awaited<ReturnType<typeof authClient.getSession>>;
