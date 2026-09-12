import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  // La vitrine consomme les composants directement depuis ../src.
  // Pas de copie, pas de version decalee : ce qui est documente est ce qui
  // est livre au dashboard.
  vite: {
    resolve: {
      alias: { '@sirius': new URL('../src', import.meta.url).pathname },
    },
  },
});
