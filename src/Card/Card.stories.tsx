import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusCard, SiriusCardSection } from './Card';
import { SiriusButton } from '../Button/Button';

const meta = {
  title: 'All Components/Card',
  component: SiriusCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Informations produit',
    children: 'Masque LED, 14 900 FCFA, 12 en stock.',
  },
} satisfies Meta<typeof SiriusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

export const AvecSousTitre: Story = {
  args: { subtitle: 'Derniere modification il y a 3 minutes' },
};

export const AvecAction: Story = {
  args: {
    action: <SiriusButton variant="plain">Modifier</SiriusButton>,
  },
};

export const AvecPiedDePage: Story = {
  args: {
    footer: (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <SiriusButton variant="secondary">Annuler</SiriusButton>
        <SiriusButton variant="primary">Enregistrer</SiriusButton>
      </div>
    ),
  },
};

export const Attenue: Story = {
  args: { subdued: true },
};

/**
 * `padded={false}` retire la marge interieure pour coller un tableau ou une
 * liste bord a bord. Les sections se separent alors avec SiriusCardSection.
 */
export const SansMargeInterieure: Story = {
  args: {
    padded: false,
    children: (
      <>
        <SiriusCardSection>Commande 1042, Awa Diop, 24 000 FCFA</SiriusCardSection>
        <SiriusCardSection>Commande 1043, Modou Fall, 8 500 FCFA</SiriusCardSection>
      </>
    ),
  },
};
