import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusBulkActions, type SiriusBulkActionsProps } from './BulkActions';
import { SiriusCheckbox } from '../Form/Checkbox';

const meta = {
  title: 'All Components/BulkActions',
  component: SiriusBulkActions,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiriusBulkActions>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROBES = [
  'Robe wax Ndeye',
  'Boubou brodé Awa',
  'Ensemble bazin Fatou',
  'Jupe pagne Mariama',
  'Chemise wax Modou',
];

/**
 * Une liste qui se coche. La barre n'existe que tant qu'au moins une ligne
 * est cochée, et remplace alors l'en-tête de la liste.
 */
function Liste(props: Pick<SiriusBulkActionsProps, 'promotedActions' | 'actions'> & { largeur?: number }) {
  const [coches, setCoches] = useState<Set<number>>(new Set([0, 2]));
  const [seulement, setSeulement] = useState(false);
  const basculer = (i: number) =>
    setCoches((c) => {
      const n = new Set(c);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <div
      style={{
        maxWidth: props.largeur,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
        overflow: 'visible',
      }}
    >
      {coches.size > 0 ? (
        <div style={{ borderRadius: '12px 12px 0 0' }}>
          <SiriusBulkActions
            selectedCount={coches.size}
            totalCount={ROBES.length}
            onToggleAll={(tout) => setCoches(tout ? new Set(ROBES.map((_, i) => i)) : new Set())}
            promotedActions={props.promotedActions}
            actions={props.actions}
            showSelected={{ checked: seulement, onChange: setSeulement }}
          />
        </div>
      ) : (
        <div style={{ padding: '10px 12px', fontSize: 12, color: '#616161', borderBottom: '1px solid #ebebeb' }}>
          Coche une ligne pour voir la barre d'actions groupées.
        </div>
      )}
      {ROBES.map((nom, i) => (seulement && coches.size > 0 && !coches.has(i) ? null : (
        <div
          key={nom}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 12px',
            fontSize: 13,
            background: coches.has(i) ? '#f7f7f7' : undefined,
            borderTop: i ? '1px solid #f1f1f1' : undefined,
          }}
        >
          <SiriusCheckbox checked={coches.has(i)} onChange={() => basculer(i)} label={nom} />
        </div>
      )))}
    </div>
  );
}

const PRODUITS: SiriusBulkActionsProps['promotedActions'] = [
  { content: 'Mettre en ligne', onAction: () => {} },
  { content: 'Passer en brouillon', onAction: () => {} },
  { content: 'Supprimer', destructive: true, onAction: () => {} },
];

/** Écran Produits. Coche et décoche pour voir la barre vivre. */
export const Defaut: Story = {
  args: { selectedCount: 2, totalCount: 5, onToggleAll: () => {} },
  render: () => (
    <Liste
      promotedActions={PRODUITS}
      actions={[
        { content: 'Changer de catégorie', icon: 'collection' },
        { content: 'Exporter la sélection', icon: 'export' },
      ]}
    />
  ),
};

/** Écran Commandes : même barre, autres actions, dont un bouton à menu. */
export const Commandes: Story = {
  args: { selectedCount: 2, totalCount: 5, onToggleAll: () => {} },
  render: () => (
    <Liste
      promotedActions={[
        { content: 'Marquer comme expédiées', onAction: () => {} },
        {
          title: 'Imprimer',
          actions: [
            { content: 'Les bons de livraison', icon: 'print' },
            { content: 'Les commandes', icon: 'print' },
          ],
        },
      ]}
      actions={[{ content: 'Archiver', icon: 'archive' }]}
    />
  ),
};

/**
 * Sur un téléphone de 360 px, les boutons qui ne tiennent pas passent
 * d'eux-mêmes dans le menu « … ».
 */
export const PeuDePlace: Story = {
  args: { selectedCount: 2, totalCount: 5, onToggleAll: () => {} },
  render: () => <Liste largeur={360} promotedActions={PRODUITS} actions={[{ content: 'Exporter la sélection' }]} />,
};
