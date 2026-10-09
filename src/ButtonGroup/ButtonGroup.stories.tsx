import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusButtonGroup } from './ButtonGroup';
import { SiriusButton } from '../Button/Button';
import { SiriusSplitButton } from '../Button/SplitButton';

const meta = {
  title: 'All Components/ButtonGroup',
  component: SiriusButtonGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiriusButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParDefaut: Story = {
  render: () => (
    <SiriusButtonGroup>
      <SiriusButton variant="default">Annuler</SiriusButton>
      <SiriusButton variant="primary">Enregistrer</SiriusButton>
    </SiriusButtonGroup>
  ),
};

export const Segmented: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--sirius-text-subdued)' }}>
        Boutons groupés segmentés (connectés sans espacement) :
      </p>
      <SiriusButtonGroup variant="segmented">
        <SiriusButton variant="default">Jour</SiriusButton>
        <SiriusButton variant="default">Semaine</SiriusButton>
        <SiriusButton variant="default">Mois</SiriusButton>
        <SiriusButton variant="default">Année</SiriusButton>
      </SiriusButtonGroup>

      <SiriusButtonGroup variant="segmented">
        <SiriusButton variant="default">Vue liste</SiriusButton>
        <SiriusButton variant="default">Vue grille</SiriusButton>
      </SiriusButtonGroup>
    </div>
  ),
};

export const SplitDansButtonGroup: Story = {
  render: () => (
    <SiriusButtonGroup>
      <SiriusButton variant="default">Prévisualiser</SiriusButton>
      <SiriusSplitButton
        variant="primary"
        primaryAction={{ content: 'Publier', onAction: () => alert('Publié') }}
        actions={[
          { content: 'Enregistrer comme brouillon', onAction: () => alert('Brouillon') },
          { content: 'Planifier la publication', onAction: () => alert('Planifier') },
        ]}
      />
    </SiriusButtonGroup>
  ),
};
