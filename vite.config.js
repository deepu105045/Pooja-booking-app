import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Building with environment:', env.VITE_FIREBASE_ENV)

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_FIREBASE_ENV': JSON.stringify(env.VITE_FIREBASE_ENV)
    }
  }
})
