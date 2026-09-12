import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusBadge } from './Badge';

const meta = {
  title: 'Statut/Badge',
  component: SiriusBadge,
  tags: ['autodocs'],
  args: { children: 'Payee' },
} satisfies Meta<typeof SiriusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

export const Tons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(
        ['neutral', 'info', 'success', 'attention', 'warning', 'critical', 'subdued'] as const
      ).map((t) => (
        <SiriusBadge key={t} tone={t}>
          {t}
        </SiriusBadge>
      ))}
    </div>
  ),
};

/**
 * Les tons de paiement sont propres a Sen Kheweul Store : ils n'existent dans
 * aucun design system generique. Awa reconnait le mode de paiement a la
 * couleur, sans lire.
 */
export const Paiements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <SiriusBadge tone="wave">Wave</SiriusBadge>
      <SiriusBadge tone="orange_money">Orange Money</SiriusBadge>
      <SiriusBadge tone="cash_on_delivery">Especes</SiriusBadge>
    </div>
  ),
};

/**
 * `kind` traduit un identifiant technique en libelle francais tout seul :
 * `kind="payee"` affiche « Payee », `kind="a_traiter"` affiche « A traiter ».
 */
export const LibelleAutomatique: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['payee', 'en_attente', 'a_traiter', 'expediee', 'livree', 'annulee', 'rupture'].map(
        (k) => (
          <SiriusBadge key={k} kind={k} />
        )
      )}
    </div>
  ),
};

export const AvecPastille: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <SiriusBadge tone="success" pip="filled">
        En ligne
      </SiriusBadge>
      <SiriusBadge tone="attention" pip="hollow">
        Brouillon
      </SiriusBadge>
      <SiriusBadge tone="critical" pip="slashed">
        Suspendu
      </SiriusBadge>
    </div>
  ),
};

export const Fort: Story = {
  args: { tone: 'success', variant: 'strong' },
};
