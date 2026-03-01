import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      // Expose Supabase public keys to the client bundle
      // The names match what is configured in Vercel env vars
      __SUPABASE_URL__: JSON.stringify(env.SUPABASE_URL || ''),
      __SUPABASE_ANON__: JSON.stringify(env.SUPABASE_ANON || ''),
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://messageplus.vercel.app',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
