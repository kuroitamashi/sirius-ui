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
 * Cas 1 : ActionList dans un Popover simple avec bouton Sirius et disclosure natif.
 */
export const InAPopover: Story = {
  args: {
    trigger: (
      <SiriusButton variant="default" disclosure>
        More actions
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
 * Cas 2 : Avec les vraies icônes Sirius (duplicate, archive).
 */
export const WithIconsOrImage: Story = {
  args: {
    trigger: (
      <SiriusButton variant="default" disclosure>
        More actions
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
 * Cas 3 : Avec icônes Sirius, suffixe de sélection (coche 'check') et élément désactivé.
 */
export const WithAnIconAndASuffix: Story = {
  args: {
    trigger: (
      <SiriusButton variant="default" disclosure>
        More actions
      </SiriusButton>
    ),
    items: [
      {
        icon: 'import',
        content: 'Import file',
        suffix: 'check',
      },
      {
        icon: 'export',
        content: 'Export file',
      },
      {
        icon: 'blog',
        content: 'Manage your blog articles',
        suffix: 'check',
      },
      {
        icon: 'upload',
        content: 'Manage uploaded...',
        suffix: 'check',
      },
      {
        icon: 'import',
        content: 'Disable file',
        disabled: true,
        suffix: 'check',
      },
    ],
  },
};

/**
 * Cas 4 : Organisé en sections avec titres, icônes Sirius et élément destructeur (Delete).
 */
export const WithSectionsAndDestructive: Story = {
  args: {
    trigger: (
      <SiriusButton variant="default" disclosure>
        More actions
      </SiriusButton>
    ),
    sections: [
      {
        title: 'File options',
        items: [
          { icon: 'import', content: 'Import file' },
          { icon: 'export', content: 'Export file' },
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
 * Cas 5 : Avec texte d'aide explicatif sous chaque libellé et état actif avec icônes Sirius.
 */
export const WithHelpText: Story = {
  args: {
    trigger: (
      <SiriusButton variant="default" disclosure>
        More actions
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
        icon: 'blog',
        content: 'Active blogs',
        helpText: 'This is helpful text',
        active: true,
        suffix: 'check',
      },
      {
        icon: 'blog',
        content: 'Disabled blogs',
        helpText: 'This is also helpful text',
        disabled: true,
        suffix: 'check',
      },
    ],
  },
};

/**
 * Cas 6 : Menu contextuel marchand Sen Kheweul Store (Commandes & Paiements avec icônes Sirius).
 */
export const ActionsCommandesSKS: Story = {
  args: {
    trigger: (
      <SiriusButton variant="default" disclosure>
        Actions commande
      </SiriusButton>
    ),
    sections: [
      {
        items: [
          { icon: 'duplicate', content: 'Dupliquer' },
          { icon: 'archive', content: 'Archiver' },
          { icon: 'download', content: 'Télécharger la facture PDF' },
        ],
      },
      {
        title: 'Livraison',
        items: [{ icon: 'delivery', content: 'Assigner à un livreur' }],
      },
      {
        title: 'Imprimer',
        items: [
          { icon: 'print', content: 'Imprimer la commande' },
          { icon: 'print', content: 'Imprimer le bon de livraison' },
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
