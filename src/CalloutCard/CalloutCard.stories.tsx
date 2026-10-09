import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusCalloutCard } from './CalloutCard';
import { SiriusBadge } from '../Badge/Badge';
import { SiriusButton } from '../Button/Button';

/* Illustrations de démonstration, dessinées pour ces histoires.
   En production, l'écran passe l'adresse de sa propre image. */
const svg = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`;

const BOUTIQUE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="54" cy="52" r="40" fill="#e9f7ee"/>
  <rect x="20" y="40" width="58" height="44" rx="4" fill="#fff" stroke="#1f2a24" stroke-width="2"/>
  <path d="M16 40h66l-6-16H22z" fill="#00703f" stroke="#1f2a24" stroke-width="2" stroke-linejoin="round"/>
  <path d="M30 24l-3 16M41 24l-1 16M52 24l1 16M63 24l3 16" stroke="#fff" stroke-width="3"/>
  <rect x="28" y="56" width="16" height="28" rx="2" fill="#f5d9a8" stroke="#1f2a24" stroke-width="2"/>
  <rect x="51" y="54" width="19" height="14" rx="2" fill="#e9f7ee" stroke="#1f2a24" stroke-width="2"/>
  <circle cx="79" cy="26" r="13" fill="#fff" stroke="#1f2a24" stroke-width="2" stroke-dasharray="4 3"/>
  <path d="M79 20v12M73 26h12" stroke="#00703f" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

/* Étoile à cinq branches centrée sur (cx, cy) */
const etoile = (cx: number, cy: number, fill: string) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 2.6 : 6.2;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke-linejoin="round"/>`;
};

const AVIS = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="52" r="40" fill="#e9f7ee"/>
  <path d="M14 24a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H34l-12 10v-10a8 8 0 0 1-8-8z" fill="#fff" stroke="#1f2a24" stroke-width="2" stroke-linejoin="round"/>
  ${etoile(28, 35, '#f5b83d')}${etoile(42, 35, '#f5b83d')}${etoile(56, 35, '#e5e7e9')}
  <path d="M40 62a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-2v9l-11-9H48a8 8 0 0 1-8-8z" fill="#00703f" stroke="#1f2a24" stroke-width="2" stroke-linejoin="round"/>
  <path d="M64 63.5c-1.6-2.8-6.4-2.1-6.4 1.5 0 3.1 6.4 7 6.4 7s6.4-3.9 6.4-7c0-3.6-4.8-4.3-6.4-1.5z" fill="#fff"/>
</svg>`);

const meta = {
  title: 'All Components/CalloutCard',
  component: SiriusCalloutCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Ajoute ton logo',
    illustration: BOUTIQUE,
    children: 'Tes clientes reconnaîtront ta boutique du premier coup d’œil, sur la vitrine comme sur leurs reçus.',
    primaryAction: { content: 'Ajouter mon logo' },
  },
} satisfies Meta<typeof SiriusCalloutCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Une invitation posée dans une page, souvent les réglages, pour pousser le
 * marchand vers une fonction qu'il n'utilise pas encore.
 */
export const Defaut: Story = {};

export const AvecActionSecondaire: Story = {
  args: {
    title: 'Accepte le paiement à la livraison',
    children: 'À Dakar, une cliente sur deux préfère payer en main propre. Moussa a vendu 12 robes en wax de plus le premier mois.',
    primaryAction: { content: 'Activer le paiement à la livraison' },
    secondaryAction: { content: 'Comment ça marche' },
  },
};

/**
 * Fermable. Le composant ne retient rien : c'est l'écran qui mémorise la
 * fermeture, pour que la carte ne revienne pas.
 */
export const Fermable: Story = {
  render: (args) => {
    const [fermee, setFermee] = useState(false);
    if (fermee) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--sirius-text-subdued)' }}>
          Carte fermée, elle ne reviendra pas.
          <SiriusButton onClick={() => setFermee(false)}>Réafficher (démo)</SiriusButton>
        </div>
      );
    }
    return <SiriusCalloutCard {...args} onDismiss={() => setFermee(true)} />;
  },
};

export const TitrePersonnalise: Story = {
  args: {
    title: (
      <>
        Vends sur WhatsApp
        <SiriusBadge tone="new">Nouveau</SiriusBadge>
      </>
    ),
    children: 'Partage ton catalogue dans tes groupes : chaque robe en wax arrive avec sa photo et son prix, 15 000 FCFA, prête à commander.',
    primaryAction: { content: 'Partager mon catalogue' },
  },
};

/**
 * La carte qui demande un avis. Un clic remplace la question par un merci :
 * la cliente voit que sa réponse a été prise, sans fenêtre en plus.
 */
export const AvecActionsIconees: Story = {
  render: (args) => {
    const [avis, setAvis] = useState<'bien' | 'pas-terrain' | null>(null);
    if (avis) {
      return (
        <SiriusCalloutCard
          {...args}
          title="Merci, c'est noté"
          primaryAction={undefined}
          secondaryAction={undefined}
          onDismiss={() => setAvis(null)}
        >
          {avis === 'bien'
            ? 'Ça nous fait plaisir. On continue sur cette lancée.'
            : 'On t’appelle dans la semaine pour comprendre ce qui coince.'}
        </SiriusCalloutCard>
      );
    }
    return (
      <SiriusCalloutCard
        {...args}
        primaryAction={{ content: 'Bien', icon: 'smiley-happy', onAction: () => setAvis('bien') }}
        secondaryAction={{ content: 'Pas terrain', icon: 'smiley-sad', variant: 'default', onAction: () => setAvis('pas-terrain') }}
      />
    );
  },
  args: {
    title: 'Dis-nous comment ça se passe',
    children: 'Tu aimes Sen Kheweul Store ?',
    illustration: AVIS,
  },
};

/** Dans une colonne étroite, l'illustration s'efface pour laisser le texte respirer. */
export const ColonneEtroite: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <SiriusCalloutCard {...args} onDismiss={() => {}} />
    </div>
  ),
};
