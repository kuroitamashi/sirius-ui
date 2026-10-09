import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/* Banc d'essai : deux cartes nues, sans border ni arrondi, pour comparer
   les ombres seules. --s-shadow-100 vient de tokens.css. La « Home card »
   reprend les variables relevées sur la carte de l'accueil de référence
   (._HoverTarget), définies ici le temps de l'essai. La carte Momo prend le
   rayon du champ Sidekick. */
const CSS = `
.labo-carte {
  width: 320px;
  height: 200px;
  background: #ffffff;
}
.labo-home-card {
  --card-expand-duration: .35s;
  --card-expand-ease: cubic-bezier(.34, 1.8, .64, 1);
  --card-content-ease: cubic-bezier(.25, .46, .45, .94);
  --card-removal-duration: .4s;
  --card-shadow: 0 .5625rem .625rem -.5rem #00000021, 0 -.125rem .25rem #ffffff80, 0 .125rem .0625rem -.0625rem #0000000d, 0 0 0 .0625rem #00000012;
  --card-hover-shadow: 0 1.5rem 1.5rem -.625rem #00000040, 0 .1875rem .1875rem -.09375rem #00000005, 0 .125rem .125rem -.0625rem #00000005, 0 0 0 .0625rem #0000000f;
  position: relative;
  width: 100%;
  box-shadow: var(--card-shadow);
  transition: box-shadow var(--card-expand-duration) var(--card-content-ease);
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
  box-shadow: var(--card-hover-shadow);
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
        <div className="labo-carte labo-home-card">Home card</div>
        <figcaption style={legende}>--card-shadow, --card-hover-shadow au survol</figcaption>
      </figure>
      <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
        <div className="labo-carte labo-momo-card">Momo</div>
        <figcaption style={legende}>--momo-field-border-radius</figcaption>
      </figure>
    </div>
  ),
};
