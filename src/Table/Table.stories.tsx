import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SiriusTable } from './Table';
import { SiriusBadge } from '../Badge/Badge';
import { SiriusThumbnail } from '../Thumbnail/Thumbnail';

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

type Produit = { id: string; nom: string; statut: 'actif' | 'brouillon' | 'archive'; stock: number; variantes?: number; categorie?: string; canaux: number; type: string };

const produits: Produit[] = [
  { id: 'p1', nom: 'Sandales en cuir de Ngaye', statut: 'actif', stock: 0, variantes: 3, categorie: 'Sandales', canaux: 4, type: 'chaussures' },
  { id: 'p2', nom: 'Boubou bazin riche brodé', statut: 'actif', stock: 49, categorie: 'Boubous', canaux: 3, type: 'vêtements' },
  { id: 'p3', nom: 'Robe wax Ankara', statut: 'actif', stock: 100, variantes: 5, categorie: 'Robes', canaux: 3, type: 'vêtements' },
  { id: 'p4', nom: 'Masque LED visage', statut: 'brouillon', stock: 20, canaux: 1, type: 'beauté' },
  { id: 'p5', nom: 'Thiouraye de Diourbel', statut: 'actif', stock: 18, categorie: 'Parfums', canaux: 3, type: 'beauté' },
  { id: 'p6', nom: 'Sac en raphia tressé', statut: 'archive', stock: 50, canaux: 1, type: 'accessoires' },
];

const badgeStatut = { actif: <SiriusBadge tone="success">Actif</SiriusBadge>, brouillon: <SiriusBadge tone="info">Brouillon</SiriusBadge>, archive: <SiriusBadge tone="neutral">Archivé</SiriusBadge> };

/** Liste des produits telle que l'admin de référence l'affiche : à plat, vignette, statut, stock en rouge à zéro. */
export const Produits: Story = {
  render: () => (
    <SiriusTable<Produit>
      selectable
      data={produits}
      columns={[
        { key: 'vignette', title: '', width: '36px', render: (p) => <SiriusThumbnail alt={p.nom} /> },
        { key: 'nom', title: 'Produit', render: (p) => <span style={{ fontWeight: 550 }}>{p.nom}</span> },
        { key: 'statut', title: 'Statut', render: (p) => badgeStatut[p.statut] },
        {
          key: 'stock',
          title: 'Stock',
          render: (p) => (
            <>
              <span style={p.stock === 0 ? { color: 'var(--s-color-text-critical-accent)' } : undefined}>{p.stock} en stock</span>
              {p.variantes ? ` pour ${p.variantes} variantes` : ''}
            </>
          ),
        },
        { key: 'categorie', title: 'Catégorie' },
        { key: 'canaux', title: 'Canaux', numeric: true },
        { key: 'type', title: 'Type de produit' },
      ]}
      bulkActions={{ promotedActions: [{ content: 'Modifier les produits' }, { content: 'Mettre en ligne' }], actions: [{ content: 'Archiver' }, { content: 'Supprimer les produits', destructive: true }] }}
    />
  ),
};
