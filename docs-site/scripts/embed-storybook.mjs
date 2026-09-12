// Copie le Storybook construit sous dist/storybook/ pour que la vitrine et la
// reference technique soient un seul site, un seul domaine, un seul deploiement.
import { cpSync, existsSync } from 'node:fs';

const src = new URL('../../storybook-static/', import.meta.url);
const dest = new URL('../dist/storybook/', import.meta.url);

if (!existsSync(src)) {
  console.error('storybook-static/ absent. Lance d abord: npm run build-storybook');
  process.exit(1);
}

cpSync(src, dest, { recursive: true });
console.log('Storybook copie sous dist/storybook/');
