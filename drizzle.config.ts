import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./api/lib/schema.ts', './auth-schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
