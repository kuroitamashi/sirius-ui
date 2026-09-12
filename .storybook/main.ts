import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  framework: '@storybook/react-vite',
  // Panneau d'accessibilite : compte les violations axe sur chaque histoire.
  // Le zoom, le plein ecran, le lien direct et le selecteur de viewport sont
  // deja dans le coeur de Storybook 10, aucun addon a ajouter pour eux.
  addons: ['@storybook/addon-a11y'],
  // Aucune donnee d'usage n'est envoyee a Storybook.
  core: { disableTelemetry: true },
  // Les tableaux de props sont lus dans les interfaces TypeScript des
  // composants. Rien ne se recopie a la main : un prop qui change met la
  // documentation a jour tout seul.
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
