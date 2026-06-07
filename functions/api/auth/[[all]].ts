import { getAuth } from '../_lib/auth';

export const onRequest: PagesFunction = async (context) => {
  try {
    const auth = getAuth(context.env as any, context.request);
    return await auth.handler(context.request);
  } catch (err: any) {
    console.error('[auth handler error]', err?.stack ?? err);
    return new Response(
      JSON.stringify({
        error: 'auth_failed',
        message: err?.message ?? String(err),
        stack: err?.stack
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
