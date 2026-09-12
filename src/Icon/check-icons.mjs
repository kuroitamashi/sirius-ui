// Controle d integrite du jeu d icones. Lance par: npm run check:icons
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const ici = new URL('.', import.meta.url);
const icons = JSON.parse(readFileSync(new URL('sirius-icons.json', ici), 'utf8'));
const ts = readFileSync(new URL('sirius-icons.ts', ici), 'utf8');
const bloc = ts.slice(ts.indexOf('ICON_ALIASES'));
const alias = Object.fromEntries(
  [...bloc.matchAll(/^\s{2}'?([a-zA-Z0-9-]+)'?:\s*'([a-z0-9-]+)',/gm)].map((m) => [m[1], m[2]])
);

// 1. Chaque glyphe a au moins un trace non vide et commence par une commande valide.
for (const [nom, tuples] of Object.entries(icons)) {
  assert(Array.isArray(tuples) && tuples.length, `glyphe vide: ${nom}`);
  for (const t of tuples) {
    assert(typeof t[0] === 'string' && t[0].length > 10, `trace invalide: ${nom}`);
    assert(/^[Mm]/.test(t[0]), `trace ne commence pas par M: ${nom}`);
    if (t.length > 1) assert(t[1] === 1, `second element inattendu: ${nom} -> ${t[1]}`);
  }
}

// 2. Chaque alias pointe sur un glyphe existant.
for (const [de, vers] of Object.entries(alias)) {
  assert(icons[vers], `alias mort: ${de} -> ${vers}`);
}

// 3. Le jeu filled est bien la.
const filled = Object.keys(icons).filter((n) => n.endsWith('-filled'));
assert(filled.length >= 70, `pas assez de filled: ${filled.length}`);

// 4. Aucun fill en dur ne subsiste dans les traces (le composant impose currentColor).
const enDur = Object.entries(icons).filter(([, t]) => t.some((x) => /#[0-9a-fA-F]{3,6}/.test(x[0])));
assert(!enDur.length, `couleur en dur: ${enDur.map(([n]) => n).join(', ')}`);

console.log('OK  glyphes        :', Object.keys(icons).length);
console.log('OK  dont filled    :', filled.length);
console.log('OK  alias resolus  :', Object.keys(alias).length);
