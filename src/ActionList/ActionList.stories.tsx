import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusActionList } from './ActionList';
import { SiriusButton } from '../Button/Button';

const meta = {
  title: 'All Components/ActionList',
  component: SiriusActionList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiriusActionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cas 1 : ActionList dans un Popover simple (déclencheur "More actions ▾").
 */
export const InAPopover: Story = {
  args: {
    trigger: (
      <SiriusButton variant="secondary">
        More actions ▾
      </SiriusButton>
    ),
    items: [
      {
        content: 'Import file',
        onAction: () => alert('Import file cliqué'),
      },
      {
        content: 'Export file',
        onAction: () => alert('Export file cliqué'),
      },
    ],
  },
};

/**
 * Cas 2 : Avec icônes illustrant chaque action (Duplicate, Archive).
 */
export const WithIconsOrImage: Story = {
  args: {
    trigger: (
      <SiriusButton variant="secondary">
        More actions ▾
      </SiriusButton>
    ),
    items: [
      {
        icon: 'duplicate',
        content: 'Duplicate',
        onAction: () => alert('Duplicate cliqué'),
      },
      {
        icon: 'archive',
        content: 'Archive',
        onAction: () => alert('Archive cliqué'),
      },
    ],
  },
};

/**
 * Cas 3 : Avec icônes, suffixe de sélection (coche 'check') et élément désactivé.
 */
export const WithAnIconAndASuffix: Story = {
  args: {
    trigger: (
      <SiriusButton variant="secondary">
        More actions ▾
      </SiriusButton>
    ),
    items: [
      {
        icon: 'upload',
        content: 'Import file',
        suffix: 'check',
      },
      {
        icon: 'arrow-up',
        content: 'Export file',
      },
      {
        icon: 'upload',
        content: 'Manage your blog articles',
        suffix: 'check',
      },
      {
        icon: 'upload',
        content: 'Manage uploaded...',
        suffix: 'check',
      },
      {
        icon: 'upload',
        content: 'Disable file',
        disabled: true,
        suffix: 'check',
      },
    ],
  },
};

/**
 * Cas 4 : Organisé en sections avec titre et élément destructeur (Delete en rouge).
 */
export const WithSectionsAndDestructive: Story = {
  args: {
    trigger: (
      <SiriusButton variant="secondary">
        More actions ▾
      </SiriusButton>
    ),
    sections: [
      {
        title: 'File options',
        items: [
          { icon: 'upload', content: 'Import file' },
          { icon: 'arrow-up', content: 'Export file' },
        ],
      },
      {
        title: 'Bulk actions',
        items: [
          { icon: 'edit', content: 'Edit' },
          { icon: 'delete', content: 'Delete', destructive: true },
        ],
      },
      {
        title: 'More options',
        items: [
          {
            icon: 'person',
            content: 'Manage several customers at once with a CSV file imp...',
          },
        ],
      },
    ],
  },
};

/**
 * Cas 5 : Avec texte d'aide explicatif sous chaque libellé et état actif.
 */
export const WithHelpText: Story = {
  args: {
    trigger: (
      <SiriusButton variant="secondary">
        More actions ▾
      </SiriusButton>
    ),
    items: [
      {
        content: 'Blog posts',
        helpText: 'Manage your blog articles',
      },
      {
        content: 'Blogs',
        helpText: 'Manage blogs published to your Online Store',
      },
      {
        icon: 'upload',
        content: 'Active blogs',
        helpText: 'This is helpful text',
        active: true,
        suffix: 'check',
      },
      {
        icon: 'upload',
        content: 'Disabled blogs',
        helpText: 'This is also helpful text',
        disabled: true,
        suffix: 'check',
      },
    ],
  },
};

/**
 * Cas 6 : Menu contextuel marchand Sen Kheweul Store (Commandes & Paiements).
 */
export const ActionsCommandesSKS: Story = {
  args: {
    trigger: (
      <SiriusButton variant="secondary">
        Actions commande ▾
      </SiriusButton>
    ),
    sections: [
      {
        title: 'Finances & Reçus',
        items: [
          {
            icon: 'payment',
            content: 'Vérifier la transaction Wave',
            helpText: 'Synchronisation instantanée avec le compte marchand',
          },
          {
            icon: 'arrow-up',
            content: 'Télécharger la facture PDF',
          },
        ],
      },
      {
        title: 'Livraison Dakar',
        items: [
          {
            icon: 'delivery',
            content: 'Assigner au livreur Tiak-Tiak',
          },
          {
            icon: 'check',
            content: 'Marquer comme livrée',
            suffix: 'check',
          },
        ],
      },
      {
        title: 'Gestion des litiges',
        items: [
          {
            icon: 'delete',
            content: 'Annuler et rembourser la commande',
            destructive: true,
          },
        ],
      },
    ],
  },
};
