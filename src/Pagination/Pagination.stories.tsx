import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SiriusPagination } from './Pagination';

const meta: Meta<typeof SiriusPagination> = {
  title: 'All Components/Pagination',
  component: SiriusPagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composant de pagination 1:1 conforme au standard Shopify Polaris, permettant de naviguer entre différentes pages avec ou sans libellé, et en mode table.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SiriusPagination>;

/**
 * 1. Default (Cas 1 de la capture Shopify Polaris) :
 * Contrôle segmenté compact [ < | > ] avec état désactivé / actif.
 */
export const Default: Story = {
  render: () => {
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(true);

    return (
      <SiriusPagination
        hasPrevious={hasPrev}
        hasNext={hasNext}
        onPrevious={() => {
          setHasPrev(false);
          setHasNext(true);
        }}
        onNext={() => {
          setHasPrev(true);
          setHasNext(false);
        }}
      />
    );
  },
};

/**
 * 2. With Keyboard Navigation (Cas 2 de la capture Shopify Polaris) :
 * Navigation au clavier via flèches gauche / droite (ArrowLeft / ArrowRight) ou touches j / k.
 */
export const WithKeyboardNavigation: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    const maxPages = 5;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '13px', color: '#6d7175', margin: 0 }}>
          Utilisez les touches <strong>Flèche gauche</strong> (ou <strong>j</strong>) et <strong>Flèche droite</strong> (ou <strong>k</strong>) pour naviguer. Page actuelle : {page}/{maxPages}
        </p>
        <SiriusPagination
          hasPrevious={page > 1}
          hasNext={page < maxPages}
          previousKeys={['ArrowLeft', 'j']}
          nextKeys={['ArrowRight', 'k']}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(maxPages, p + 1))}
        />
      </div>
    );
  },
};

/**
 * 3. With Label (Cas 3 de la capture Shopify Polaris) :
 * Affiche deux boutons arrondis distincts avec un texte de libellé au milieu (« Results »).
 */
export const WithLabel: Story = {
  render: () => {
    const [hasPrev, setHasPrev] = useState(true);
    const [hasNext, setHasNext] = useState(true);

    return (
      <SiriusPagination
        label="Results"
        hasPrevious={hasPrev}
        hasNext={hasNext}
        onPrevious={() => console.log('Previous clicked')}
        onNext={() => console.log('Next clicked')}
      />
    );
  },
};

/**
 * 4. With Table Type (Cas 4 de la capture Shopify Polaris) :
 * Bandeau de pied de tableau pleine largeur avec libellé (« 1-50 of 8,450 orders »).
 */
export const WithTableType: Story = {
  render: () => {
    const [start, setStart] = useState(1);
    const pageSize = 50;
    const total = 8450;
    const end = Math.min(start + pageSize - 1, total);

    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', border: '1px solid #e1e3e5', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', backgroundColor: '#ffffff', minHeight: '120px' }}>
          <p style={{ margin: 0, color: '#6d7175', fontSize: '13px' }}>Contenu de la table de commandes...</p>
        </div>
        <SiriusPagination
          type="table"
          label={`${start}-${end} of ${total.toLocaleString('en-US')} orders`}
          hasPrevious={start > 1}
          hasNext={end < total}
          onPrevious={() => setStart((s) => Math.max(1, s - pageSize))}
          onNext={() => setStart((s) => s + pageSize)}
        />
      </div>
    );
  },
};

/**
 * 5. With Table Type And No Label (Cas 5 de la capture Shopify Polaris) :
 * Bandeau de pied de tableau pleine largeur centrant le contrôle segmenté sans texte.
 */
export const WithTableTypeAndNoLabel: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = 4;

    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', border: '1px solid #e1e3e5', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', backgroundColor: '#ffffff', minHeight: '120px' }}>
          <p style={{ margin: 0, color: '#6d7175', fontSize: '13px' }}>Tableau sans libellé de pagination (Page {page}/{totalPages})</p>
        </div>
        <SiriusPagination
          type="table"
          hasPrevious={page > 1}
          hasNext={page < totalPages}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    );
  },
};
