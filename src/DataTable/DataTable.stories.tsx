import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { SiriusDataTable, type ColumnContentType, type SortDirection } from './DataTable';
import { SiriusBadge } from '../Badge/Badge';
import { SiriusThumbnail } from '../Thumbnail/Thumbnail';

const standardColumnContentTypes: ColumnContentType[] = [
  'text',
  'numeric',
  'numeric',
  'numeric',
  'numeric',
];

const standardHeadings = [
  'Product',
  'Price',
  'SKU Number',
  'Net quantity',
  'Net sales',
];

const standardRows = [
  ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
  ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
  [
    'Navy Merino Wool Blazer with khaki chinos and yellow belt',
    '$445.00',
    124518,
    32,
    '$14,240.00',
  ],
];

const standardTotals = ['', '', '', 255, '$155,830.00'];

const meta = {
  title: 'All Components/DataTable',
  component: SiriusDataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    columnContentTypes: standardColumnContentTypes,
    headings: standardHeadings,
    rows: standardRows,
  },
} satisfies Meta<typeof SiriusDataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1. Default (Cas 1 de la capture Polaris) :
 * Titre « Sales by product », totaux affichés directement sous l'en-tête, montants alignés à droite.
 */
export const Default: Story = {
  render: () => (
    <SiriusDataTable
      title="Sales by product"
      columnContentTypes={standardColumnContentTypes}
      headings={standardHeadings}
      rows={standardRows}
      totals={standardTotals}
      sortable={[false, false, false, false, true]}
      defaultSortDirection="descending"
      initialSortColumnIndex={4}
    />
  ),
};


/**
 * 2. Sortable (Cas 2 de la capture Polaris) :
 * Colonnes triables avec indicateur de tri interactif (ex: tri sur 'Net sales').
 */
