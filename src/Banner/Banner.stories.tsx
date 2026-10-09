import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusBanner } from './Banner';

const meta = {
  title: 'All Components/Banner',
  component: SiriusBanner,
  tags: ['autodocs'],
  // Pleine largeur : un Banner occupe toute la place de son parent, sauf
  // limite posée par l'écran qui l'utilise.
  parameters: { layout: 'padded' },
  args: { tone: 'critical', children: "Vérifie l'adresse de livraison" },
} satisfies Meta<typeof SiriusBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Un message posé dans la page, qui reste tant que la situation dure.
 * Pour une confirmation qui disparaît seule, ce n'est pas un Banner.
 */
export const Defaut: Story = {};

export const Tons: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <SiriusBanner tone="info">Ta boutique sera en ligne dès que ton domaine sera relié.</SiriusBanner>
      <SiriusBanner tone="success">Paiement de 25 000 FCFA reçu par Wave.</SiriusBanner>
      <SiriusBanner tone="warning">Ce produit n'a pas de photo.</SiriusBanner>
      <SiriusBanner tone="critical">Vérifie l'adresse de livraison</SiriusBanner>
    </div>
  ),
};

export const AvecTitre: Story = {
  args: {
    tone: 'warning',
    title: 'Stock bas',
    children: 'Il ne reste que 2 robes en wax taille M.',
  },
};

/** Réplique de la capture Shopify : titre, texte, une action. */
export const AvecAction: Story = {
  args: {
    tone: 'info',
    title: 'Gagne du temps avec les retours en libre-service',
    children: 'Tes clientes demandent un retour depuis leur compte, les règles de retour gèrent les conditions et les frais.',
    action: { content: 'Activer les retours' },
  },
};

export const ToutesLesActions: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['info', 'success', 'warning', 'critical'] as const).map((t) => (
        <SiriusBanner
          key={t}
          tone={t}
          title="Ce produit n'a pas de photo"
          action={{ content: 'Ajouter une photo' }}
          secondaryAction={{ content: 'Plus tard' }}
          onDismiss={() => {}}
        >
          Sans photo, il s'affiche mal sur ta boutique.
        </SiriusBanner>
      ))}
    </div>
  ),
};

export const AvecActions: Story = {
  args: {
    tone: 'warning',
    title: 'Ce produit n\'a pas de photo',
    children: 'Sans photo, il s\'affiche mal sur ta boutique.',
    action: { content: 'Ajouter une photo' },
    secondaryAction: { content: 'Plus tard' },
  },
};

export const Fermable: Story = {
  args: {
    tone: 'info',
    children: 'Nouveau : tu peux imprimer le bon de livraison depuis une commande.',
    onDismiss: () => {},
  },
};
