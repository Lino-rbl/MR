import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base:
    process.env.NODE_ENV === 'production' && process.env.GITHUB_REPOSITORY
      ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
      : '/',
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'premios.html'),
            
          }
        },
      },
});




