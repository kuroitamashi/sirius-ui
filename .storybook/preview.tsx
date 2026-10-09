import React, { StrictMode } from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';
import './preview.css';

/**
 * Les tailles d'ecran sur lesquelles Sen Kheweul Store doit tenir.
 * Le 360 x 740 n'est pas decoratif : c'est l'Android d'entree de gamme vise
 * par le principe « moins de 2s FCP en 3G ».
 */
const VIEWPORTS = {
  androidEntree: {
    name: 'Android entree de gamme',
    styles: { width: '360px', height: '740px' },
    type: 'mobile',
  },
  mobileLarge: {
    name: 'Mobile large',
    styles: { width: '414px', height: '896px' },
    type: 'mobile',
  },
  tablette: {
    name: 'Tablette',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet',
  },
  dashboard: {
    name: 'Dashboard',
    styles: { width: '1280px', height: '800px' },
    type: 'desktop',
  },
} as const;

/**
 * Superposition de grille. Polaris a ecrit un addon pour ca ; ici un
 * decorateur de 25 lignes suffit, sans dependance. La grille est en position
 * fixe pour couvrir tout le cadre de l'apercu, et ne capte aucun clic.
 */
const GRIDS = { '12': 12, '4': 4 } as const;

function GridOverlay({ columns }: { columns: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 16,
        padding: '0 16px',
        pointerEvents: 'none',
        zIndex: 2147483647,
      }}
    >
      {Array.from({ length: columns }, (_, i) => (
        <span key={i} style={{ background: 'rgba(215, 44, 13, 0.12)' }} />
      ))}
    </div>
  );
}

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    viewport: { options: VIEWPORTS },
    backgrounds: {
      options: {
        app: { name: 'Fond application', value: '#f6f6f7' },
        surface: { name: 'Surface carte', value: '#ffffff' },
        sombre: { name: 'Sombre neutre', value: '#0d0d0d' },
      },
    },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'fr-FR',
      },
    },
  },

  initialGlobals: {
    backgrounds: { value: 'app' },
    viewport: { value: undefined, isRotated: false },
    grid: 'off',
  },

  /**
   * Interrupteur React.StrictMode dans la barre d'outils. Actif par defaut :
   * StrictMode monte chaque composant deux fois en developpement et fait
   * ressortir les effets mal nettoyes avant qu'ils n'arrivent en production.
   */
  globalTypes: {
    grid: {
      description: 'Superposition de grille',
      toolbar: {
        title: 'Grille',
        icon: 'grid',
        items: [
          { value: 'off', title: 'Grille masquee' },
          { value: '12', title: '12 colonnes' },
          { value: '4', title: '4 colonnes (mobile)' },
        ],
        dynamicTitle: true,
      },
    },
    strictMode: {
      description: 'React.StrictMode',
      toolbar: {
        title: 'StrictMode',
        icon: 'beaker',
        items: [
          { value: 'on', title: 'StrictMode actif' },
          { value: 'off', title: 'StrictMode coupe' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const content = (
        <div
          style={{
            color: 'var(--sirius-text)',
            fontFamily: 'var(--sirius-font)',
            padding: 32,
            minWidth: 320,
          }}
        >
          <Story />
          {context.globals.grid !== 'off' && (
            <GridOverlay columns={GRIDS[context.globals.grid as keyof typeof GRIDS]} />
          )}
        </div>
      );
      return context.globals.strictMode === 'off' ? (
        content
      ) : (
        <StrictMode>{content}</StrictMode>
      );
    },
  ],
};

export default preview;
