import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusFilters, type SiriusFilterDescriptor, type SiriusFiltersProps, type SiriusFiltersValue } from './Filters';
import { SiriusButton } from '../Button/Button';

const choix = (...labels: string[]) => labels.map(l => ({ value: l, label: l }));

// Les filtres de l'écran Produits.
const FILTRES: SiriusFilterDescriptor[] = [
  { key: 'statut', label: 'Statut', choices: choix('En ligne', 'Brouillon'), negatable: true },
  { key: 'collection', label: 'Collection', choices: choix('Boubous', 'Robes', 'Tissus wax', 'Accessoires', 'Sacs'), negatable: true },
  { key: 'type', label: 'Type', choices: choix('Physique', 'Numérique'), allowMultiple: false },
  { key: 'stock', label: 'Stock', choices: choix('En stock', 'Rupture', 'Non suivi'), negatable: true },
  { key: 'avant', label: 'Mis en avant', choices: choix('Oui', 'Non'), allowMultiple: false },
];

type Options = { desactives?: string[]; depart?: SiriusFiltersValue } & Partial<SiriusFiltersProps>;

/** La barre telle qu'un écran la branche : la recherche et les filtres vivent chez le parent. */
function Demo({ desactives = [], depart = {}, ...props }: Options) {
  const [q, setQ] = useState('');
  const [valeur, setValeur] = useState<SiriusFiltersValue>(depart);
  return (
    <SiriusFilters
      queryValue={q}
      queryPlaceholder="Rechercher un produit"
      onQueryChange={setQ}
      filters={FILTRES.map(f => ({ ...f, disabled: desactives.includes(f.key) }))}
      value={valeur}
      onChange={setValeur}
      {...props}
    />
  );
}

const meta = {
  title: 'All Components/Filters',
  component: SiriusFilters,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  // De la place sous la barre pour la fenêtre.
  decorators: [(Story) => <div style={{ maxWidth: 720, minHeight: 380 }}><Story /></div>],
  args: { filters: [], value: {}, onChange: () => {} },
} satisfies Meta<typeof SiriusFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clique dans le champ : les filtres apparaissent. Flèches pour choisir, Entrée pour ouvrir ou cocher. */
export const Defaut: Story = { render: () => <Demo /> };

const APPLIQUES: SiriusFiltersValue = {
  statut: { values: ['En ligne'] },
  collection: { values: ['Boubous', 'Robes', 'Tissus wax', 'Sacs'] },
};

/** Nom en gris, valeurs en bleu ; au-delà de trois valeurs, « + 1 de plus ». */
export const AvecFiltresAppliques: Story = { render: () => <Demo depart={APPLIQUES} /> };

export const AvecNegation: Story = { render: () => <Demo depart={{ stock: { values: ['Rupture'], negated: true } }} /> };

/** Du contenu à droite du champ : ici le menu de tri. */
export const AvecContenuADroite: Story = {
  render: () => <Demo><SiriusButton variant="secondary">Trier</SiriusButton></Demo>,
};

/** Un filtre désactivé ne figure pas dans les suggestions. */
export const CertainsDesactives: Story = { render: () => <Demo desactives={['type', 'avant']} /> };

export const Desactive: Story = { render: () => <Demo disabled depart={{ statut: { values: ['Brouillon'] } }} /> };

/** Toutes les options, rangées comme dans l'admin de référence. */
export const Toutes: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {([
        ['Par défaut', <Demo />],
        ['Filtres appliqués', <Demo depart={APPLIQUES} />],
        ['Négation', <Demo depart={{ stock: { values: ['Rupture'], negated: true } }} />],
        ['Contenu à droite', <Demo><SiriusButton variant="secondary">Trier</SiriusButton></Demo>],
        ['Certains désactivés', <Demo desactives={['type', 'avant']} />],
        ['Désactivé', <Demo disabled depart={{ statut: { values: ['Brouillon'] } }} />],
      ] as const).map(([titre, demo]) => (
        <section key={titre} style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>{titre}</span>
          {demo}
        </section>
      ))}
    </div>
  ),
};