export const Sortable: Story = {
  render: () => {
    const [rows, setRows] = useState(standardRows);

    const handleSort = (index: number, direction: SortDirection) => {
      const sorted = [...rows].sort((a, b) => {
        const valA = a[index];
        const valB = b[index];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return direction === 'ascending' ? valA - valB : valB - valA;
        }
        const strA = String(valA).replace(/[^0-9.-]+/g, '');
        const strB = String(valB).replace(/[^0-9.-]+/g, '');
        const numA = parseFloat(strA);
        const numB = parseFloat(strB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return direction === 'ascending' ? numA - numB : numB - numA;
        }
        return direction === 'ascending'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
      setRows(sorted);
    };

    return (
      <SiriusDataTable
        title="Sales by product"
        columnContentTypes={standardColumnContentTypes}
        headings={standardHeadings}
        rows={rows}
        totals={standardTotals}
        sortable={[false, true, false, false, true]}
        defaultSortDirection="descending"
        initialSortColumnIndex={4}
        onSort={handleSort}
      />
    );
  },
};

/**
 * 3. With Footer (Cas 3 de la capture Polaris) :
 * Affiche un texte d'état ou de comptage en pied de tableau (« Showing 3 of 3 results »).
 */
export const WithFooter: Story = {
  render: () => (
    <SiriusDataTable
      title="Sales by product"
      columnContentTypes={standardColumnContentTypes}
      headings={standardHeadings}
      rows={standardRows}
      totals={standardTotals}
      footerContent="Showing 3 of 3 results"
    />
  ),
};

/**
 * 4. With Custom Totals Heading (Cas 4 de la capture Polaris) :
 * Ligne de totaux avec libellé personnalisé (« Total net sales ») placée en bas du tableau.
 */
export const WithCustomTotalsHeading: Story = {
  render: () => (
    <SiriusDataTable
      title="Sales by product"
      columnContentTypes={standardColumnContentTypes}
      headings={standardHeadings}
      rows={standardRows}
      totals={['', '', '', '', '$155,830.00']}
      totalsName="Total net sales"
      showTotalsInFooter
    />
  ),
};

/**
 * 5. With Totals In Footer (Cas 5 de la capture Polaris) :
 * Les totaux sont déplacés en pied de tableau au lieu d'apparaître sous l'en-tête.
 */
export const WithTotalsInFooter: Story = {
  render: () => (
    <SiriusDataTable
      title="Sales by product"
      columnContentTypes={standardColumnContentTypes}
      headings={standardHeadings}
      rows={standardRows}
      totals={standardTotals}
      showTotalsInFooter
    />
  ),
};

/**
 * 6. With Row Heading Links (Cas 6 de la capture Polaris) :
 * Les intitulés de la première colonne sont des liens hypertextes interactifs bleus.
 */
export const WithRowHeadingLinks: Story = {
  render: () => {
    const rowsWithLinks = [
      [
        <a className="sirius-data-table__link" href="#emerald" onClick={(e) => e.preventDefault()} key="1">
          Emerald Silk Gown
        </a>,
        '$875.00',
        124689,
        140,
        '$122,500.00',
      ],
      [
        <a className="sirius-data-table__link" href="#mauve" onClick={(e) => e.preventDefault()} key="2">
          Mauve Cashmere Scarf
        </a>,
        '$230.00',
        124533,
        83,
        '$19,090.00',
      ],
      [
        <a className="sirius-data-table__link" href="#blazer" onClick={(e) => e.preventDefault()} key="3">
          Navy Merino Wool Blazer with khaki chinos and yellow belt
        </a>,
        '$445.00',
        124518,
        32,
        '$14,240.00',
      ],
    ];

    return (
      <SiriusDataTable
        title="Sales by product"
        columnContentTypes={standardColumnContentTypes}
        headings={standardHeadings}
        rows={rowsWithLinks}
        totals={standardTotals}
      />
    );
  },
};

/**
 * 7. With All Of Its Elements (Cas 7 de la capture Polaris) :
 * Regroupe tous les éléments : titre, totaux en haut, liens sur les lignes, tri,
 * troncature d'intitulé avec ellipse et message de comptage en pied.
 */
export const WithAllOfItsElements: Story = {
  render: () => {
    const rowsWithLinksAndTruncate = [
      [
        <a className="sirius-data-table__link" href="#emerald" onClick={(e) => e.preventDefault()} key="1">
          Emerald Silk Gown
        </a>,
        '$875.00',
        124689,
        140,
        '$121,500.00',
      ],
      [
        <a className="sirius-data-table__link" href="#mauve" onClick={(e) => e.preventDefault()} key="2">
          Mauve Cashmere Scarf
        </a>,
        '$230.00',
        124533,
        83,
        '$19,090.00',
      ],
      [
        <a className="sirius-data-table__link" href="#blazer" onClick={(e) => e.preventDefault()} key="3">
          Navy Merino Wool Blazer with khaki chin...
        </a>,
        '$445.00',
        124518,
        32,
        '$14,240.00',
      ],
    ];

    return (
      <SiriusDataTable
        title="Sales by product"
        columnContentTypes={standardColumnContentTypes}
        headings={standardHeadings}
        rows={rowsWithLinksAndTruncate}
        totals={standardTotals}
        sortable={[false, false, false, false, true]}
        initialSortColumnIndex={4}
        footerContent="Showing 3 of 3 results"
        truncate
      />
    );
  },
};

/**
 * 8. With Column Spanning (Cas 8 de la capture Polaris) :
 * Table avec colonnes fusionnées ou informations groupées.
 */
export const WithColumnSpanning: Story = {
  render: () => (
    <SiriusDataTable
      title="Sales by product"
      columnContentTypes={['text', 'text', 'numeric', 'numeric']}
      headings={['Product', 'Details', 'Net quantity', 'Net sales']}
      rows={[
        ['Emerald Silk Gown', 'Collection Été • SKU 124689', 140, '$122,500.00'],
        ['Mauve Cashmere Scarf', 'Accessoire d’Hiver • SKU 124533', 83, '$19,090.00'],
        ['Navy Merino Wool Blazer', 'Sur-mesure • SKU 124518', 32, '$14,240.00'],
      ]}
      totals={['', '', 255, '$155,830.00']}
    />
  ),
};

/**
 * 9. With Fixed Columns (Cas 9 de la capture Polaris) :
 * Tableau large de 9 colonnes avec première colonne 'Product' figée lors du scroll horizontal.
 */
export const WithFixedColumns: Story = {
  render: () => {
    const wideColumnTypes: ColumnContentType[] = [
      'text',
      'text',
      'text',
      'numeric',
      'numeric',
      'numeric',
      'numeric',
      'numeric',
      'numeric',
    ];
    const wideHeadings = [
      'Product',
      'Category',
      'Vendor',
      'Orders',
      'Price',
      'SKU Number',
      'Net quantity',
      'Shipping',
      'Net sales',
    ];
    const wideRows = [
      ['Emerald Silk Gown', 'Formalwear', "Jill's formal", 10, '$875.00', 124689, 140, '$426.00', '$122,500.00'],
      ['Mauve Cashmere Scarf', 'Accessories', "Jack's Accessories", 253, '$230.00', 124533, 83, '$620.00', '$19,090.00'],
      ['Navy Merino Wool Bla...', 'Ensembles', 'Avocado Fashions', 23, '$445.00', 124518, 32, '$353.00', '$14,240.00'],
      ['Socks', 'Essentials', 'Avocado Fashions', 465, '$4.00', 124518, 32, '$3.00', '$140.00'],
    ];
    const wideTotals = ['', '', '', '', '', '', 255, '$1399', '$155,830.00'];

    return (
      <SiriusDataTable
        title="Sales by product"
        columnContentTypes={wideColumnTypes}
        headings={wideHeadings}
        rows={wideRows}
        totals={wideTotals}
        showTotalsInFooter
        fixedFirstColumns={1}
        footerContent="Showing 4 of 4 results"
      />
    );
  },
};

/**
 * 10. With Increased Density And Zebra Striping (Cas 10 de la capture Polaris) :
 * Hauteur de ligne plus compacte et rayures zébrées alternées pour faciliter la lecture.
 */
export const WithIncreasedDensityAndZebraStriping: Story = {
  render: () => {
    const rowsWithLinks = [
      [
        <a className="sirius-data-table__link" href="#emerald" onClick={(e) => e.preventDefault()} key="1">
          Emerald Silk Gown
        </a>,
        '$875.00',
        124689,
        140,
        '$121,500.00',
      ],
      [
        <a className="sirius-data-table__link" href="#mauve" onClick={(e) => e.preventDefault()} key="2">
          Mauve Cashmere Scarf
        </a>,
        '$230.00',
        124533,
        83,
        '$19,090.00',
      ],
      [
        <a className="sirius-data-table__link" href="#blazer" onClick={(e) => e.preventDefault()} key="3">
          Navy Merino Wool Blazer with khaki chinos and yellow belt
        </a>,
        '$445.00',
        124518,
        32,
        '$14,240.00',
      ],
    ];

    return (
      <SiriusDataTable
        title="Sales by product"
        columnContentTypes={standardColumnContentTypes}
        headings={standardHeadings}
        rows={rowsWithLinks}
        totals={standardTotals}
        increasedTableDensity
        hasZebraStriping
        footerContent="Showing 3 of 3 results"
      />
    );
  },
};

/**
 * 11. With Sticky Header Enabled (Cas 11 de la capture Polaris) :
 * L'en-tête de colonnes reste figé au sommet lors du défilement vertical d'un grand nombre de résultats.
 */
export const WithStickyHeaderEnabled: Story = {
  render: () => {
    // Génère 18 lignes identiques à la capture
    const manyRows: (React.ReactNode)[][] = [];
    const baseItems = [
      { name: 'Emerald Silk Gown', price: '$875.00', sku: 124689, qty: 140, total: '$121,500.00' },
      { name: 'Mauve Cashmere Scarf', price: '$230.00', sku: 124533, qty: 83, total: '$19,090.00' },
      {
        name: 'Navy Merino Wool Blazer with khaki chinos and yellow belt',
        price: '$445.00',
        sku: 124518,
        qty: 32,
        total: '$14,240.00',
      },
    ];

    for (let i = 0; i < 8; i++) {
      baseItems.forEach((item, idx) => {
        manyRows.push([
          <a className="sirius-data-table__link" href={`#item-${i}-${idx}`} onClick={(e) => e.preventDefault()} key={`${i}-${idx}`}>
            {item.name}
          </a>,
          item.price,
          item.sku,
          item.qty,
          item.total,
        ]);
      });
    }

    return (
      <SiriusDataTable
        title="Sales by product"
        columnContentTypes={standardColumnContentTypes}
        headings={standardHeadings}
        rows={manyRows}
        totals={standardTotals}
        stickyHeader
        hasZebraStriping
        footerContent="Showing 24 of 24 results"
      />
    );
  },
};


/**
 * 12. With Pagination (Cas 12 de la capture Polaris) :
 * Contrôle de pagination segmenté centré [ ‹ | › ] au bas du tableau.
 */
export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = 3;

    return (
      <SiriusDataTable
        title="Sales by product"
        columnContentTypes={standardColumnContentTypes}
        headings={standardHeadings}
        rows={standardRows}
        totals={standardTotals}
        pagination={{
          hasPrevious: page > 1,
          hasNext: page < totalPages,
          onPrevious: () => setPage((p) => Math.max(1, p - 1)),
          onNext: () => setPage((p) => Math.min(totalPages, p + 1)),
        }}
      />
    );
  },
};

