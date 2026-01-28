
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  // Fixed: Property 'cwd' does not exist on type 'Process'. Using project root directory '.' as a reliable path for Vite configs.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Provide a fallback for the rest of process.env if needed
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        ...Object.keys(env).reduce((prev, key) => {
          prev[key] = env[key];
          return prev;
        }, {} as any),
      }
    },
    server: {
      port: 3000,
      open: true
    }
  };
});
