import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusAccountConnection } from './AccountConnection';
import { SiriusBadge } from '../Badge/Badge';

const meta = {
  title: 'Structure/AccountConnection',
  component: SiriusAccountConnection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiriusAccountConnection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Vue d'ensemble avec les deux états côte à côte (Non connecté et Connecté),
 * exactement comme la vue "All" de Shopify Polaris.
 */
export const TousLesCas: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 600 }}>
          Default (Non connecté)
        </h3>
        <SiriusAccountConnection
          title="Example App"
          details="No account connected"
          connected={false}
          action={{
            text: 'Connect',
            onAction: () => alert('Action Connect déclenchée'),
          }}
          termsOfService={
            <span>
              By clicking Connect, you agree to accept Sample App's{' '}
              <a href="#terms">terms and conditions</a>. You'll pay a commission rate of
              15% on sales made through Sample App.
            </span>
          }
        />
      </div>

      <div>
        <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 600 }}>
          With account connected
        </h3>
        <SiriusAccountConnection
          accountName="Example App"
          avatarInitials="OE"
          details="Account connected"
          connected={true}
          action={{
            text: 'Disconnect',
            onAction: () => alert('Action Disconnect déclenchée'),
          }}
        />
      </div>
    </div>
  ),
};

/**
 * État par défaut : compte non connecté avec conditions d'utilisation.
 */
export const Defaut: Story = {
  args: {
    title: 'Example App',
    details: 'No account connected',
    connected: false,
    action: {
      text: 'Connect',
    },
    termsOfService: (
      <span>
        By clicking Connect, you agree to accept Sample App's{' '}
        <a href="#terms">terms and conditions</a>. You'll pay a commission rate of
        15% on sales made through Sample App.
      </span>
    ),
  },
};

/**
 * État connecté avec avatar à initiales et bouton de déconnexion.
 */
export const AvecCompteConnecte: Story = {
  args: {
    accountName: 'Example App',
    avatarInitials: 'OE',
    details: 'Account connected',
    connected: true,
    action: {
      text: 'Disconnect',
    },
  },
};

/**
 * Exemple e-commerce Sénégal : Intégration Wave Business.
 */
export const WaveBusiness: Story = {
  args: {
    accountName: 'Wave Business Sénégal',
    details: 'Compte marchand lié : +221 77 123 45 67 (Paiements instantanés 1%)',
    connected: true,
    avatarColor: '#00b2fe',
    badge: <SiriusBadge tone="wave">Actif</SiriusBadge>,
    action: {
      text: 'Gérer la connexion',
    },
    termsOfService: (
      <span>
        Les paiements reçus via Wave sont reversés directement sur votre compte marchand.{' '}
        <a href="#wave">Voir le barème et la grille tarifaire</a>.
      </span>
    ),
  },
};

/**
 * Exemple e-commerce Sénégal : Intégration Orange Money Pro.
 */
export const OrangeMoneyPro: Story = {
  args: {
    accountName: 'Orange Money Pro',
    details: 'Marchand OM #884920 - Synchronisation des encaissements active',
    connected: true,
    avatarColor: '#ff6600',
    badge: <SiriusBadge tone="orange_money">Actif</SiriusBadge>,
    action: {
      text: 'Déconnecter',
      destructive: true,
    },
  },
};

/**
 * Démonstration interactive avec bascule en temps réel (Connect / Disconnect).
 */
export const Interactif: Story = {
  render: function InteractiveDemo() {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggle = () => {
      setLoading(true);
      setTimeout(() => {
        setConnected((prev) => !prev);
        setLoading(false);
      }, 500);
    };

    return (
      <SiriusAccountConnection
        accountName="Boutique PayTech Sénégal"
        avatarInitials="PT"
        avatarColor="#00824c"
        details={
          connected
            ? 'Connecté en tant que contact@sen-kheweul.sn'
            : 'Aucun compte associé à cette boutique'
        }
        connected={connected}
        badge={
          connected ? (
            <SiriusBadge tone="success">Connecté</SiriusBadge>
          ) : (
            <SiriusBadge tone="attention">Non configuré</SiriusBadge>
          )
        }
        action={{
          text: connected ? 'Déconnecter' : 'Connecter le compte',
          onAction: handleToggle,
          loading,
        }}
        termsOfService={
          <span>
            En connectant votre passerelle de paiement, vous acceptez les{' '}
            <a href="#cgu">conditions générales d'utilisation</a>.
          </span>
        }
      />
    );
  },
};
