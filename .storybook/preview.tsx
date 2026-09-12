import React, { StrictMode } from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

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
        order: ['Actions', 'Statut', 'Structure', 'Formulaires', 'Donnees'],
      },
    },
  },

  initialGlobals: {
    backgrounds: { value: 'app' },
    viewport: { value: undefined, isRotated: false },
  },

  /**
   * Interrupteur React.StrictMode dans la barre d'outils. Actif par defaut :
   * StrictMode monte chaque composant deux fois en developpement et fait
   * ressortir les effets mal nettoyes avant qu'ils n'arrivent en production.
   */
  globalTypes: {
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
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            padding: 32,
            minWidth: 320,
          }}
        >
          <Story />
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
