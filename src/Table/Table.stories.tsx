import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SiriusTable } from './Table';
import { SiriusBadge } from '../Badge/Badge';

type Commande = {
  numero: string;
  cliente: string;
  paiement: 'wave' | 'orange_money' | 'cash_on_delivery';
  statut: string;
  total: number;
};

const commandes: Commande[] = [
  { numero: '#1042', cliente: 'Awa Diop', paiement: 'wave', statut: 'payee', total: 24000 },
  { numero: '#1043', cliente: 'Modou Fall', paiement: 'orange_money', statut: 'a_traiter', total: 8500 },
  { numero: '#1044', cliente: 'Fatou Sow', paiement: 'cash_on_delivery', statut: 'en_attente', total: 14900 },
  { numero: '#1045', cliente: 'Ousmane Ndiaye', paiement: 'wave', statut: 'payee', total: 14900 },
  { numero: '#1046', cliente: 'Aminata Ba', paiement: 'orange_money', statut: 'a_traiter', total: 32500 },
];

const fcfa = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;

const columns = [
  { key: 'numero', title: 'Commande' },
  { key: 'cliente', title: 'Cliente' },
  {
    key: 'paiement',
    title: 'Paiement',
    render: (row: Commande) => <SiriusBadge tone={row.paiement} kind={row.paiement} />,
  },
  {
    key: 'statut',
    title: 'Statut',
    render: (row: Commande) => <SiriusBadge kind={row.statut} />,
  },
  {
    key: 'total',
    title: 'Total',
    numeric: true,
    render: (row: Commande) => fcfa(row.total),
  },
];

const meta = {
  title: 'All Components/Table',
  component: SiriusTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { columns, data: commandes },
} satisfies Meta<typeof SiriusTable<Commande>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

export const AvecPagination: Story = {
  args: {
    pagination: {
      hasPrevious: false,
      hasNext: true,
      label: '1 à 5 sur 47',
      onNext: () => {},
      onPrevious: () => {},
    },
  },
};

export const Vide: Story = {
  args: { data: [], emptyState: 'Aucune commande pour le moment.' },
};

export const LignesCliquables: Story = {
  // Meta ne propage pas le generique aux args : la ligne arrive en unknown.
  args: { onRowClick: (row) => alert(`Ouvrir ${(row as Commande).numero}`) },
};

/**
 * `embedded` retire la bordure exterieure, pour poser le tableau dans une
 * SiriusCard en `padded={false}`.
 */
export const Embarque: Story = {
  args: { embedded: true },
};

const getRowId = (row: Commande) => row.numero;

/** Cases à cocher : dès qu'une ligne est cochée, la barre d'actions groupées
    recouvre l'en-tête, et cliquer une ligne la coche au lieu de l'ouvrir. */
export const AvecSelection: Story = {
  render: () => (
    <SiriusTable<Commande>
      columns={columns}
      data={commandes}
      getRowId={getRowId}
      selectable
      onRowClick={(row) => alert(`Ouvrir ${row.numero}`)}
      bulkActions={{
        promotedActions: [{ content: 'Marquer comme préparées' }, { content: 'Imprimer les bons' }],
        actions: [{ content: 'Archiver' }, { content: 'Annuler les commandes', destructive: true }],
      }}
    />
  ),
};

export const LignesTeintees: Story = {
  render: () => (
    <SiriusTable<Commande>
      columns={columns}
      data={commandes}
      getRowId={getRowId}
      selectable
      rowTone={(row) => ({ '#1042': 'success', '#1043': 'warning', '#1044': 'critical', '#1045': 'subdued' } as const)[row.numero]}
      isRowDisabled={(row) => row.numero === '#1046'}
    />
  ),
};

export const Triable: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: string; dir: 'ascending' | 'descending' }>({ key: 'total', dir: 'descending' });
    const sorted = [...commandes].sort((a, b) => {
      const x = (a as any)[sort.key], y = (b as any)[sort.key];
      return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === 'ascending' ? 1 : -1);
    });
    return (
      <SiriusTable<Commande>
        columns={columns.map((c) => (['numero', 'cliente', 'total'].includes(c.key) ? { ...c, sortable: true } : c))}
        data={sorted}
        getRowId={getRowId}
        sortColumn={sort.key}
        sortDirection={sort.dir}
        onSort={(key, dir) => setSort({ key, dir })}
      />
    );
  },
};

export const Chargement: Story = { args: { loading: true, loadingLabel: 'Chargement des commandes…' } };

export const Rayures: Story = { args: { zebra: true } };
