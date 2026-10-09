import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/* Banc d'essai : deux cartes nues, sans border ni arrondi, pour comparer
   les ombres seules. --s-shadow-100 vient de tokens.css. La carte d'accueil
   prend --s-shadow-home-card et --s-border-radius-home-card (tokens.css).
   La carte Momo prend le rayon du champ Sidekick. */
const CSS = `
.labo-carte {
  width: 320px;
  height: 200px;
  background: #ffffff;
}
.labo-home-card {
  position: relative;
  width: 100%;
  border-radius: var(--s-border-radius-home-card);
  box-shadow: var(--s-shadow-home-card);
  transition: box-shadow var(--s-motion-home-card-expand-duration) var(--s-motion-home-card-content-ease);
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--sirius-text);
}
.labo-momo-card {
  /* Champ de Momo, notre compagnon IA (le « Sidekick » de l'admin de référence) */
  --momo-field-border-radius: calc(var(--s-border-radius-750) - var(--s-border-radius-100));
  border-radius: var(--momo-field-border-radius);
  width: 640px;
  height: 100px;
  box-shadow: var(--s-shadow-100);
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--sirius-text);
}
.labo-home-card:hover {
  box-shadow: var(--s-shadow-home-card-hover);
}
`;

const meta = {
  title: 'Labo/Ombres',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const legende: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--sirius-text)' };

export const Comparaison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, padding: 32 }}>
      <style>{CSS}</style>
      <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
        <div className="labo-carte" style={{ boxShadow: 'var(--s-shadow-100)' }} />
        <figcaption style={legende}>--s-shadow-100</figcaption>
      </figure>
      <figure style={{ margin: 0, display: 'grid', gap: 12, width: 320 }}>
        <div className="labo-carte labo-home-card">Carte d'accueil</div>
        <figcaption style={legende}>--s-shadow-home-card, -hover au survol</figcaption>
      </figure>
      <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
        <div className="labo-carte labo-momo-card">Momo</div>
        <figcaption style={legende}>--momo-field-border-radius</figcaption>
      </figure>
    </div>
  ),
};