/* --------------------------------------------------------------------------
   Listes de ressources : ce que faisait SiriusTable, fusionné ici le 2026-10-09
   -------------------------------------------------------------------------- */

const fcfa = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;

const commandes = [
  { numero: '#1042', cliente: 'Awa Diop', paiement: 'wave', statut: 'payee', total: 24000 },
  { numero: '#1043', cliente: 'Modou Fall', paiement: 'orange_money', statut: 'a_traiter', total: 8500 },
  { numero: '#1044', cliente: 'Fatou Sow', paiement: 'cash_on_delivery', statut: 'en_attente', total: 14900 },
  { numero: '#1045', cliente: 'Ousmane Ndiaye', paiement: 'wave', statut: 'payee', total: 14900 },
  { numero: '#1046', cliente: 'Aminata Ba', paiement: 'orange_money', statut: 'a_traiter', total: 32500 },
];
const commandesProps = {
  columnContentTypes: ['text', 'text', 'text', 'text', 'numeric'] as ColumnContentType[],
  headings: ['Commande', 'Cliente', 'Paiement', 'Statut', 'Total'],
  rows: commandes.map((c) => [
    c.numero,
    c.cliente,
    <SiriusBadge key="p" tone={c.paiement as 'wave'} kind={c.paiement} />,
    <SiriusBadge key="s" kind={c.statut} />,
    fcfa(c.total),
  ]),
  rowIds: commandes.map((c) => c.numero),
};

