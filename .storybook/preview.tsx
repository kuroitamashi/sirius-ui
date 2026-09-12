import React from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    options: {
      storySort: {
        order: ['Sirius UI', ['Introduction'], 'Actions', 'Statut', 'Structure', 'Formulaires', 'Donnees'],
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'var(--sirius-bg-app)',
          color: 'var(--sirius-text)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          padding: 32,
          minWidth: 320,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
