// Copie le Storybook construit sous dist/storybook/ pour que la vitrine et la
// reference technique soient un seul site, un seul domaine, un seul deploiement.
//
// Verifie au passage que chaque lien « Voir toutes les variantes » du registre
// pointe sur une histoire qui existe vraiment. Un identifiant recopie a la main
// pourrit des qu'une histoire est renommee : le build echoue plutot que de
// livrer un lien mort.
import { cpSync, existsSync, readFileSync } from 'node:fs';

const src = new URL('../../storybook-static/', import.meta.url);
const dest = new URL('../dist/storybook/', import.meta.url);

if (!existsSync(src)) {
  console.error('storybook-static/ absent. Lance d abord: npm run build-storybook');
  process.exit(1);
}

const index = JSON.parse(readFileSync(new URL('index.json', src), 'utf8'));
const registry = readFileSync(new URL('../src/data/components.ts', import.meta.url), 'utf8');
const referenced = [...registry.matchAll(/storybook:\s*'([^']+)'/g)].map((m) => m[1]);
const orphelins = referenced.filter((id) => !(id in index.entries));

if (orphelins.length) {
  console.error('Liens Storybook morts dans components.ts :');
  orphelins.forEach((id) => console.error('  ' + id));
  process.exit(1);
}

cpSync(src, dest, { recursive: true });
console.log(`Storybook copie sous dist/storybook/ (${referenced.length} liens verifies)`);
