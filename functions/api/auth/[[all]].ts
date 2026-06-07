import { getAuth } from '../_lib/auth';

export const onRequest: PagesFunction = async (context) => {
  const auth = getAuth(context.env as any);
  return auth.handler(context.request);
};