/** Liste de commandes : cases à cocher, barre d'actions groupées sur l'en-tête,
    clic sur une ligne pour l'ouvrir (ou la cocher dès qu'une sélection existe). */
export const Commandes: Story = {
  render: () => (
    <SiriusDataTable
      {...commandesProps}
      selectable
      onRowClick={(i) => alert(`Ouvrir ${commandes[i].numero}`)}
      bulkActions={{
        promotedActions: [{ content: 'Marquer comme préparées' }, { content: 'Imprimer les bons' }],
        actions: [{ content: 'Archiver' }, { content: 'Annuler les commandes', destructive: true }],
      }}
    />
  ),
};

const produits = [
  { nom: 'Sandales en cuir de Ngaye', statut: 'actif', stock: 0, variantes: 3, categorie: 'Sandales', canaux: 4, type: 'chaussures' },
  { nom: 'Boubou bazin riche brodé', statut: 'actif', stock: 49, categorie: 'Boubous', canaux: 3, type: 'vêtements' },
  { nom: 'Robe wax Ankara', statut: 'actif', stock: 100, variantes: 5, categorie: 'Robes', canaux: 3, type: 'vêtements' },
  { nom: 'Masque LED visage', statut: 'brouillon', stock: 20, canaux: 1, type: 'beauté' },
  { nom: 'Thiouraye de Diourbel', statut: 'actif', stock: 18, categorie: 'Parfums', canaux: 3, type: 'beauté' },
  { nom: 'Sac en raphia tressé', statut: 'archive', stock: 50, canaux: 1, type: 'accessoires' },
];
const badgeStatut: Record<string, React.ReactNode> = {
  actif: <SiriusBadge tone="success">Actif</SiriusBadge>,
  brouillon: <SiriusBadge tone="info">Brouillon</SiriusBadge>,
  archive: <SiriusBadge tone="neutral">Archivé</SiriusBadge>,
};

/** Liste des produits telle que l'admin de référence l'affiche : vignette,
    statut, stock en rouge à zéro. Une ligne fait 48 px avec la vignette. */
export const Produits: Story = {
  render: () => (
    <SiriusDataTable
      selectable
      columnContentTypes={['text', 'text', 'text', 'text', 'text', 'numeric', 'text']}
      headings={['', 'Produit', 'Statut', 'Stock', 'Catégorie', 'Canaux', 'Type de produit']}
      rows={produits.map((p) => [
        <SiriusThumbnail key="v" alt={p.nom} />,
        <span key="n" style={{ fontWeight: 550 }}>{p.nom}</span>,
        badgeStatut[p.statut],
        <span key="s">
          <span style={p.stock === 0 ? { color: 'var(--s-color-text-critical-accent)' } : undefined}>{p.stock} en stock</span>
          {p.variantes ? ` pour ${p.variantes} variantes` : ''}
        </span>,
        p.categorie ?? '',
        p.canaux,
        p.type,
      ])}
      bulkActions={{
        promotedActions: [{ content: 'Modifier les produits' }, { content: 'Mettre en ligne' }],
        actions: [{ content: 'Archiver' }, { content: 'Supprimer les produits', destructive: true }],
      }}
    />
  ),
};

export const LignesTeintees: Story = {
  render: () => (
    <SiriusDataTable
      {...commandesProps}
      selectable
      rowTone={(i) => (['success', 'warning', 'critical', 'subdued', undefined] as const)[i]}
      isRowDisabled={(i) => i === 4}
    />
  ),
};

export const Chargement: Story = {
  render: () => <SiriusDataTable {...commandesProps} loading loadingLabel="Chargement des commandes…" />,
};

export const Vide: Story = {
  render: () => <SiriusDataTable {...commandesProps} rows={[]} emptyState="Aucune commande pour le moment." />,
};
