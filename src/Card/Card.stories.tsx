import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusCard, SiriusCardSection } from './Card';
import { SiriusButton } from '../Button/Button';
import { SiriusBadge } from '../Badge/Badge';

const meta = {
  title: 'All Components/Card',
  component: SiriusCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiriusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * État par défaut identique à Polaris : carte épurée avec titre et description.
 */
export const Defaut: Story = {
  args: {
    title: 'Online store dashboard',
    children: "View a summary of your online store's performance.",
  },
};

/**
 * Carte avec actions dans l'en-tête (ex: "+ Add variant" aligné à droite).
 */
export const AvecActionEnTete: Story = {
  args: {
    title: 'Variants',
    children:
      'Add variants if this product comes in multiple versions, like different sizes or colors.',
    action: (
      <SiriusButton variant="secondary" size="slim" icon="plus">
        Add variant
      </SiriusButton>
    ),
  },
};

/**
 * Découpage avec section atténuée (subdued) pour reléguer les éléments inactifs
 * ou secondaires sur un fond gris très lisible.
 */
export const AvecSectionAttenuee: Story = {
  render: () => (
    <SiriusCard padded={false}>
      <SiriusCardSection title="Staff accounts">
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
          <li>Felix Crafford</li>
          <li>Ezequiel Manno</li>
        </ul>
      </SiriusCardSection>

      <SiriusCardSection title="Deactivated staff accounts" subdued={true}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6, color: 'var(--sirius-text-subdued)' }}>
          <li>Felix Crafford</li>
          <li>Ezequiel Manno</li>
        </ul>
      </SiriusCardSection>
    </SiriusCard>
  ),
};

/**
 * Carte avec actions de pied de page (primaryFooterAction et secondaryFooterActions).
 */
export const AvecActionsPiedDePage: Story = {
  args: {
    title: 'Shipment 1234',
    children: (
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Items</div>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
          <li>1 × Oasis Glass, 4-Pack</li>
          <li>1 × Anubis Cup, 2-Pack</li>
        </ul>
      </div>
    ),
    secondaryFooterActions: [
      {
        text: 'Fulfill items',
        onAction: () => alert('Fulfill items cliqué'),
      },
    ],
    primaryFooterAction: {
      text: '+ Create shipping label',
      onAction: () => alert('Create shipping label cliqué'),
    },
  },
};

/**
 * Carte complète combinant tous les éléments : En-tête avec actions multiples,
 * sections normales et atténuées, et pied de page avec actions.
 */
export const AvecTousLesElements: Story = {
  render: () => (
    <SiriusCard
      title="Sales"
      subtitle="You can use sales reports to see information about your customers' orders based on criteria such as sales over time, by channel, or by staff."
      actions={
        <div style={{ display: 'flex', gap: 6 }}>
          <SiriusButton variant="plain" size="slim">
            Total Sales
          </SiriusButton>
          <SiriusButton variant="plain" size="slim" disclosure>
            View Sales
          </SiriusButton>
        </div>
      }
      padded={false}
      secondaryFooterActions={[
        { text: 'Dismiss' },
      ]}
      primaryFooterAction={{
        text: 'Export Report',
      }}
    >
      <SiriusCardSection title="Total Sales Breakdown">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span>Orders</span>
          <span style={{ fontWeight: 600 }}>USD$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span>Returns</span>
          <span style={{ color: 'var(--sirius-critical)', fontWeight: 600 }}>-USD$250.00</span>
        </div>
      </SiriusCardSection>

      <SiriusCardSection title="Deactivated reports" subdued={true}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6, color: 'var(--sirius-text-subdued)' }}>
          <li>Payouts</li>
          <li>Total Sales By Channel</li>
        </ul>
      </SiriusCardSection>

      <SiriusCardSection>
        <div style={{ fontSize: '13px', color: 'var(--sirius-text-subdued)' }}>
          <strong style={{ color: 'var(--sirius-text)' }}>Note :</strong> The sales reports are available only if your store is on the Shopify plan or higher.
        </div>
      </SiriusCardSection>
    </SiriusCard>
  ),
};

/**
 * Exemple réel Sen Kheweul Store : Gestion d'une commande locale à Dakar.
 */
export const CommandeSenegal: Story = {
  render: () => (
    <SiriusCard
      title="Expédition #SKS-1042"
      subtitle="Destination : Almadies, Dakar • Livreur : Moussa Ndiaye (+221 77 123 45 67)"
      actions={<SiriusBadge tone="wave">Payé via Wave</SiriusBadge>}
      padded={false}
      secondaryFooterActions={[
        { text: 'Imprimer le bordereau' },
        { text: 'Contacter le client' },
      ]}
      primaryFooterAction={{
        text: 'Confirmer la livraison',
      }}
    >
      <SiriusCardSection title="Articles à livrer">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
          <span>2 × Masque LED Thérapeutique</span>
          <span style={{ fontWeight: 600 }}>29 800 FCFA</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
          <span>Frais de livraison (Zone Almadies)</span>
          <span style={{ fontWeight: 600 }}>2 000 FCFA</span>
        </div>
      </SiriusCardSection>

      <SiriusCardSection title="Instructions de remise" subdued={true}>
        <div style={{ fontSize: '13px', color: 'var(--sirius-text-subdued)' }}>
          Appeler à l'arrivée devant l'immeuble Résidence Turquoise. Paiement déjà validé, aucune somme à percevoir.
        </div>
      </SiriusCardSection>
    </SiriusCard>
  ),
};
