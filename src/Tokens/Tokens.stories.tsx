import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/* Page « Jetons » : rien n'est recopié ici. La liste est lue au chargement
   dans la règle :root de tokens.css (feuilles de style de la page), donc un
   jeton ajouté ou modifié apparaît tout seul. Chaque ligne donne le nom, la
   valeur écrite (souvent un var() vers l'échelle) et la valeur calculée. */

type Jeton = { nom: string; ecrit: string; calcule: string };

function lireJetons(prefixe: string, exclure: string[] = []): Jeton[] {
  const racine = getComputedStyle(document.documentElement);
  const vus = new Map<string, string>();
  const lire = (regles: CSSRuleList) => {
    for (const r of Array.from(regles)) {
      if (r instanceof CSSStyleRule && r.selectorText === ':root') {
        for (const p of Array.from(r.style)) {
          if (p.startsWith(prefixe) && !exclure.some((x) => p.startsWith(x))) {
            vus.set(p, r.style.getPropertyValue(p).trim());
          }
        }
      } else if ('cssRules' in r) {
        lire((r as CSSGroupingRule).cssRules);
      }
    }
  };
  for (const f of Array.from(document.styleSheets)) {
    try { lire(f.cssRules); } catch { /* feuille d'une autre origine */ }
  }
  return [...vus].map(([nom, ecrit]) => ({ nom, ecrit, calcule: racine.getPropertyValue(nom).trim() }));
}

const s = {
  grille: { display: 'grid', gap: 2, fontSize: 13, color: 'var(--sirius-text)' } as React.CSSProperties,
  ligne: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 120px) minmax(0, 1fr) minmax(0, 1.2fr)',
    gap: 16,
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid var(--sirius-border-subdued)',
  } as React.CSSProperties,
  nom: { fontFamily: 'var(--s-font-family-mono)', fontSize: 12, fontWeight: 600, overflowWrap: 'anywhere' } as React.CSSProperties,
  valeur: { fontFamily: 'var(--s-font-family-mono)', fontSize: 12, color: 'var(--sirius-text-subdued)', overflowWrap: 'anywhere' } as React.CSSProperties,
};

function Table({ prefixe, exclure, apercu }: { prefixe: string; exclure?: string[]; apercu: (nom: string) => React.ReactNode }) {
  const [jetons, setJetons] = React.useState<Jeton[]>([]);
  React.useEffect(() => setJetons(lireJetons(prefixe, exclure)), [prefixe]);
  return (
    <div style={s.grille}>
      {jetons.map((j) => (
        <div key={j.nom} style={s.ligne}>
          <div>{apercu(j.nom)}</div>
          <div style={s.nom}>{j.nom}</div>
          <div style={s.valeur}>
            {j.ecrit}
            {j.ecrit !== j.calcule && <><br />= {j.calcule}</>}
          </div>
        </div>
      ))}
    </div>
  );
}

const boite: React.CSSProperties = { width: 64, height: 40, background: '#ffffff' };
const texte = (style: React.CSSProperties) => <span style={{ whiteSpace: 'nowrap', ...style }}>Fatou</span>;

const meta = {
  title: 'Fondations/Jetons',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Couleurs: Story = {
  render: () => (
    <Table prefixe="--s-color-" apercu={(n) => n.includes('gradient')
      ? <div style={{ ...boite, borderRadius: 8, background: `var(${n}), #00633a` }} />
      : <div style={{ ...boite, borderRadius: 8, background: `var(${n})`, boxShadow: 'inset 0 0 0 1px #0000001a' }} />} />
  ),
};

export const Ombres: Story = {
  render: () => <Table prefixe="--s-shadow-" apercu={(n) => <div style={{ ...boite, borderRadius: 12, boxShadow: `var(${n})` }} />} />,
};

export const Rayons: Story = {
  render: () => (
    <Table prefixe="--s-border-radius-" apercu={(n) => (
      <div style={{ ...boite, borderRadius: `var(${n})`, boxShadow: 'inset 0 0 0 1px #0000004d' }} />
    )} />
  ),
};

export const Espacements: Story = {
  render: () => (
    <Table prefixe="--s-space-" apercu={(n) => (
      <div style={{ width: `var(${n})`, maxWidth: 120, height: 12, background: '#00633a', borderRadius: 2 }} />
    )} />
  ),
};

export const Typographie: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <Table prefixe="--s-font-size-" apercu={(n) => texte({ fontSize: `var(${n})` })} />
      <Table prefixe="--s-font-weight-" apercu={(n) => texte({ fontWeight: `var(${n})` as unknown as number })} />
      <Table prefixe="--s-font-line-height-" apercu={(n) => (
        <div style={{ width: 64, height: `var(${n})`, background: '#00633a1a', boxShadow: 'inset 0 0 0 1px #00633a66' }} />
      )} />
      <Table prefixe="--s-font-letter-spacing-" apercu={(n) => texte({ letterSpacing: `var(${n})` })} />
      <Table prefixe="--s-font-" exclure={['--s-font-size-', '--s-font-weight-', '--s-font-line-height-', '--s-font-letter-spacing-']} apercu={() => null} />
    </div>
  ),
};

export const Animations: Story = {
  render: () => <Table prefixe="--s-motion-" apercu={() => null} />,
};

export const Empilement: Story = {
  name: 'Empilement et ruptures',
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <Table prefixe="--s-z-index-" apercu={() => null} />
      <Table prefixe="--s-breakpoints-" apercu={() => null} />
      <Table prefixe="--s-height-" apercu={() => null} />
    </div>
  ),
};
