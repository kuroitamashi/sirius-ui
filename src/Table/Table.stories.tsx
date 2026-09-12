import type { Meta, StoryObj } from '@storybook/react-vite';
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
  title: 'Donnees/Table',
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
      label: '1 a 3 sur 47',
      onNext: () => {},
      onPrevious: () => {},
    },
  },
};

export const Vide: Story = {
  args: { data: [], emptyState: 'Aucune commande pour le moment.' },
};

export const LignesCliquables: Story = {
  args: { onRowClick: (row: Commande) => alert(`Ouvrir ${row.numero}`) },
};

/**
 * `embedded` retire la bordure exterieure, pour poser le tableau dans une
 * SiriusCard en `padded={false}`.
 */
export const Embarque: Story = {
  args: { embedded: true },
};
