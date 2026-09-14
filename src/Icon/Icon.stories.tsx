import React, { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { SIRIUS_ICONS, ICON_ALIASES } from './sirius-icons';

const meta = {
  title: 'All Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { name: 'commandes', size: 20 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

const TOUS = Object.keys(SIRIUS_ICONS).sort();
const PLEINS = TOUS.filter((n) => n.endsWith('-filled'));
const ALIAS = Object.keys(ICON_ALIASES).sort();

type Filtre = 'tous' | 'pleins' | 'contours' | 'alias';

function Galerie() {
  const [q, setQ] = useState('');
  const [filtre, setFiltre] = useState<Filtre>('tous');
  const [copie, setCopie] = useState<string | null>(null);

  const liste = useMemo(() => {
    const base =
      filtre === 'pleins' ? PLEINS
      : filtre === 'contours' ? TOUS.filter((n) => !n.endsWith('-filled'))
      : filtre === 'alias' ? ALIAS
      : TOUS;
    const t = q.trim().toLowerCase();
    return t ? base.filter((n) => n.includes(t)) : base;
  }, [q, filtre]);

  const copier = (nom: string) => {
    navigator.clipboard?.writeText(nom);
    setCopie(nom);
    setTimeout(() => setCopie((c) => (c === nom ? null : c)), 1200);
  };

  const onglet = (v: Filtre, texte: string) => (
    <button
      key={v}
      type="button"
      onClick={() => setFiltre(v)}
      aria-pressed={filtre === v}
      style={{
        padding: '5px 12px',
        fontSize: 13,
        cursor: 'pointer',
        borderRadius: 'var(--sirius-radius-sm)',
        border: '1px solid var(--sirius-border)',
        background: filtre === v ? 'var(--sirius-primary-surface)' : 'var(--sirius-surface)',
        color: filtre === v ? 'var(--sirius-primary)' : 'var(--sirius-text)',
        fontWeight: filtre === v ? 500 : 400,
      }}
    >
      {texte}
    </button>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Chercher une icone"
          aria-label="Chercher une icone"
          style={{
            flex: '1 1 220px',
            padding: '6px 10px',
            fontSize: 13,
            color: 'var(--sirius-text)',
            background: 'var(--sirius-surface)',
            border: '1px solid var(--sirius-border)',
            borderRadius: 'var(--sirius-radius-sm)',
          }}
        />
        {onglet('tous', `Toutes ${TOUS.length}`)}
        {onglet('contours', `Contours ${TOUS.length - PLEINS.length}`)}
        {onglet('pleins', `Pleines ${PLEINS.length}`)}
        {onglet('alias', `Alias ${ALIAS.length}`)}
      </div>

      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--sirius-text-subdued)' }}>
        {liste.length} resultat{liste.length > 1 ? 's' : ''}. Clique sur une icone pour copier son nom.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
          gap: 8,
        }}
      >
        {liste.map((nom) => (
          <button
            key={nom}
            type="button"
            onClick={() => copier(nom)}
            title={`Copier « ${nom} »`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '12px 6px',
              cursor: 'pointer',
              background: copie === nom ? 'var(--sirius-primary-surface)' : 'var(--sirius-surface)',
              border: `1px solid ${copie === nom ? 'var(--sirius-primary)' : 'var(--sirius-border)'}`,
              borderRadius: 'var(--sirius-radius-base)',
              color: 'var(--sirius-text)',
              transition: 'var(--sirius-transition)',
            }}
          >
            <Icon name={nom} size={22} />
            <span
              style={{
                fontSize: 10,
                lineHeight: 1.3,
                wordBreak: 'break-all',
                color: copie === nom ? 'var(--sirius-primary)' : 'var(--sirius-text-subdued)',
              }}
            >
              {copie === nom ? 'copie' : nom}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Les 605 glyphes du jeu Sirius. Cherche, filtre, clique pour copier le nom
 * a coller dans `<Icon name="..." />`.
 */
export const Galerie_: Story = {
  name: 'Galerie',
  render: () => <Galerie />,
};

/** L'icone herite de la couleur du texte : aucune couleur en dur. */
export const Couleur: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      {[
        ['var(--sirius-text)', 'texte'],
        ['var(--sirius-primary)', 'primaire'],
        ['var(--sirius-critical)', 'critique'],
        ['var(--sirius-wave)', 'wave'],
        ['var(--sirius-om)', 'orange money'],
      ].map(([c, l]) => (
        <span key={l} style={{ color: c, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <Icon name="commandes" size={20} />
          {l}
        </span>
      ))}
    </div>
  ),
};

/** Contour et plein, la paire que le jeu precedent n'avait pas. */
export const ContourEtPlein: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      {['commandes', 'produits', 'paiements', 'clients', 'reglages', 'boutiques'].map((n) => (
        <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13 }}>
          <Icon name={n} size={20} />
          <Icon name={`${n}-filled`} size={20} />
          <code style={{ color: 'var(--sirius-text-subdued)' }}>{n}</code>
        </div>
      ))}
    </div>
  ),
};

export const Tailles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {[12, 14, 16, 20, 24, 32].map((s) => (
        <span key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: 11 }}>
          <Icon name="commandes" size={s} />
          {s}
        </span>
      ))}
    </div>
  ),
};
