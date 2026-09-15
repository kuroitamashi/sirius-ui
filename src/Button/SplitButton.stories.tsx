import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusSplitButton } from './SplitButton';

const meta = {
  title: 'All Components/SplitButton',
  component: SiriusSplitButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiriusSplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rendu identique à la capture d'écran de référence Shopify Polaris :
 * 1. Bouton noir Save avec chevron
 * 2. Bouton blanc Save avec chevron
 * 3. Déclinaison verte signature Sen-Kheweul Store
 */
export const PariteShopifyPolaris: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Bouton noir / tactile */}
      <SiriusSplitButton
        variant="secondary"
        primaryAction={{
          content: 'Save',
          onAction: () => alert('Save cliqué (Noir)'),
        }}
        actions={[
          { content: 'Save and continue editing', onAction: () => alert('Save & continue') },
          { content: 'Save as draft', onAction: () => alert('Save as draft') },
          { content: 'Duplicate product', onAction: () => alert('Duplicate') },
        ]}
      />

      {/* Bouton blanc par défaut */}
      <SiriusSplitButton
        variant="default"
        primaryAction={{
          content: 'Save',
          onAction: () => alert('Save cliqué (Blanc)'),
        }}
        actions={[
          { content: 'Save and continue editing', onAction: () => alert('Save & continue') },
          { content: 'Save as draft', onAction: () => alert('Save as draft') },
          { content: 'Duplicate product', onAction: () => alert('Duplicate') },
        ]}
      />

      {/* Bouton vert SKS signature */}
      <SiriusSplitButton
        variant="primary"
        primaryAction={{
          content: 'Enregistrer',
          onAction: () => alert('Enregistrer cliqué (Vert SKS)'),
        }}
        actions={[
          { content: 'Enregistrer et publier', onAction: () => alert('Publier') },
          { content: 'Enregistrer comme brouillon', onAction: () => alert('Brouillon') },
          { content: 'Archiver', onAction: () => alert('Archiver'), destructive: true },
        ]}
      />
    </div>
  ),
};

export const Tailles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <SiriusSplitButton
        size="slim"
        variant="secondary"
        primaryAction={{ content: 'Slim Save' }}
        actions={[{ content: 'Option A' }, { content: 'Option B' }]}
      />
      <SiriusSplitButton
        size="medium"
        variant="secondary"
        primaryAction={{ content: 'Medium Save' }}
        actions={[{ content: 'Option A' }, { content: 'Option B' }]}
      />
      <SiriusSplitButton
        size="large"
        variant="secondary"
        primaryAction={{ content: 'Large Save' }}
        actions={[{ content: 'Option A' }, { content: 'Option B' }]}
      />
    </div>
  ),
};

export const Etats: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <SiriusSplitButton
        variant="secondary"
        disabled
        primaryAction={{ content: 'Désactivé' }}
      />
      <SiriusSplitButton
        variant="primary"
        loading
        primaryAction={{ content: 'Chargement...' }}
      />
    </div>
  ),
};
